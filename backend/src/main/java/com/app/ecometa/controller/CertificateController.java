package com.app.ecometa.controller;

import java.io.ByteArrayOutputStream;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.ecometa.entity.User;
import com.app.ecometa.repository.UserRepo;
import com.app.ecometa.service.CertificateService;
import com.app.ecometa.service.EmailService;

@RestController
@RequestMapping("/certificate")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EmailService emailService;

    // ✅ Auto-generate certificate when a recycler accepts an item
    @PostMapping("/generate/{userId}")
    public ResponseEntity<?> generateCertificate(@PathVariable Long userId) {
        Optional<User> userOpt = userRepo.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"User not found\"}");
        }

        User user = userOpt.get();

        // Ensure the user is eligible for a certificate
        if (!user.isCertified()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"User is not eligible for a certificate\"}");
        }

        // Get recycled amount from User entity
        int recycledAmount = user.getRecycledAmount();

        // Generate certificate PDF
        ByteArrayOutputStream certificate = certificateService.generateCertificate(user, recycledAmount);

        // Send the certificate via email
        emailService.sendCertificate(user.getEmail(), certificate);

        return ResponseEntity.ok("{\"message\": \"Certificate generated and sent successfully.\"}");
    }
}
