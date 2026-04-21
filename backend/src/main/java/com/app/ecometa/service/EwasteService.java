package com.app.ecometa.service;

import com.app.ecometa.entity.EwasteItem;
import com.app.ecometa.entity.User;
import com.app.ecometa.enums.Enums.Status;
import com.app.ecometa.exception.ConflictException;
import com.app.ecometa.exception.ResourceNotFoundException;
import com.app.ecometa.repository.EwasteItemRepo;
import com.app.ecometa.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.io.ByteArrayOutputStream;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class EwasteService {

    @Autowired
    private EwasteItemRepo ewasteItemRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public EwasteItem submitEwaste(EwasteItem ewasteItem) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof User)) {
            throw new ResourceNotFoundException("Authenticated user not found in context");
        }
        User user = (User) principal;

        ewasteItem.setUser(user);
        ewasteItem.setStatus(Status.SUBMITTED);
        return ewasteItemRepo.save(ewasteItem);
    }

    public List<EwasteItem> getUserEwaste(String userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return ewasteItemRepo.findByUser(user);
    }

    public List<EwasteItem> getEwasteForRecycler(String recyclerId, Status status) {
        if (recyclerId != null && !recyclerId.isEmpty()) {
            return ewasteItemRepo.findByRecycler_IdAndStatus(recyclerId, status);
        }
        return ewasteItemRepo.findByStatus(status);
    }

    public EwasteItem acceptEwaste(String ewasteId) {
        User recycler = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        EwasteItem ewasteItem = ewasteItemRepo.findById(ewasteId)
                .orElseThrow(() -> new ResourceNotFoundException("E-waste item not found: " + ewasteId));

        if (ewasteItem.getStatus() != Status.SUBMITTED && ewasteItem.getStatus() != Status.PENDING) {
            throw new ConflictException("Item is already accepted or processed. Status: " + ewasteItem.getStatus());
        }

        ewasteItem.setRecycler(recycler);
        ewasteItem.setStatus(Status.ACCEPTED);
        return ewasteItemRepo.save(ewasteItem);
    }

    public EwasteItem schedulePickup(String ewasteId, String scheduledTimeIso) {
        User recycler = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        EwasteItem ewasteItem = ewasteItemRepo.findById(ewasteId)
                .orElseThrow(() -> new ResourceNotFoundException("E-waste item not found: " + ewasteId));

        if (ewasteItem.getRecycler() == null || !ewasteItem.getRecycler().getId().equals(recycler.getId())) {
            throw new ConflictException("Unauthorized: You are not the assigned recycler for this item.");
        }

        try {
            java.time.LocalDateTime ldt = java.time.LocalDateTime.parse(scheduledTimeIso, java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            Date scheduledDate = Date.from(ldt.atZone(java.time.ZoneId.systemDefault()).toInstant());
            ewasteItem.setScheduledPickupTime(scheduledDate);
        } catch (Exception e) {
            try {
                ewasteItem.setScheduledPickupTime(new Date(scheduledTimeIso));
            } catch (Exception e2) {
                throw new ConflictException("Invalid date format: " + scheduledTimeIso);
            }
        }

        EwasteItem saved = ewasteItemRepo.save(ewasteItem);
        
        // Push notification via WebSocket topic for this item
        messagingTemplate.convertAndSend("/topic/ewaste/" + ewasteId, 
            Map.of("type", "SCHEDULE_UPDATE", "scheduledTime", scheduledTimeIso));
            
        return saved;
    }

    public EwasteItem collectEwaste(String ewasteId) {
        User recycler = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        EwasteItem ewasteItem = ewasteItemRepo.findById(ewasteId)
                .orElseThrow(() -> new ResourceNotFoundException("E-waste item not found: " + ewasteId));

        if (!ewasteItem.getRecycler().getId().equals(recycler.getId())) {
            throw new ConflictException("Unauthorized: You are not the assigned recycler for this item.");
        }

        if (ewasteItem.getStatus() != Status.ACCEPTED) {
            throw new ConflictException("Item must be in ACCEPTED status to be COLLECTED. Current status: " + ewasteItem.getStatus());
        }

        ewasteItem.setStatus(Status.COLLECTED);
        ewasteItem.setCollectedAt(new Date());
        EwasteItem saved = ewasteItemRepo.save(ewasteItem);

        mongoTemplate.update(User.class)
                .matching(new Query(where("id").is(ewasteItem.getUser().getId())))
                .apply(new Update().inc("recycledCount", ewasteItem.getQuantity()).set("isCertified", true))
                .first();

        User user = userRepo.findById(ewasteItem.getUser().getId()).orElse(null);
        if (user != null) {
            try {
                ByteArrayOutputStream certificate = certificateService.generateCertificate(user, user.getRecycledCount());
                emailService.sendCertificate(user.getEmail(), certificate);
            } catch (Exception e) {
                System.err.println("Failed to send certificate: " + e.getMessage());
            }
        }

        return saved;
    }

    public EwasteItem markAsRecycled(String ewasteId) {
        User recycler = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        EwasteItem ewasteItem = ewasteItemRepo.findById(ewasteId)
                .orElseThrow(() -> new ResourceNotFoundException("E-waste item not found: " + ewasteId));

        if (ewasteItem.getRecycler() == null || !ewasteItem.getRecycler().getId().equals(recycler.getId())) {
            throw new ConflictException("Unauthorized: You are not the assigned recycler for this item.");
        }

        if (ewasteItem.getStatus() != Status.COLLECTED) {
            throw new ConflictException("Item must be in COLLECTED status to be marked as RECYCLED. Current status: " + ewasteItem.getStatus());
        }

        // Calculate EcoPoints
        int basePoints = switch (ewasteItem.getType()) {
            case LAPTOP -> 100;
            case PHONE -> 50;
            case BATTERY -> 20;
            case TV -> 80;
            case APPLIANCE -> 150;
            case OTHER -> 30;
        };

        double multiplier = switch (ewasteItem.getItem_condition()) {
            case WORKING -> 1.5;
            case PARTIALLY_WORKING -> 1.2;
            default -> 1.0;
        };

        int totalPointsAwarded = (int) (basePoints * multiplier * ewasteItem.getQuantity());

        ewasteItem.setStatus(Status.RECYCLED);
        EwasteItem saved = ewasteItemRepo.save(ewasteItem);

        // Update User's EcoPoints
        mongoTemplate.update(User.class)
                .matching(new Query(where("id").is(ewasteItem.getUser().getId())))
                .apply(new Update().inc("ecoPoints", totalPointsAwarded))
                .first();

        // Push real-time notification
        messagingTemplate.convertAndSend("/topic/ewaste/" + ewasteId, 
            Map.of(
                "type", "RECYCLE_COMPLETE", 
                "pointsEarned", totalPointsAwarded,
                "status", "RECYCLED"
            ));

        return saved;
    }

    public EwasteItem rejectEwaste(String ewasteId) {
        User recycler = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        EwasteItem ewasteItem = ewasteItemRepo.findById(ewasteId)
                .orElseThrow(() -> new ResourceNotFoundException("E-waste item not found: " + ewasteId));

        ewasteItem.setRecycler(recycler);
        ewasteItem.setStatus(Status.REJECTED);
        EwasteItem saved = ewasteItemRepo.save(ewasteItem);

        emailService.sendRejectionEmail(ewasteItem.getUser().getEmail(), ewasteItem.getType().name());

        return saved;
    }
}
