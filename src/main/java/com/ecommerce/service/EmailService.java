package com.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void send(String to, String subject, String body) {
        if (mailSender == null) {
            System.out.println("[EmailService] JavaMailSender not configured; skipping email to " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Body:\n" + body);
            return;
        }
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(body);
        mailSender.send(msg);
    }
}
