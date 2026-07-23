import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
Eye,
 
} from "lucide-react";
import api from "../api/api";
import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer";
import StatusBanner from "../components/StatusBanner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get("/resume/dashboard");
      setDashboard(response.data);
    } catch (err) {
      const flash = {
        type: "error",
        title: "Session expired",
        message: "Please log in again to view your dashboard.",
      };
      setFeedback(flash);
      setTimeout(() => navigate("/", { state: { flash } }), 1200);
    }
  };

  

  if (!dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md">
          {feedback && (
            <StatusBanner
              type={feedback.type}
              title={feedback.title}
              message={feedback.message}
            />
          )}
          {!feedback && <h2 className="text-slate-500 text-lg text-center">Loading....</h2>}
        </div>
      </div>
    );
  }

  const atsData = [
    { name: "Average", score: dashboard.averageAtsScore || 0 },
    { name: "Highest", score: dashboard.highestAtsScore || 0 },
    { name: "Lowest", score: dashboard.lowestAtsScore || 0 },
  ];

  const above80 = dashboard.resumesAbove80 || 0;
  const total = dashboard.totalResumes || 0;
  const below80 = total - above80;
  const highTierPct = total ? Math.round((above80 / total) * 100) : 0;

  const resumeData = [
    { name: "Above 80 Score", value: above80 },
    { name: "Below 80 Score", value: below80 },
  ];
  const COLORS = ["#22d3ee", "#e2e8f0"];

  const avgScore = dashboard.averageAtsScore || 0;

  const scoreBadgeColor = (score) => {
    if (score >= 80) return "bg-cyan-400";
    if (score >= 60) return "bg-teal-700";
    return "bg-red-400";
  };

  

  return (
    <div className="dash-shell">
      
      <Sidebar/>

      
      <main className="ml-0 md:ml-72 mt-16 flex-1 px-4 sm:px-6 md:px-10 py-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {dashboard.user}
        </h1>
        <p className="text-slate-500 mt-2">
          Your AI-driven career insights are ready for review.
        </p>

      
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-8">
          <div className="stat-card">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">TOTAL</span>
            <span className="text-3xl font-bold text-slate-900 my-1">{total}</span>
            <span className="text-xs text-slate-400">Resumes</span>
          </div>
          
          <div className="stat-card">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">AVERAGE</span>
            <span className="text-3xl font-bold text-slate-900 my-1">
              {avgScore.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">ATS Score</span>
          </div>
          <div className="stat-card">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">HIGHEST</span>
            <span className="text-3xl font-bold text-slate-900 my-1">
              {dashboard.highestAtsScore}
            </span>
            <span className="text-xs text-slate-400">ATS Score</span>
          </div>
          <div className="stat-card">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">LOWEST</span>
            <span className="text-3xl font-bold text-slate-900 my-1">
              {dashboard.lowestAtsScore}
            </span>
            <span className="text-xs text-slate-400">ATS Score</span>
          </div>
          <div className="stat-card">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">MATCHES</span>
            <span className="text-3xl font-bold text-slate-900 my-1">
              {dashboard.totalJobMatches}
            </span>
            <span className="text-xs text-slate-400">Job Leads</span>
          </div>
          <div className="stat-card">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">ELITE</span>
            <span className="text-3xl font-bold text-slate-900 my-1">{above80}</span>
            <span className="text-xs text-slate-400">ATS &gt; 80</span>
          </div>
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="dash-card lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">ATS Score Analytics</h2>
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Benchmark
              </span>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={atsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#f1f5f9" }} />
                <Bar dataKey="score" fill="#22d3ee" radius={[6, 6, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="mini-stat">
                <span className="text-2xl font-bold text-slate-900">{avgScore.toFixed(1)}</span>
                <div className="mini-bar">
                  <div className="mini-bar-fill" style={{ width: `${avgScore}%` }} />
                </div>
                <span className="text-sm text-slate-500">Average</span>
              </div>
              <div className="mini-stat">
                <span className="text-2xl font-bold text-slate-900">
                  {dashboard.highestAtsScore}
                </span>
                <div className="mini-bar">
                  <div className="mini-bar-fill" style={{ width: `${dashboard.highestAtsScore}%` }} />
                </div>
                <span className="text-sm text-slate-500">Highest</span>
              </div>
              <div className="mini-stat">
                <span className="text-2xl font-bold text-slate-900">
                  {dashboard.lowestAtsScore}
                </span>
                <div className="mini-bar">
                  <div className="mini-bar-fill" style={{ width: `${dashboard.lowestAtsScore}%` }} />
                </div>
                <span className="text-sm text-slate-500">Lowest</span>
              </div>
            </div>
          </div>

          <div className="dash-card flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-slate-900 self-start mb-4">
              Overall Health
            </h2>
            <div className="relative w-44 h-44 mb-4">
              <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                <circle cx="70" cy="70" r="60" stroke="#e2e8f0" strokeWidth="10" fill="none" />
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="#0f766e"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - avgScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-900">{avgScore.toFixed(1)}</span>
                <span className="text-xs text-slate-400 tracking-wide mt-1">AVERAGE SCORE</span>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${avgScore}%` }} />
            </div>
            <p className="text-sm text-slate-500">
              You are outperforming{" "}
              <span className="font-semibold text-slate-700">
                {dashboard.percentileRank || 68}%
              </span>{" "}
              of candidates in your field.
            </p>
          </div>
        </div>

      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="dash-card">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Resume Distribution</h2>
            <div className="relative flex justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={resumeData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {resumeData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-900">{highTierPct}%</span>
                <span className="text-xs text-slate-400 tracking-wide">HIGH TIER</span>
              </div>
            </div>

            <div className="space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-cyan-400" />
                  Above 80 Score
                </span>
                <span className="font-semibold text-slate-900">{above80}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-slate-200" />
                  Below 80 Score
                </span>
                <span className="font-semibold text-slate-900">{below80}</span>
              </div>
            </div>
          </div>

          <div className="dash-card lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
              <a href="#" className="text-teal-700 font-semibold text-sm hover:underline">
                View All
              </a>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-slate-400 tracking-wide border-b border-slate-100">
                 
                  <th className="py-3 font-semibold">ATS SCORE</th>
                  <th className="py-3 font-semibold">ANALYSIS DATE</th>
                  <th className="py-3 font-semibold">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentResumes.map((resume) => (
                  <tr key={resume.id} className="border-b border-slate-50 last:border-0">
               
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${scoreBadgeColor(resume.atsScore)}`}
                            style={{ width: `${resume.atsScore}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-900">{resume.atsScore}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600">
                      {resume.uploadedAt.substring(0, 10)}
                    </td>
                    <td className="py-4">
                      <Eye className="w-4 h-4 text-slate-400 hover:text-teal-700 cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

     <Footer/>
    </div>
  );
};

export default Dashboard;
