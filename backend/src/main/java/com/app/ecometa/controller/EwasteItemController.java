package com.app.ecometa.controller;

import com.app.ecometa.entity.EwasteItem;
import com.app.ecometa.entity.User;
import com.app.ecometa.enums.Enums.Status;
import com.app.ecometa.repository.EwasteItemRepo;
import com.app.ecometa.repository.UserRepo;
import com.app.ecometa.service.CertificateService;
import com.app.ecometa.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/ewaste")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class EwasteItemController {

    private static final Logger logger = Logger.getLogger(EwasteItemController.class.getName());

    @Autowired
    private EwasteItemRepo ewasteItemRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private EmailService emailService;

    // ✅ Submit new e-waste entry
    @PostMapping("/submit")
    public ResponseEntity<String> submitEwaste(@RequestBody EwasteItem ewasteItem) {
        if (ewasteItem.getUser() == null || ewasteItem.getUser().getId() == null) {
            return ResponseEntity.badRequest().body("User ID is missing in the request body!");
        }

        Optional<User> userOptional = userRepo.findById(ewasteItem.getUser().getId());
        if (userOptional.isPresent()) {
            ewasteItem.setUser(userOptional.get());
            ewasteItem.setStatus(Status.PENDING);
            ewasteItemRepo.save(ewasteItem);
            return ResponseEntity.ok("E-Waste submitted successfully!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid User ID!");
    }

    // ✅ Get all e-waste submissions for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EwasteItem>> getUserEwaste(@PathVariable Long userId) {
        Optional<User> userOptional = userRepo.findById(userId);
        return userOptional
                .map(user -> ResponseEntity.ok(ewasteItemRepo.findByUser(user)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // ✅ Recycler Dashboard - Get pending e-waste items
    @GetMapping("/recycler")
    public ResponseEntity<List<EwasteItem>> getPendingEwasteForRecyclers() {
        return ResponseEntity.ok(ewasteItemRepo.findByStatus(Status.PENDING));
    }

    // ✅ Recycler accepts e-waste & checks for certificate eligibility
    @PutMapping("/accept/{ewasteId}")
    public ResponseEntity<String> acceptEwaste(@PathVariable Long ewasteId, @RequestParam Long recyclerId) {
        Optional<EwasteItem> ewasteOptional = ewasteItemRepo.findById(ewasteId);
        Optional<User> recyclerOptional = userRepo.findById(recyclerId);

        if (ewasteOptional.isEmpty() || recyclerOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid e-waste ID or recycler ID!");
        }

        EwasteItem ewasteItem = ewasteOptional.get();
        ewasteItem.setRecycler(recyclerOptional.get());
        ewasteItem.setStatus(Status.RECYCLED);
        ewasteItemRepo.save(ewasteItem);

        // ✅ Calculate total recycled amount
        User user = ewasteItem.getUser();
        int totalRecycled = ewasteItemRepo.findByUserAndStatus(user, Status.RECYCLED)
                                          .stream()
                                          .mapToInt(EwasteItem::getQuantity)
                                          .sum();

        // ✅ Generate certificate if the user has recycled at least 1 unit
        if (totalRecycled >= 1) {
            user.setCertified(true);
            userRepo.save(user);

            // ✅ Generate PDF certificate
            ByteArrayOutputStream certificate = certificateService.generateCertificate(user, totalRecycled);

            // ✅ Send certificate via email
            emailService.sendCertificate(user.getEmail(), certificate);

            return ResponseEntity.ok("E-Waste marked as recycled! Certificate sent to user.");
        }

        return ResponseEntity.ok("E-Waste marked as recycled!");
    }

    // ✅ Recycler rejects e-waste
    // ✅ Recycler rejects e-waste
@PutMapping("/reject/{ewasteId}")
public ResponseEntity<String> rejectEwaste(@PathVariable Long ewasteId, @RequestParam Long recyclerId) {
    Optional<EwasteItem> ewasteOptional = ewasteItemRepo.findById(ewasteId);
    Optional<User> recyclerOptional = userRepo.findById(recyclerId);

    if (ewasteOptional.isEmpty() || recyclerOptional.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid e-waste ID or recycler ID!");
    }

    EwasteItem ewasteItem = ewasteOptional.get();
    ewasteItem.setRecycler(recyclerOptional.get());
    ewasteItem.setStatus(Status.CANCELLED);
    ewasteItemRepo.save(ewasteItem);

    // ✅ Convert EwasteType to String before sending the email
    try {
        emailService.sendRejectionEmail(ewasteItem.getUser().getEmail(), ewasteItem.getType().name());
        return ResponseEntity.ok("E-Waste submission rejected and user notified.");
    } catch (Exception e) {
        logger.severe("Error sending rejection email: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("E-Waste rejected, but email notification failed.");
    }
}

}
