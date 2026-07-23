package com.aarthi.Resume_Analyser.resume;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.aarthi.Resume_Analyser.ai.GeminiService;
import com.aarthi.Resume_Analyser.dto.DashboardResponse;
import com.aarthi.Resume_Analyser.entity.ResumeAnalysis;
import com.aarthi.Resume_Analyser.repository.JobMatchRepository;
import com.aarthi.Resume_Analyser.repository.ResumeRepository;
import com.aarthi.Resume_Analyser.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;


import java.time.LocalDateTime;
import java.util.List;
import com.aarthi.Resume_Analyser.entity.User;
@Service
public class ResumeService {
        @Autowired
private JobMatchRepository jobMatchRepository;
    private final ResumeRepository resumeRepository;
    private final PdfService pdfService;
    private final GeminiService geminiService;
    private final UserRepository userRepository;
    private final PdfReportService pdfReportService;
    public ResumeService(
            ResumeRepository resumeRepository,
            PdfService pdfService,
            GeminiService geminiService,
            UserRepository userRepository,
            PdfReportService pdfReportService) {

        this.resumeRepository = resumeRepository;
        this.pdfService = pdfService;
        this.geminiService = geminiService;
        this.userRepository = userRepository;
        this.pdfReportService=pdfReportService;
    }
    public String uploadResume(MultipartFile file){
         if (file == null || file.isEmpty()) {
             throw new RuntimeException("Please select a PDF file to upload");
         }

         String originalFileName = file.getOriginalFilename();
         String contentType = file.getContentType();
         boolean isPdf = (contentType != null && contentType.equalsIgnoreCase("application/pdf"))
                 || (originalFileName != null && originalFileName.toLowerCase().endsWith(".pdf"));

         if (!isPdf) {
             throw new RuntimeException("Only PDF files are allowed");
         }

         Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        String text= pdfService.extractText(file);
        String analysis= geminiService.analyzeResume(text);
        ResumeAnalysis resume=new ResumeAnalysis();
        resume.setResumeText(text);
        resume.setAiAnalysis(analysis);
        resume.setAtsScore(geminiService.extractAtsScore(analysis));
        resume.setUser(user);
        resumeRepository.save(resume);
        return analysis;
        }

        public List<ResumeAnalysis> getMyResumes(){
            Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
            String email=authentication.getName();
            User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
            return resumeRepository.findByUser(user);
        }

        public ResumeAnalysis getResume(Long id){
            Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
            String email=authentication.getName();
            User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
            return resumeRepository.findByIdAndUserId(id,user.getId()).orElseThrow(()->new RuntimeException("Resume not found"));
        }
        @Transactional
       public void deleteResume(Long id) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    ResumeAnalysis resume = resumeRepository
            .findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new RuntimeException("Resume not found"));
jobMatchRepository.deleteByResume(resume);
    resumeRepository.delete(resume);
} 
public DashboardResponse getDashboard() {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    List<ResumeAnalysis> resumes =
            resumeRepository.findByUserOrderByUploadedAtDesc(user);

    DashboardResponse dashboard = new DashboardResponse();

    dashboard.setUser(user.getEmail());
    dashboard.setTotalResumes(resumeRepository.countByUser(user));

    if (!resumes.isEmpty()) {
         dashboard.setLatestResume(resumes.get(0));

        dashboard.setLatestResume(resumes.get(0));
    }

    dashboard.setRecentResumes(
            resumes.stream().limit(5).toList()
    );
    dashboard.setAverageAtsScore(
        resumeRepository.getAverageScore(user)
);

dashboard.setHighestAtsScore(
        resumeRepository.getHighestScore(user)
);

dashboard.setLowestAtsScore(
        resumeRepository.getLowestScore(user)
);

dashboard.setTotalJobMatches(
        jobMatchRepository.countByUser(user)
);

dashboard.setResumesAbove80(
        resumeRepository.countByUserAndAtsScoreGreaterThanEqual(user,80)
);

    return dashboard;
}

public byte[] downloadReport(Long id){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        String email=authentication.getName();
        User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));

        ResumeAnalysis resume=resumeRepository.findByIdAndUserId(id,user.getId()).orElseThrow(()->new RuntimeException("Resume not found"));
        return pdfReportService.generateReport(resume);
}
public String improveResume(Long id){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        String email=authentication.getName();
        User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
        ResumeAnalysis resume=resumeRepository.findByIdAndUserId(id,user.getId()).orElseThrow(()->new RuntimeException("Resume nor found"));
        return geminiService.improveResume(resume.getResumeText());
}
public Page<ResumeAnalysis> getResumes(int page, int size) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Pageable pageable = PageRequest.of(page, size,Sort.by("uploadedAt").descending());

    return resumeRepository.findByUserId(user.getId(), pageable);
}

public List<ResumeAnalysis> sortResume(String sort){

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email=authentication.getName();

    User user=userRepository.findByEmail(email)
            .orElseThrow(()->new RuntimeException("User not found"));

    switch(sort){

        case "newest":
            return resumeRepository.findByUserOrderByUploadedAtDesc(user);

        case "oldest":
            return resumeRepository.findByUserOrderByUploadedAtAsc(user);

        case "highscore":
            return resumeRepository.findByUserOrderByAtsScoreDesc(user);

        case "lowscore":
            return resumeRepository.findByUserOrderByAtsScoreAsc(user);

        default:
            return resumeRepository.findByUserOrderByUploadedAtDesc(user);
    }
}
public List<ResumeAnalysis> filterResume(Integer score){

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email=authentication.getName();

    User user=userRepository.findByEmail(email)
            .orElseThrow(()->new RuntimeException("User not found"));

    return resumeRepository
      
    .findByUserAndAtsScoreGreaterThanEqual(user,score);
}
public List<ResumeAnalysis> searchResume(String keyword) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return resumeRepository.findByUserIdAndResumeTextContainingIgnoreCase(
            user.getId(),
            keyword
    );
}


    
}
