import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  LayoutGrid,
  ScanLine,
  Target,
  TrendingUp,
  Settings,
  Bell,
  Upload,
  FileUp,
  Braces,
  Crosshair,
  LineChart,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import StatusBanner from "../components/StatusBanner";
import { getUserFriendlyErrorMessage } from "../utils/errorMessages";
import Footer from "../components/Footer";

const UploadResume = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [dragging, setDragging] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setFile(null);
      e.target.value = "";
      setFeedback({
        type: "error",
        title: "Invalid file type",
        message: "Only PDF files are allowed for resume upload.",
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) {
      return;
    }

    const isPdf =
      droppedFile.type === "application/pdf" ||
      droppedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setFile(null);
      setFeedback({
        type: "error",
        title: "Invalid file type",
        message: "Only PDF files are allowed for resume upload.",
      });
      return;
    }

    setFile(droppedFile);
  };

  const handleUpload = async (selectedFile) => {
    const uploadFile = selectedFile || file;
    if (!uploadFile) {
      setFeedback({
        type: "error",
        title: "No file selected",
        message: "Please choose a resume file before uploading.",
      });
      return;
    }

    const isPdf =
      uploadFile.type === "application/pdf" ||
      uploadFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setFeedback({
        type: "error",
        title: "Invalid file type",
        message: "Only PDF files are allowed for resume upload.",
      });
      setFile(null);
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      setLoading(true);
      const response = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAnalysis(response.data);
      setFeedback({
        type: "success",
        title: "Resume uploaded",
        message: "Your resume has been uploaded successfully and analysis is ready.",
      });
    } catch (err) {
      console.log(err);
      setFeedback({
        type: "error",
        title: "Upload failed",
        message: getUserFriendlyErrorMessage(err, "Please try again."),
      });
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="dash-shell">
      <Sidebar/>

      
      <main className="ml-0 md:ml-72 mt-16 flex-1 px-4 sm:px-6 md:px-10 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
            Intelligence-Driven{" "}
            <span className="text-teal-700 font-bold">Resume Analysis</span>
          </h1>
          <p className="text-slate-500 mt-4">
            Our neural networks analyze your resume against industry
            benchmarks to uncover hidden skill gaps and career opportunities.
          </p>
        </div>

        {feedback && (
          <div className="max-w-4xl mx-auto mb-6">
            <StatusBanner
              type={feedback.type}
              title={feedback.title}
              message={feedback.message}
              onClose={() => setFeedback(null)}
            />
          </div>
        )}

    
        <div
          className={`dropzone max-w-4xl mx-auto ${dragging ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center mb-6">
            <FileUp className="w-9 h-9 text-teal-700" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-1">
            {file ? file.name : "Drag & Drop Resume"}
          </h3>
          <p className="text-slate-400 mb-6">PDF only (Max 5MB)</p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Browse Files
          </button>

          {file && (
            <button
              onClick={() => handleUpload()}
              disabled={loading}
              className="mt-4 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold px-6 py-3 rounded-xl shadow-lg shadow-cyan-300/50 transition disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload Resume"}
            </button>
          )}
        </div>

        
        {analysis && (
          <div className="max-w-4xl mx-auto mt-8 dash-card">
            <h3 className="text-xl font-bold text-slate-900 mb-4">AI Analysis</h3>
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 leading-relaxed">
              {typeof analysis === "string" ? analysis : JSON.stringify(analysis, null, 2)}
            </pre>
          </div>
        )}

      
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          <div className="feature-card">
            <div className="feature-icon">
              <Braces className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Semantic Parsing</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Advanced NLP translates your experience into high-value vector
              embeddings.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Crosshair className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Keyword Optimization</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Identify critical keywords missing for your target senior-level
              roles.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <LineChart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Path Generation</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Get a personalized AI-generated roadmap to your next promotion.
            </p>
          </div>
        </div>
      </main>    
     <Footer/>
    </div>
  );
};

export default UploadResume;
