package com.app.ecometa.controller;

import com.app.ecometa.entity.User;
import com.app.ecometa.exception.EcometaException;
import com.app.ecometa.service.CertificateService;
import com.app.ecometa.service.EmailService;
import com.app.ecometa.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/certificate")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/generate/{userId}")
    public ResponseEntity<String> generateCertificate(@PathVariable String userId) {
        User user = userService.getUserById(userId);

        if (!user.isCertified()) {
            throw new EcometaException("User is not eligible for a certificate (required amount not reached)");
        }

        int recycledAmount = user.getRecycledCount();
        ByteArrayOutputStream certificate = certificateService.generateCertificate(user, recycledAmount);
        emailService.sendCertificate(user.getEmail(), certificate);

        return ResponseEntity.ok("Certificate generated and sent successfully.");
    }
}
