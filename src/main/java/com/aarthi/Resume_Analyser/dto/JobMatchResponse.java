package com.aarthi.Resume_Analyser.dto;

public class JobMatchResponse {

    private int matchScore;
    private String analysis;

    public JobMatchResponse() {}

    public JobMatchResponse(int matchScore, String analysis) {
        this.matchScore = matchScore;
        this.analysis = analysis;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public String getAnalysis() {
        return analysis;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }
}