package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.infra.exceptions.EmailException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${spring.mail.frontend.link}")
    private String frontendLink;

    public void sendResetToken(String toEmail, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Password Reset Request");
            message.setText("Ola, " + toEmail + " notamos que vocé solicitou um reset de senha\nTo reset your password, click on the link: http://" + frontendLink + "/api/users/reset-password/confirm?token=" + token);
            message.setFrom(fromEmail);

            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailException(e.getMessage());
        }
    }
}