package com.aarthi.Resume_Analyser.repository;
import com.aarthi.Resume_Analyser.entity.ResumeAnalysis;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import com.aarthi.Resume_Analyser.entity.User;

@Repository
public interface ResumeRepository extends JpaRepository<ResumeAnalysis,Long>{
    List<ResumeAnalysis>findByUser(User user);
    Optional<ResumeAnalysis> findByIdAndUserId(Long id,Long userId);

    void deleteByIdAndUserId(Long id, Long userId);


    Page<ResumeAnalysis> findByUser(User user, Pageable pageable);
    Page<ResumeAnalysis> findByUserId(Long userId, Pageable pageable);

    List<ResumeAnalysis> findByUserOrderByUploadedAtDesc(User user);

List<ResumeAnalysis> findByUserOrderByUploadedAtAsc(User user);

List<ResumeAnalysis> findByUserOrderByAtsScoreDesc(User user);

List<ResumeAnalysis> findByUserOrderByAtsScoreAsc(User user);
long countByUser(User user);

   List<ResumeAnalysis> findByUserAndAtsScoreGreaterThanEqual(
        User user,
        Integer score
); 
 List<ResumeAnalysis> findByUserIdAndResumeTextContainingIgnoreCase(
            Long userId,
            String keyword
    );

    Long countByUserAndAtsScoreGreaterThanEqual(User user, int score);

@Query("SELECT AVG(r.atsScore) FROM ResumeAnalysis r WHERE r.user = :user")
Double getAverageScore(User user);

@Query("SELECT MAX(r.atsScore) FROM ResumeAnalysis r WHERE r.user = :user")
Integer getHighestScore(User user);

@Query("SELECT MIN(r.atsScore) FROM ResumeAnalysis r WHERE r.user = :user")
Integer getLowestScore(User user);
}
