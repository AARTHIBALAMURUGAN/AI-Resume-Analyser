package com.aarthi.Resume_Analyser.resume;

import java.util.List;

import com.aarthi.Resume_Analyser.dto.DashboardResponse;
import com.aarthi.Resume_Analyser.dto.ImproveResumeResponse;
import com.aarthi.Resume_Analyser.dto.ResumeImproveResponse;
import com.aarthi.Resume_Analyser.entity.ResumeAnalysis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
@RestController
@RequestMapping("/api/resume")
public class ResumeController {
    @Autowired
    private ResumeService resumeService;


    @Operation(summary="Upload Resume")
    @PostMapping("/upload")
    public String uploadResume(@RequestParam("file") MultipartFile file){
        return resumeService.uploadResume(file);

    }
//     @GetMapping("/history")
//     public List<ResumeAnalysis> history(){
//  return resumeService.getMyResumes();
//     }
    @GetMapping("/{id}")
    public ResumeAnalysis getResume(@PathVariable Long id){
            System.out.println("controller calle");
        return resumeService.getResume(id);
    }
    @DeleteMapping("/{id}")
public String deleteResume(@PathVariable Long id) {

    resumeService.deleteResume(id);

    return "Resume deleted successfully";
}
@GetMapping("/dashboard")
public DashboardResponse dashboard() {
    return resumeService.getDashboard();
}
@GetMapping("/{id}/download")
public ResponseEntity<byte[]> downloadReport(@PathVariable Long id){
    byte[] pdf =resumeService.downloadReport(id);
    return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=Resume-Analysis.pdf").contentType(MediaType.APPLICATION_PDF).body(pdf);
}
@GetMapping("/{id}/improve")
public ResponseEntity<ResumeImproveResponse> improveResume(@PathVariable Long id){

    ResumeImproveResponse response = new ResumeImproveResponse(
            resumeService.improveResume(id)
    );

    return ResponseEntity.ok(response);
}
@GetMapping("/page")
public Page<ResumeAnalysis> getMyResumes(
        @RequestParam(defaultValue="0") int page,
        @RequestParam(defaultValue="5") int size){

    return resumeService.getResumes(page,size);
}
@GetMapping("/sort")
public List<ResumeAnalysis> sortResume(
        @RequestParam String type){

    return resumeService.sortResume(type);
}
@GetMapping("/filter")
public List<ResumeAnalysis> filterResume(
        @RequestParam Integer score){

    return resumeService.filterResume(score);
}
@GetMapping("/search")
public List<ResumeAnalysis> searchResume(
        @RequestParam String keyword) {

    return resumeService.searchResume(keyword);
}

}
