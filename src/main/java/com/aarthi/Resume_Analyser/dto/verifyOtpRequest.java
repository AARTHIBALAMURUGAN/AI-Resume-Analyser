package com.aarthi.Resume_Analyser.dto;

public class verifyOtpRequest {
    private String email;
    private String otp;

    public verifyOtpRequest(){

    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email=email;
    }
    public String getOtp(){
        return otp;
    }
    public void setOtp(String otp){
        this.otp=otp;

    }
}
