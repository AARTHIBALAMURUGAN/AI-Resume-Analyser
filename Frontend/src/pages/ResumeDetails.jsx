import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Footer from "../components/Footer"
import {
  ScanLine,
  Target,
  TrendingUp,
  Plus,
  HelpCircle,
  LogOut,
  Bell,
  Settings,
  ArrowLeft,
  Download,
  Sparkles,
  Calendar,
  FileText,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Layers,
  Loader2,
} from "lucide-react";
import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";
import StatusBanner from "../components/StatusBanner";
import { getUserFriendlyErrorMessage } from "../utils/errorMessages";

const ResumeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [improving, setImproving] = useState(false);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      const response = await api.get(`/resume/${id}`);
      setResume(response.data);
    } catch (err) {
      console.log(err);
      const flash = {
        type: "error",
        title: "Unable to load resume",
        message: getUserFriendlyErrorMessage(err, "Please return to the resume list and try again."),
      };
      setFeedback(flash);
      navigate("/resumes", { state: { flash } });
    }
  };

  const downloadReport = async () => {
    try {
      const response = await api.get(`/resume/${id}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Resume_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setFeedback({
        type: "success",
        title: "Download ready",
        message: "Your resume report has been downloaded successfully.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        title: "Download failed",
        message: getUserFriendlyErrorMessage(err, "Please try again in a moment."),
      });
    }
  };

  const improveResume = async () => {
    try {
      setImproving(true);
      const response = await api.get(`/resume/${id}/improve`);
      navigate("/improvedresume", {
        state: {
          resume: response.data.improvedResume,
          flash: {
            type: "success",
            title: "Resume improved",
            message: "Your enhanced resume is ready.",
          },
        },
      });
    } catch (err) {
      setFeedback({
        type: "error",
        title: "Improvement failed",
        message: getUserFriendlyErrorMessage(err, "We could not generate an improved resume."),
      });
    } finally {
      setImproving(false);
    }
  };

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h2 className="text-slate-500 text-lg">Loading...</h2>
      </div>
    );
  }


  const parseAnalysis = (text) => {
    if (!text) return [];
    const patterns = [
      { key: "strength", label: "Key Strengths", type: "strength" },
      { key: "improve", label: "Areas for Improvement", type: "improvement" },
      { key: "suggest", label: "Strategic Suggestions", type: "suggestion" },
    ];
    const blocks = text.split(/\n{2,}/);
    const sections = [];
    let current = { type: "suggestion", label: "AI Insight", content: [] };

    blocks.forEach((block) => {
      const lower = block.toLowerCase();
      const match = patterns.find((p) => lower.includes(p.key));
      if (match) {
        if (current.content.length) sections.push(current);
        current = { type: match.type, label: match.label, content: [] };
      } else if (block.trim()) {
        current.content.push(block.trim());
      }
    });
    if (current.content.length) sections.push(current);
    return sections.length ? sections : [{ type: "suggestion", label: "AI Insight", content: [text] }];
  };

  const analysisSections = parseAnalysis(resume.aiAnalysis);

  const iconFor = {
    strength: <CheckCircle2 className="w-5 h-5 text-teal-700" />,
    improvement: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    suggestion: <Lightbulb className="w-5 h-5 text-teal-800" />,
  };

  const scoreLabel = (score) => {
    if (score >= 80) return "Exceptional Alignment";
    if (score >= 60) return "Solid Alignment";
    return "Needs Improvement";
  };

  const scoreDescription = (score) => {
    if (score >= 80)
      return "Your profile shows strong technical proficiency and leadership traits. The AI detected high keyword density in cloud infrastructure and team management segments.";
    if (score >= 60)
      return "Your profile shows good baseline alignment. A few targeted keyword and structure updates could push you into the top tier.";
    return "Your profile needs stronger keyword alignment and clearer quantified achievements to compete for top roles.";
  };

  

  return (
    <div className="dash-shell">
      <Sidebar/>

      <main className="ml-0 md:ml-72 mt-16 flex-1 px-4 sm:px-6 md:px-10 py-8">
        {feedback && (
          <div className="mb-6">
            <StatusBanner
              type={feedback.type}
              title={feedback.title}
              message={feedback.message}
              onClose={() => setFeedback(null)}
            />
          </div>
        )}
        <button
          onClick={() => navigate("/resumes")}
          className="flex items-center gap-2 text-slate-500 hover:text-teal-700 font-medium mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resumes
        </button>

        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Resume Details</h1>
            <span className="bg-slate-200 text-slate-500 text-xs font-medium px-3 py-1 rounded-full">
              ID: {resume.id || id}
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={downloadReport} className="flex items-center gap-2 dash-btn-secondary">
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button
              onClick={improveResume}
              disabled={improving}
              className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold px-5 py-3 rounded-xl shadow-lg shadow-cyan-300/50 transition"
            >
              {improving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Improve Resume
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="dash-card lg:col-span-2 flex flex-col sm:flex-row gap-6">
            <div className="relative w-40 h-40 flex-shrink-0 mx-auto sm:mx-0">
              <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                <circle cx="70" cy="70" r="60" stroke="#e2e8f0" strokeWidth="12" fill="none" />
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="#22d3ee"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - (resume.atsScore || 0) / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-900">{resume.atsScore}</span>
                <span className="text-sm text-slate-400">/ 100</span>
              </div>
            </div>

            <div>
              <span className="score-badge mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Top 15% of candidates
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {scoreLabel(resume.atsScore)}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {scoreDescription(resume.atsScore)}
              </p>
              <div className="flex flex-wrap gap-2">
                {(resume.keywords || ["CloudArch", "Kubernetes", "Leadership"]).map((kw) => (
                  <span key={kw} className="keyword-tag">#{kw}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="dash-card flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wide uppercase mb-4">
                Metadata
              </p>
              <div className="space-y-4">
                <div className="metadata-row">
                  <div className="metadata-icon">
                    <Calendar className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Uploaded Date</p>
                    <p className="font-semibold text-slate-800">
                      {resume.uploadedAt?.substring(0, 10)}
                    </p>
                  </div>
                </div>
                <div className="metadata-row">
                  <div className="metadata-icon">
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">File Type</p>
                    <p className="font-semibold text-slate-800">
                      {resume.fileType || "PDF"} {resume.fileSize ? `(${resume.fileSize})` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 mt-6">
              <ShieldCheck className="w-5 h-5 text-teal-700 flex-shrink-0" />
              <p className="text-sm text-slate-600">Privacy protected by AI Engine</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="dash-card max-h-[750px] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Parsed Structure</h2>
              
            </div>
            <div className="mb-6">
              {(resume.experience || []).map((exp, i) => (
                <div key={i} className="timeline-item">
                  <span className="timeline-dot" />
                  <h4 className="font-bold text-slate-900">{exp.title}</h4>
                  <p className="text-sm text-slate-400 mb-2">
                    {exp.company} • {exp.duration}
                  </p>
                  <ul className="space-y-1.5">
                    {exp.bullets?.map((b, j) => (
                      <li key={j} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-teal-600">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {!resume.experience && (
                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600">
                  {resume.resumeText}
                </pre>
              )}
            </div>

            {resume.education && (
              <>
                <p className="parsed-section-label">Education</p>
                <div className="parsed-field">
                  <p className="font-semibold text-slate-900">{resume.education.degree}</p>
                  <p className="text-sm text-slate-500">
                    {resume.education.school} • {resume.education.detail}
                  </p>
                </div>
              </>
            )}
          </div>

          <div >
            <div className="space-y-5 overflow-y-auto">
              {analysisSections.map((section, i) => (
                <div key={i} className={`insight-card ${section.type}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {iconFor[section.type]}
                      <h3 className="font-bold text-slate-900">{section.label}</h3>
                    </div>
                    {section.type === "suggestion" && (
                      <span className="priority-badge">High Priority</span>
                    )}
                  </div>

                  {section.content.length > 1 ? (
                    <ul className="space-y-2">
                      {section.content.map((line, j) => (
                        <li key={j} className="flex gap-2 text-sm text-slate-600">
                          <span className="text-teal-600 mt-1">•</span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {section.content[0]}
                    </p>
                  )}

               
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

 <Footer/>
    </div>
  );
};

export default ResumeDetails;
