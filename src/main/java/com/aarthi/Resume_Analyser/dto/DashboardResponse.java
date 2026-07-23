package com.aarthi.Resume_Analyser.dto;

import java.util.List;
import com.aarthi.Resume_Analyser.entity.ResumeAnalysis;

public class DashboardResponse {

    private String user;
    private long totalResumes;
    private ResumeAnalysis latestResume;
    private List<ResumeAnalysis> recentResumes;
    private Double averageAtsScore;
private Integer highestAtsScore;
private Integer lowestAtsScore;
private Long totalJobMatches;
private Long resumesAbove80;

    public DashboardResponse() {
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public long getTotalResumes() {
        return totalResumes;
    }

    public void setTotalResumes(long totalResumes) {
        this.totalResumes = totalResumes;
    }

    public ResumeAnalysis getLatestResume() {
        return latestResume;
    }

    public void setLatestResume(ResumeAnalysis latestResume) {
        this.latestResume = latestResume;
    }

    public List<ResumeAnalysis> getRecentResumes() {
        return recentResumes;
    }

    public void setRecentResumes(List<ResumeAnalysis> recentResumes) {
        this.recentResumes = recentResumes;
    }

    public Double getAverageAtsScore(){
        return averageAtsScore;
    }
    public void setAverageAtsScore(Double averageAtsScore){
        this.averageAtsScore=averageAtsScore;
    }
    public Integer getHighestAtsScore(){
        return highestAtsScore;
    }
    public void setHighestAtsScore(Integer highestAtsScore){
        this.highestAtsScore=highestAtsScore;
    }
    public Integer getLowestAtsScore(){
        return lowestAtsScore;
    }
    public void setLowestAtsScore(Integer lowestAtsScore){
        this.lowestAtsScore=lowestAtsScore;
    }
    public Long getResumesAbove80(){
        return resumesAbove80;
    }
    public void setResumesAbove80(Long resumesAbove80){
        this.resumesAbove80 = resumesAbove80;
    }
    public Long getTotalJobMatches(){
        return totalJobMatches;
    }
    public void setTotalJobMatches(Long totalJobMatches){
        this.totalJobMatches = totalJobMatches;
    }
}