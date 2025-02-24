package com.app.ecometa.service;

import com.app.ecometa.entity.User;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class CertificateService {

    public ByteArrayOutputStream generateCertificate(User user, int recycledAmount) {
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();

            // Formatting Certificate
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD);
            Font textFont = new Font(Font.FontFamily.HELVETICA, 14);

            document.add(new Paragraph("Certificate of E-waste Recycling", titleFont));
            document.add(new Paragraph("\nThis certificate is proudly presented to:", textFont));
            document.add(new Paragraph(user.getName(), new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD)));
            document.add(new Paragraph("\nFor successfully recycling a total of " + recycledAmount + " units of e-waste.", textFont));
            document.add(new Paragraph("\nThank you for contributing to a cleaner environment!", textFont));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();  // Proper logging should be used here
        }

        return outputStream;
    }
}
