package com.app.ecometa.controller;

import com.app.ecometa.entity.EwasteItem;
import com.app.ecometa.enums.Enums.Status;
import com.app.ecometa.service.EwasteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ewaste")
public class EwasteItemController {

    @Autowired
    private EwasteService ewasteService;

    @PostMapping("/submit")
    public ResponseEntity<EwasteItem> submitEwaste(@RequestBody EwasteItem ewasteItem) {
        return new ResponseEntity<>(ewasteService.submitEwaste(ewasteItem), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EwasteItem>> getUserEwaste(@PathVariable String userId) {
        return ResponseEntity.ok(ewasteService.getUserEwaste(userId));
    }

    @GetMapping("/recycler")
    public ResponseEntity<List<EwasteItem>> getEwasteForRecycler(
            @RequestParam(required = false) String recyclerId,
            @RequestParam(required = false, defaultValue = "SUBMITTED") Status status) {
        
        // If it's a request for ACCEPTED items and no ID is provided, use the currently logged-in user
        if (status == Status.ACCEPTED && (recyclerId == null || recyclerId.isEmpty())) {
            try {
                com.app.ecometa.entity.User currentUser = (com.app.ecometa.entity.User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                recyclerId = currentUser.getId();
            } catch (Exception e) {
                // Fallback for non-authenticated testing if needed, though likely won't happen here
            }
        }
        
        return ResponseEntity.ok(ewasteService.getEwasteForRecycler(recyclerId, status));
    }

    @PutMapping("/accept/{id}")
    public ResponseEntity<EwasteItem> acceptEwaste(@PathVariable String id) {
        return ResponseEntity.ok(ewasteService.acceptEwaste(id));
    }

    @PutMapping("/schedule/{id}")
    public ResponseEntity<EwasteItem> schedulePickup(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String scheduledTime = payload.get("scheduledTime");
        return ResponseEntity.ok(ewasteService.schedulePickup(id, scheduledTime));
    }

    @PutMapping("/collect/{id}")
    public ResponseEntity<EwasteItem> collectEwaste(@PathVariable String id) {
        return ResponseEntity.ok(ewasteService.collectEwaste(id));
    }

    @PutMapping("/recycle/{id}")
    public ResponseEntity<EwasteItem> markAsRecycled(@PathVariable String id) {
        return ResponseEntity.ok(ewasteService.markAsRecycled(id));
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<EwasteItem> rejectEwaste(@PathVariable String id) {
        return ResponseEntity.ok(ewasteService.rejectEwaste(id));
    }
}
