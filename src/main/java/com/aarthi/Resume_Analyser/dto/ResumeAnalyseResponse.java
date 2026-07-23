package com.aarthi.Resume_Analyser.dto;

public class ResumeAnalyseResponse {
    private String analysis;
    public ResumeAnalyseResponse(){

    }
    public ResumeAnalyseResponse(String analysis){
        this.analysis=analysis;
    }
    public String getAnalysis(){
        return analysis;
    }
    public void setAnalysis(String analysis){
        this.analysis=analysis;
    }
    
}
