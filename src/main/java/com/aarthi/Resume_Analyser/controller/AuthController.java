package com.aarthi.Resume_Analyser.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.aarthi.Resume_Analyser.dto.ChangePasswordRequest;
import com.aarthi.Resume_Analyser.dto.ForgotPasswordRequest;
import com.aarthi.Resume_Analyser.dto.LoginRequest;
import com.aarthi.Resume_Analyser.dto.ProfileResponse;
import com.aarthi.Resume_Analyser.dto.RegisterRequest;
import com.aarthi.Resume_Analyser.dto.UpdateProfileRequest;
import com.aarthi.Resume_Analyser.dto.ResetPasswordRequest;
import com.aarthi.Resume_Analyser.service.UserService;
import com.aarthi.Resume_Analyser.util.JwtService;
import com.aarthi.Resume_Analyser.dto.ApiResponse;
import com.aarthi.Resume_Analyser.dto.verifyOtpRequest;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
private JwtService jwtService;

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request){
        return userService.register(request);
    }
    @PostMapping("/login")
    public String login(@Valid @RequestBody LoginRequest request){
        return userService.login(request);
    }
@GetMapping("/profile")
public ProfileResponse profile() {
    return userService.getProfile();
}

@PutMapping("/profile")
public ProfileResponse updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
    return userService.updateProfile(request);
}

@PutMapping("/changepassword")
public String changePassword(
        @RequestBody ChangePasswordRequest request){

    return userService.changePassword(request);
}
@PostMapping("/sendotp")
    public ResponseEntity<ApiResponse> sendOtp(
            @RequestBody ForgotPasswordRequest request) {

        userService.sendOtp(request.getEmail());

        return ResponseEntity.ok(
                new ApiResponse(true,"OTP sent successfully",null)
        );
    }

    // Verify OTP
    @PostMapping("/verifyotp")
    public ResponseEntity<ApiResponse> verifyOtp(
            @RequestBody verifyOtpRequest request) {

        userService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        return ResponseEntity.ok(
                new ApiResponse(true,"OTP verified successfully",null)
        );
    }

    // Reset Password
    @PostMapping("/resetpassword")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        userService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );

        return ResponseEntity.ok(
                new ApiResponse(true,"Password reset successfully",null)
        );
    }

    
}
