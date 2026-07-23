package com.aarthi.Resume_Analyser.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.aarthi.Resume_Analyser.entity.ResumeAnalysis;
import com.aarthi.Resume_Analyser.entity.JobMatch;
import com.aarthi.Resume_Analyser.entity.User;

public interface JobMatchRepository extends JpaRepository<JobMatch,Long>{
    List<JobMatch> findByUser(User user);
    void deleteByResume(ResumeAnalysis resume);
       Long countByUser(User user);
    
}
