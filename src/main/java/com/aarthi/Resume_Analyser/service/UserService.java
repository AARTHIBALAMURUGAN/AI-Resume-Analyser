package com.aarthi.Resume_Analyser.service;
import com.aarthi.Resume_Analyser.dto.ChangePasswordRequest;
import com.aarthi.Resume_Analyser.dto.LoginRequest;
import com.aarthi.Resume_Analyser.dto.ProfileResponse;
import com.aarthi.Resume_Analyser.dto.RegisterRequest;
import com.aarthi.Resume_Analyser.dto.UpdateProfileRequest;
import com.aarthi.Resume_Analyser.entity.PasswordResetOTP;
import com.aarthi.Resume_Analyser.entity.User;
import com.aarthi.Resume_Analyser.repository.PasswordResetOTPRepository;
import com.aarthi.Resume_Analyser.repository.ResumeRepository;
import com.aarthi.Resume_Analyser.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.aarthi.Resume_Analyser.util.JwtService;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
@Service
public class UserService {
    @Autowired
     private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ResumeRepository resumeRepository;
    @Autowired
private PasswordResetOTPRepository otpRepository;

@Autowired
private EmailServices emailServices;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public String register(RegisterRequest request){
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            return "Email already exists";
        }
        User user=new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        return "User Registered Succesfully";


    }
    public String login(LoginRequest request){
        User user=userRepository.findByEmail(request.getEmail()).orElse(null);
        if(user == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }
        String token = jwtService.generateToken(user.getEmail());

return token;

        
    }

    
    public ProfileResponse getProfile() {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow();

    Long total = resumeRepository.countByUser(user);

    return new ProfileResponse(
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getLocation(),
            total
    );
}

    public ProfileResponse updateProfile(UpdateProfileRequest request) {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();

        user.setName(request.getName().trim());
        String location = request.getLocation();
        user.setLocation(
                location == null || location.trim().isEmpty()
                        ? null
                        : location.trim()
        );
        userRepository.save(user);

        Long total = resumeRepository.countByUser(user);

        return new ProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getLocation(),
                total
        );
    }


    public String changePassword(ChangePasswordRequest request){

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    User user=userRepository.findByEmail(authentication.getName())
            .orElseThrow();

    if(!passwordEncoder.matches(request.getOldPassword(),user.getPassword())){
        throw new RuntimeException("Old password is incorrect");
    }

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));

    userRepository.save(user);

    return "Password changed successfully";
}
@Transactional
public void sendOtp(String email){

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    String otp = String.valueOf(
            100000 + new Random().nextInt(900000)
    );

    otpRepository.deleteByEmail(email);

    PasswordResetOTP resetOtp = new PasswordResetOTP();

    resetOtp.setEmail(email);
    resetOtp.setOtp(otp);
    resetOtp.setExpiryTime(
            LocalDateTime.now().plusMinutes(5)
    );

    otpRepository.save(resetOtp);

    emailServices.sendOtp(email, otp);
}
public void verifyOtp(String email, String otp){

    PasswordResetOTP resetOtp = otpRepository
            .findByEmailAndOtp(email, otp)
            .orElseThrow(() -> new RuntimeException("Invalid OTP"));

    if(resetOtp.getExpiryTime().isBefore(LocalDateTime.now())){
        throw new RuntimeException("OTP Expired");
    }
}
public void resetPassword(String email,
                          String otp,
                          String newPassword){

    PasswordResetOTP resetOtp = otpRepository
            .findByEmailAndOtp(email, otp)
            .orElseThrow(() -> new RuntimeException("Invalid OTP"));

    if(resetOtp.getExpiryTime().isBefore(LocalDateTime.now())){
        throw new RuntimeException("OTP Expired");
    }

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setPassword(
            passwordEncoder.encode(newPassword)
    );

    userRepository.save(user);

    otpRepository.delete(resetOtp);
}
    
}
