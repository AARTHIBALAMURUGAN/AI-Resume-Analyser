import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Search,
  ChevronDown,
  Filter,
  RotateCcw,
  Eye,
  Wand2,
  Briefcase,
  Download,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Info,
  X,
  Loader2,
} from "lucide-react";
import "../styles/dashboard.css";
import "../styles/resumelist.css";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { getUserFriendlyErrorMessage } from "../utils/errorMessages";

function ResumeList() {
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortType, setSortType] = useState("");
  const [filterScore, setFilterScore] = useState("");
  const [feedback, setFeedback] = useState(location.state?.flash || null);
  const [improvingId, setImprovingId] = useState(null);
  const navigate = useNavigate();

  const showFeedback = (type, title, message) => {
    setFeedback({ type, title, message });
  };

  const isFilteredView = keyword.trim() !== "" || sortType !== "" || filterScore !== "";

  useEffect(() => {
    if (!isFilteredView) {
      loadResumes();
    }
  }, [page]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const loadResumes = async () => {
    try {
      const response = await api.get(`/resume/page?page=${page}&size=${size}`);
      setResumes(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      showFeedback("error", "Unable to load resumes", getUserFriendlyErrorMessage(err, "Please try again in a moment."));
    }
  };

  const refreshCurrentView = async () => {
    if (keyword.trim() !== "") {
      await searchResume(true);
      return;
    }
    if (sortType !== "") {
      await sortResume(sortType, true);
      return;
    }
    if (filterScore !== "") {
      await filterResume(filterScore, true);
      return;
    }
    await loadResumes();
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await api.delete(`/resume/${id}`);
      showFeedback("success", "Resume deleted", "The resume has been removed from your library.");
      await refreshCurrentView();
    } catch (err) {
      showFeedback("error", "Delete failed", getUserFriendlyErrorMessage(err, "We could not delete the resume."));
    }
  };

  const improveResume = async (id) => {
    try {
      setImprovingId(id);
      const response = await api.get(`/resume/${id}/improve`);
      navigate("/improvedresume", {
        state: {
          resume: response.data.improvedResume,
        },
      });
    } catch (err) {
      showFeedback("error", "Improvement failed", getUserFriendlyErrorMessage(err, "We could not generate the improved resume."));
    } finally {
      setImprovingId(null);
    }
  };

  const downloadReport = async (id) => {
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
      showFeedback("success", "Download ready", "Your resume report has been downloaded successfully.");
    } catch (err) {
      showFeedback("error", "Download failed", getUserFriendlyErrorMessage(err, "Please try again."));
    }
  };

  const searchResume = async (silent = false) => {
    if (keyword.trim() === "") {
      setSortType("");
      setFilterScore("");
      setPage(0);
      loadResumes();
      return;
    }
    try {
      setSortType("");
      setFilterScore("");
      const response = await api.get(`/resume/search?keyword=${encodeURIComponent(keyword.trim())}`);
      setResumes(response.data);
      setTotalPages(1);
      setPage(0);
      if (!silent) {
        showFeedback(
          "success",
          "Search completed",
          `Found ${response.data.length} resume${response.data.length === 1 ? "" : "s"} for "${keyword.trim()}".`
        );
      }
    } catch (err) {
      showFeedback("error", "Search failed", getUserFriendlyErrorMessage(err, "We could not complete the search."));
    }
  };

  const sortResume = async (type, silent = false) => {
    setSortType(type);
    if (type === "") {
      setPage(0);
      loadResumes();
      return;
    }
    try {
      setKeyword("");
      setFilterScore("");
      const response = await api.get(`/resume/sort?type=${encodeURIComponent(type)}`);
      setResumes(response.data);
      setTotalPages(1);
      setPage(0);
      if (!silent) {
        showFeedback("success", "Sort applied", "The resume list has been updated.");
      }
    } catch (err) {
      showFeedback("error", "Sorting failed", getUserFriendlyErrorMessage(err, "We could not sort the resumes."));
    }
  };

  const filterResume = async (score, silent = false) => {
    setFilterScore(score);
    if (score === "") {
      setPage(0);
      loadResumes();
      return;
    }
    try {
      setKeyword("");
      setSortType("");
      const response = await api.get(`/resume/filter?score=${encodeURIComponent(score)}`);
      setResumes(response.data);
      setTotalPages(1);
      setPage(0);
      if (!silent) {
        showFeedback("success", "Filter applied", `Showing resumes with ATS score ${score}+.`);
      }
    } catch (err) {
      showFeedback("error", "Filter failed", getUserFriendlyErrorMessage(err, "We could not apply the filter."));
    }
  };

  const clearAll = () => {
    setKeyword("");
    setSortType("");
    setFilterScore("");
    setPage(0);
    loadResumes();
    showFeedback("info", "Filters cleared", "You are now viewing the full resume list.");
  };

  const scoreColor = (score) => {
    if (score >= 80) return "bg-cyan-400";
    if (score >= 60) return "bg-teal-600";
    return "bg-red-400";
  };

 

  return (
    <div className="dash-shell">
    <Sidebar/>
    
      <main className="ml-0 md:ml-72 mt-16 flex-1 px-4 sm:px-6 md:px-10 py-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Resumes</h1>
            <p className="text-slate-500 mt-2 max-w-xl">
              Manage your analyzed documents, track ATS score improvements, and
              match with global career opportunities.
            </p>
          </div>
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-5 py-3 rounded-xl transition whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            Upload New Resume
          </button>
        </div>

        {feedback && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 shadow-sm ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : feedback.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-900"
                : "border-sky-200 bg-sky-50 text-sky-900"
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="mt-0.5">
              {feedback.type === "success" && <CheckCircle2 className="w-5 h-5" />}
              {feedback.type === "error" && <XCircle className="w-5 h-5" />}
              {feedback.type === "info" && <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{feedback.title}</p>
              <p className="text-sm opacity-90 mt-1">{feedback.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="rounded-lg p-1 hover:bg-black/5 transition"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}


        <div className="resume-toolbar mb-6">
          <div className="toolbar-input">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or Job Title..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchResume()}
              className="bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 w-full"
            />
          </div>

          <div className="relative">
            <select
              value={sortType}
              onChange={(e) => sortResume(e.target.value)}
              className="toolbar-select appearance-none pr-8"
            >
              <option value="">Sort: None</option>
              <option value="latest">Sort: Latest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="highscore">Sort: Highest ATS</option>
              <option value="lowscore">Sort: Lowest ATS</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterScore}
              onChange={(e) => filterResume(e.target.value)}
              className="toolbar-select appearance-none pr-8"
            >
              <option value="">Filter ATS: All</option>
              <option value="50">50+</option>
              <option value="60">60+</option>
              <option value="70">70+</option>
              <option value="80">80+</option>
              <option value="90">90+</option>
            </select>
            <Filter className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-teal-700 font-semibold text-sm hover:underline whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        </div>

       
        <div className="dash-card p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-slate-400 tracking-wide border-b border-slate-100 bg-slate-50">
                <th className="py-4 px-6 font-semibold">ID</th>
                <th className="py-4 px-6 font-semibold">ATS SCORE</th>
                <th className="py-4 px-6 font-semibold">DATE ANALYZED</th>
                <th className="py-4 px-6 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td
                    className="py-5 px-6 font-semibold text-teal-700 cursor-pointer"
                    onClick={() => navigate(`/resume/${resume.id}`)}
                  >
                    #{resume.id}
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${scoreColor(resume.atsScore)}`}
                          style={{ width: `${resume.atsScore}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-900">{resume.atsScore}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-slate-600">
                    {resume.uploadedAt.substring(0, 10)}
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="action-icon-btn"
                        title="View"
                        onClick={() => navigate(`/resume/${resume.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="action-icon-btn"
                        title="Improve"
                        disabled={improvingId === resume.id}
                        onClick={() => improveResume(resume.id)}
                      >
                        {improvingId === resume.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Wand2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        className="action-icon-btn"
                        title="Job Match"
                        onClick={() => navigate(`/jobMatch/${resume.id}`)}
                      >
                        <Briefcase className="w-4 h-4" />
                      </button>
                      <button
                        className="action-icon-btn"
                        title="Download"
                        onClick={() => downloadReport(resume.id)}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="action-icon-btn danger"
                        title="Delete"
                        onClick={() => deleteResume(resume.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

     
        {!isFilteredView && (
          <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
            <p className="text-slate-600 text-sm">
              Page <span className="font-semibold text-slate-900">{page + 1}</span> of{" "}
              {totalPages || 1}
            </p>
            <div className="flex gap-3">
              <button
                disabled={page === 0}
                onClick={() => setPage((prev) => prev - 1)}
                className="pagination-btn"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                disabled={page + 1 === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="pagination-btn pagination-btn-primary"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

     <Footer/>
    </div>
  );
}

export default ResumeList;
