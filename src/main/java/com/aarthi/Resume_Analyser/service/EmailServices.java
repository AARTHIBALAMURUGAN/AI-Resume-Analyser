package com.aarthi.Resume_Analyser.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServices {
    @Autowired
    private JavaMailSender mailsender;
    public void sendOtp(String email,String otp){
        SimpleMailMessage mail=new SimpleMailMessage();
        mail.setTo(email);
        mail.setSubject("Resume Analyzser Password Reset Otp");
        mail.setText("Your OTP is"+ otp);
        mailsender.send(mail);

    }
    
}
