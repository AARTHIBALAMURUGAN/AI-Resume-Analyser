package com.aarthi.Resume_Analyser.entity;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
@Entity
@Table(name="resume_analysis")
public class ResumeAnalysis {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column
private Integer atsScore;

    @Column(columnDefinition="LONGTEXT")
    private String resumeText;

    @Column(columnDefinition ="LONGTEXT")
    private String aiAnalysis;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
     @OneToMany(
            mappedBy = "resume",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<JobMatch> jobMatches = new ArrayList<>();
   @CreationTimestamp
@Column(name = "uploaded_at", nullable = false, updatable = false)


private LocalDateTime uploadedAt;

    public ResumeAnalysis() {
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getAiAnalysis() {
        return aiAnalysis;
    }

    public void setAiAnalysis(String aiAnalysis) {
        this.aiAnalysis = aiAnalysis;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    public LocalDateTime getUploadedAt() {
    return uploadedAt;
}

public void setUploadedAt(LocalDateTime uploadedAt) {
    this.uploadedAt = uploadedAt;
}
public Integer getAtsScore(){
    return atsScore;
}
public void setAtsScore(Integer atsScore){
    this.atsScore=atsScore;
}
public List<JobMatch> getJobMatches() {
    return jobMatches;
}

public void setJobMatches(List<JobMatch> jobMatches) {
    this.jobMatches = jobMatches;
}
}
