package com.aarthi.Resume_Analyser.resume;

import com.aarthi.Resume_Analyser.entity.ResumeAnalysis;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import java.io.ByteArrayOutputStream;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

 @Service
public class PdfReportService {

   
    public byte[] generateReport(ResumeAnalysis resume){
        try{
            Document document=new Document();
            ByteArrayOutputStream output=new ByteArrayOutputStream();
            PdfWriter.getInstance(document,output);
            document.open();
            Font title=FontFactory.getFont(FontFactory.HELVETICA_BOLD,18);
            Font heading=FontFactory.getFont(FontFactory.HELVETICA_BOLD,14);
            Font body=FontFactory.getFont(FontFactory.HELVETICA,12);

            document.add(new Paragraph("AI Resume Analysis Report",title));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Ats score: "+resume.getAtsScore()+"/100"));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("AI Analysis",heading));
            document.add(new Paragraph(resume.getAiAnalysis(),body));

            document.close();
            return output.toByteArray();

        }
        catch(Exception e){
            throw new RuntimeException(e);
        }
    }

    
}
