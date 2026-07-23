package com.aarthi.Resume_Analyser.dto;

public class ProfileResponse {

    private String name;
    private String email;
    private String role;
    private String location;
    private Long totalResumes;

    public ProfileResponse(){}
    public ProfileResponse(String name,String email,String role,String location,Long totalResumes){
        this.name=name;
        this.email=email;
        this.role=role;
        this.location=location;
        this.totalResumes=totalResumes;
    }
    public String getName(){
        return name;
    }
    public String getEmail(){
        return email;
    }
    public String getRole(){
        return role;
    }
    public String getLocation(){
        return location;
    }
    public Long getTotalResumes(){
        return totalResumes;
    }
    public void setName(String name){
        this.name=name;
    }
    public void setEmail(String email){
        this.email=email;
    }
    public void setRole(String role) {
        this.role = role;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setTotalResumes(Long totalResumes) {
        this.totalResumes = totalResumes;
    }
}
