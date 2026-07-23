import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  LayoutGrid,
  ScanLine,
  Target,
  TrendingUp,
  Settings,
  Bell,
  Zap,
  HelpCircle,
  LogOut,
  Search,
  FileText,
  Upload,
  Link2,
  BarChart3,
  ScanSearch,
  History,
  Loader2,
} from "lucide-react";
import "../styles/dashboard.css";
import StatusBanner from "../components/StatusBanner";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { getUserFriendlyErrorMessage } from "../utils/errorMessages";

const JobMatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const analyseJob = async () => {
    if (jobDescription.trim() === "") {
      setFeedback({
        type: "error",
        title: "Job description required",
        message: "Please enter a job description before analyzing.",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(`/jobmatch`, {
        resumeId: Number(id),
        jobDescription: jobDescription,
      });
      console.log("Response:", response);
      console.log("Data:", JSON.stringify(response.data, null, 2));
      setResult(response.data);
      setFeedback({
        type: "success",
        title: "Analysis complete",
        message: "Your job match analysis is ready below.",
      });
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Data:", err.response?.data);
      setFeedback({
        type: "error",
        title: "Analysis failed",
        message: getUserFriendlyErrorMessage(err, "Please try again."),
      });
    }
    setLoading(false);
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
        <h1 className="text-3xl font-bold text-slate-900">Job Match Analysis</h1>
        <p className="text-slate-500 mt-2 max-w-2xl">
          Compare your current resume against target job descriptions to
          identify missing keywords, technical skill gaps, and optimize for
          ATS ranking.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="dash-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-xl font-bold text-teal-700">
                  <FileText className="w-5 h-5" />
                  Job Description
                </h2>
                <span className="bg-slate-100 text-slate-500 text-xs font-medium px-3 py-1.5 rounded-full">
                  Format: Text or URL
                </span>
              </div>

              <textarea
                className="jobmatch-textarea"
                placeholder="Paste the job title and requirements here to start the AI matching process..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button className="jobmatch-tool-btn">
                  <Upload className="w-4 h-4" />
                  Import PDF
                </button>
                <button className="jobmatch-tool-btn">
                  <Link2 className="w-4 h-4" />
                  Paste URL
                </button>
                <button
                  onClick={analyseJob}
                  disabled={loading}
                  className="jobmatch-analyze-btn"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <BarChart3 className="w-5 h-5" />
                  )}
                  {loading ? "Analyzing..." : "Analyze Match"}
                </button>
              </div>
            </div>

            <div
              className="dashed-panel cursor-pointer hover:border-teal-400 transition"
              onClick={() => navigate("/resumes")}
            >
              <History className="w-6 h-6 text-teal-700 mb-2" />
              <p className="font-semibold text-slate-700">View your Analysis History</p>
            </div>
          </div>

          
          <div className="dashed-panel min-h-[500px]">
            {!result && !loading && (
              <>
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                  <ScanSearch className="w-9 h-9 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Ready to Scan
                </h3>
                <p className="text-slate-500 max-w-xs">
                  Enter a job description to see your compatibility score and
                  skill gap analysis.
                </p>
              </>
            )}

            {loading && (
              <>
                <Loader2 className="w-10 h-10 text-teal-700 animate-spin mb-6" />
                <h3 className="text-xl font-bold text-slate-900">
                  Analyzing Match...
                </h3>
                <p className="text-slate-500 mt-2 max-w-xs">
                  The AI is comparing your resume against this job description.
                </p>
              </>
            )}

            {result && !loading && (
              <div className="w-full text-left">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="52" stroke="#e2e8f0" strokeWidth="10" fill="none" />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        stroke="#22d3ee"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 52}
                        strokeDashoffset={2 * Math.PI * 52 * (1 - (result.matchScore || 0) / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900">
                        {result.matchScore}%
                      </span>
                      <span className="text-xs text-slate-400 tracking-wide">MATCH</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-4 text-center">
                    Compatibility Score
                  </h3>
                </div>

                <p className="text-xs font-bold text-slate-400 tracking-wide uppercase mb-2">
                  Detailed Analysis
                </p>
                <textarea
                  rows="14"
                  readOnly
                  value={result.analysis || ""}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 leading-relaxed resize-none focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default JobMatch;
