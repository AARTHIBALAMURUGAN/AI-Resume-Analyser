import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/improvedresume.css";
import StatusBanner from "../components/StatusBanner";
import {
  ArrowLeft,
  Copy,
  Printer,
  LayoutGrid,
  ScanLine,
  Target,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  BrainCircuit,
  CheckCircle2,
  FileBarChart,
  Lightbulb,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function ImprovedResume() {
  const location = useLocation();
  const navigate = useNavigate();

  const resume = location.state?.resume || "";
  const [feedback, setFeedback] = useState(location.state?.flash || null);

  const atsScore = location.state?.atsScore ?? null;
  const detectedSkills = location.state?.detectedSkills || [];
  const scanChecks = location.state?.scanChecks || [
    {
      label: "Standard Headings",
      note: "Validated for parser compatibility.",
    },
    {
      label: "Keyword Density",
      note: "High alignment with target role.",
    },
    {
      label: "Layout Format",
      note: "Single-column optimal reading.",
    },
  ];

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const copyResume = () => {
    navigator.clipboard.writeText(resume);
    setFeedback({
      type: "success",
      title: "Copied successfully",
      message: "The improved resume text has been copied to your clipboard.",
    });
  };

  const navItems = [
    { icon: LayoutGrid, label: "Overview" },
    { icon: ScanLine, label: "Resume Scan", active: true },
    { icon: Target, label: "Skill Gap" },
    { icon: TrendingUp, label: "Career Path" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="resume-shell">
     <Sidebar/>


      <main className="ml-60 mt-16 flex-1 px-8 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">ATS Friendly Resume</h1>
          </div>

          <div className="flex gap-3">
            <button onClick={copyResume} className="resume-toolbar-btn">
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button onClick={() => window.print()} className="resume-toolbar-btn primary">
              <Printer className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {feedback && (
          <div className="max-w-4xl mb-4">
            <StatusBanner
              type={feedback.type}
              title={feedback.title}
              message={feedback.message}
              onClose={() => setFeedback(null)}
            />
            
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
         
          <div className="resume-document max-w-3xl">
            <pre className="whitespace-pre-wrap font-serif text-[15px] leading-relaxed">
              {resume}
            </pre>
          </div>

         
          <div className="space-y-5">
            <div className="engine-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">AI Engine</h3>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  {atsScore !== null ? "SCANNED" : "SCANNING"}
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase mb-1">
                  ATS Score
                </p>
                <p className="text-3xl font-bold text-teal-700">
                  {atsScore ?? "—"}
                  <span className="text-base text-slate-400 font-medium"> / 100</span>
                </p>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full"
                    style={{ width: `${atsScore ?? 0}%` }}
                  />
                </div>
              </div>

              <div>
                {scanChecks.map((check) => (
                  <div key={check.label} className="check-item">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{check.label}</p>
                      <p className="text-xs text-slate-500">{check.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm py-2.5 rounded-lg mt-4 transition">
                <FileBarChart className="w-4 h-4" />
                Full Analysis Report
              </button>
            </div>

            {detectedSkills.length > 0 && (
              <div className="engine-panel">
                <h3 className="font-bold text-slate-900 mb-3">Detected Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {detectedSkills.map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="protip-panel">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-cyan-300" />
                <h3 className="font-bold">ATS Pro-Tip</h3>
              </div>
              <p className="text-sm text-teal-50 leading-relaxed">
                Avoid using tables or complex multi-column layouts. Most ATS
                parsers read resumes from top to bottom, left to right.
              </p>
            </div>
          </div>
        </div>
      </main>

   
     <Footer/>
    </div>
  );
}

export default ImprovedResume;