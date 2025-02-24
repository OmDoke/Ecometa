package com.app.ecometa.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.logging.Logger;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    private static final Logger logger = Logger.getLogger(EmailService.class.getName());

    @Async // Asynchronous email sending
    public void sendCertificate(String recipientEmail, ByteArrayOutputStream certificate) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Set recipient, subject, and message body
            helper.setTo(recipientEmail);
            helper.setSubject("Your Recycling Certificate");
            helper.setText("Congratulations!\n\nYou have successfully recycled e-waste. " +
                    "Please find your certificate attached.\n\nBest regards,\nEcoMeta Team");

            // Attach PDF Certificate
            helper.addAttachment("Recycling-Certificate.pdf", new ByteArrayResource(certificate.toByteArray()));

            // Send email
            emailSender.send(message);
            logger.info("Certificate email sent successfully to " + recipientEmail);

        } catch (MessagingException e) {
            logger.severe("Error sending certificate email to " + recipientEmail + ": " + e.getMessage());
        }
    }

    public void sendRejectionEmail(String recipientEmail, String wasteType) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
    
            // Email Subject & Body
            String subject = "E-Waste Submission Rejected";
            String body = "<p>Dear User,</p>"
                        + "<p>We regret to inform you that your e-waste submission for <strong>" + wasteType + "</strong> has been rejected.</p>"
                        + "<p>Please review the submission details and try again.</p>"
                        + "<p>If you have any questions, feel free to contact us.</p>"
                        + "<br><p>Best regards,<br><strong>EcoMeta Team</strong></p>";
    
            // Set Email Details
            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(body, true); // Set 'true' to enable HTML formatting
    
            // Send Email
            emailSender.send(message);
            logger.info("Rejection email sent successfully to " + recipientEmail);
    
        } catch (MessagingException e) {
            logger.severe("Error sending rejection email to " + recipientEmail + ": " + e.getMessage());
        }
    }
    
    
}
