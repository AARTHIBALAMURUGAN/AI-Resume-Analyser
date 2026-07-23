package com.aarthi.Resume_Analyser.ai;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;
import com.aarthi.Resume_Analyser.dto.Content;
import com.aarthi.Resume_Analyser.dto.GeminiRequest;
import com.aarthi.Resume_Analyser.dto.Part;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@Service
public class GeminiService {
    @Autowired
private RestClient restClient;
    @Value("${gemini.api.key}")
    private String apiKey;

    public String buildPrompt(String resumeText){
        return """
      You are an ATS expert.

Compare the following Resume with the Job Description.

Return:

1. ATS Match Score (0-100)
2. Matching Skills
3. Missing Skills
4. Keywords Missing
5. Resume Improvements
6. Final Verdict

Resume:
...

Job Description:
...

""" + resumeText;

    }
    public String analyzeResume(String resumeText){
        String prompt=buildPrompt(resumeText);
        return callGemini(prompt);
    }

    public String analyzeJobMatch(String resumeText, String jobDescription) {
        String prompt = """
        You are an ATS expert.

        Compare the following Resume with the Job Description.

        Return:

        1. ATS Match Score (0-100)
        2. Matching Skills
        3. Missing Skills
        4. Keywords Missing
        5. Resume Improvements
        6. Final Verdict

        Resume:
        %s

        Job Description:
        %s
        """.formatted(resumeText, jobDescription);

        return callGemini(prompt);
    }

    public String improveResume(String resumeText){
        String prompt="""
        You are an expert Resume Writer.

Rewrite the following resume professionally.

Rules:

1. Improve grammar
2. Improve ATS friendliness
3. Keep all information truthful
4. Use professional bullet points
5. Highlight achievements
6. Return only the improved resume

Resume:

                
        
                """ + resumeText;

                return callGemini(prompt);
    }

    private String callGemini(String prompt) {
        GeminiRequest request=new GeminiRequest(
            List.of(
                new Content(
                    List.of(
                        new Part(prompt)
                    )
                )
            )
        );
        String url= "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key="
+ apiKey;
        String response=restClient.post().uri(url).contentType(MediaType.APPLICATION_JSON).body(request).retrieve().body(String.class);

        try{
            ObjectMapper mapper=new ObjectMapper();
            JsonNode root=mapper.readTree(response);
            return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        }
        catch(Exception e){
            throw new RuntimeException("Failed to parse response",e);
        }
    }
    public Integer extractAtsScore(String analysis){
        Pattern pattern=Pattern.compile("(\\d{1,3})\\s*/\\s*100");
        Matcher matcher=pattern.matcher(analysis);
        if(matcher.find()){
            return Integer.parseInt(matcher.group(1));
        }
        return 0;
    }
    
}
