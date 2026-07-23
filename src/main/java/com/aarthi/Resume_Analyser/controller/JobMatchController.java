package com.aarthi.Resume_Analyser.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aarthi.Resume_Analyser.dto.JobMatch;
import com.aarthi.Resume_Analyser.dto.JobMatchResponse;
import com.aarthi.Resume_Analyser.service.JobMatchService;

@RestController
@RequestMapping("/api/jobmatch")
public class JobMatchController {
    
    private final JobMatchService jobMatchService;

    public JobMatchController(JobMatchService jobMatchService){
        this.jobMatchService=jobMatchService;
    }
    @PostMapping
public ResponseEntity<JobMatchResponse> matchResume(
        @RequestBody JobMatch request) {

    com.aarthi.Resume_Analyser.entity.JobMatch result =
            jobMatchService.matchResume(request);

    JobMatchResponse response =
            new JobMatchResponse(
                    result.getMatchScore(),
                    result.getAnalysis());

    return ResponseEntity.ok(response);
}
    
}
