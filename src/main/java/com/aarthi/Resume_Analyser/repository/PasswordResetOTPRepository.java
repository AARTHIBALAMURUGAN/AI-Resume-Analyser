package com.aarthi.Resume_Analyser.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aarthi.Resume_Analyser.entity.PasswordResetOTP;

public interface PasswordResetOTPRepository extends JpaRepository<PasswordResetOTP,Long>{
    Optional<PasswordResetOTP> findByEmail(String email);
    Optional<PasswordResetOTP>findByEmailAndOtp(String email,String otp);
    void deleteByEmail(String email);
    
}
