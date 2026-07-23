package com.aarthi.Resume_Analyser.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.aarthi.Resume_Analyser.ai.GeminiService;
import com.aarthi.Resume_Analyser.dto.JobMatch;
import com.aarthi.Resume_Analyser.entity.ResumeAnalysis;
import com.aarthi.Resume_Analyser.entity.User;
import com.aarthi.Resume_Analyser.repository.JobMatchRepository;
import com.aarthi.Resume_Analyser.repository.ResumeRepository;
import com.aarthi.Resume_Analyser.repository.UserRepository;

@Service
public class JobMatchService {
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final JobMatchRepository jobMatchRepository;
    private final GeminiService geminiService;
    
    public JobMatchService(ResumeRepository resumeRepository,
        UserRepository userRepository,
        JobMatchRepository jobMatchRepository,
        GeminiService geminiService
    ){
        this.resumeRepository=resumeRepository;
        this.userRepository=userRepository;
        this.jobMatchRepository=jobMatchRepository;
        this.geminiService=geminiService;

    }

    public com.aarthi.Resume_Analyser.entity.JobMatch matchResume(JobMatch request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ResumeAnalysis resume = resumeRepository
                .findByIdAndUserId(request.getResumeId(), user.getId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        String analysis = geminiService.analyzeJobMatch(
                resume.getResumeText(),
                request.getJobDescription()
        );

        com.aarthi.Resume_Analyser.entity.JobMatch jobMatch = new com.aarthi.Resume_Analyser.entity.JobMatch();
        jobMatch.setResume(resume);
        jobMatch.setUser(user);
        jobMatch.setAnalysis(analysis);
        jobMatch.setMatchScore(geminiService.extractAtsScore(analysis));

        return jobMatchRepository.save(jobMatch);
    }

}
