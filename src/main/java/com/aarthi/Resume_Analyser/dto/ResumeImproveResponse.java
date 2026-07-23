package com.aarthi.Resume_Analyser.dto;

public class ResumeImproveResponse {
    private String improvedResume;
    
    public ResumeImproveResponse(){

    }
    public ResumeImproveResponse(String improvedResume){
        this.improvedResume=improvedResume;

    }
    public String getImprovedResume(){
        return improvedResume;
    }
    public void setImprovedResume(String improvedResume){
        this.improvedResume=improvedResume;
    }

    
}
