package com.aarthi.Resume_Analyser.dto;

public class ImproveResumeResponse {
     private String improvedResume;

    public ImproveResumeResponse(String improvedResume){
        this.improvedResume = improvedResume;
    }

    public String getImprovedResume(){
        return improvedResume;
    }

    public void setImprovedResume(String improvedResume){
        this.improvedResume = improvedResume;
    }
    
}
