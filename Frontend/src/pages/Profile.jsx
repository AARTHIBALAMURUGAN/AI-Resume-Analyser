import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Mail,
  Briefcase,
  MapPin,
  User,
  Zap,
  FileText,
  CheckCircle2,
  Crosshair,
  Pencil,
} from "lucide-react";
import "../styles/profile.css";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import StatusBanner from "../components/StatusBanner";
import { getUserFriendlyErrorMessage } from "../utils/errorMessages";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    location: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      setProfile(response.data);
      setEditForm({
        name: response.data.name || "",
        location: response.data.location || "",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        title: "Unable to load profile",
        message: getUserFriendlyErrorMessage(err, "Please refresh or log in again."),
      });
    }
  };

  const openEdit = () => {
    setEditForm({
      name: profile?.name || "",
      location: profile?.location || "",
    });
    setIsEditing(true);
  };

  const closeEdit = () => {
    setIsEditing(false);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setFeedback({
        type: "error",
        title: "Name required",
        message: "Please enter your full name.",
      });
      return;
    }

    setSaving(true);
    try {
      const response = await api.put("/auth/profile", {
        name: editForm.name.trim(),
        location: editForm.location.trim(),
      });
      setProfile(response.data);
      setFeedback({
        type: "success",
        title: "Profile updated",
        message: "Your information has been saved successfully.",
      });
      setIsEditing(false);
    } catch (err) {
      setFeedback({
        type: "error",
        title: "Update failed",
        message: getUserFriendlyErrorMessage(err, "Please try again."),
      });
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="dash-shell items-center justify-center px-4">
        <div className="w-full max-w-md">
          {feedback ? (
            <StatusBanner
              type={feedback.type}
              title={feedback.title}
              message={feedback.message}
              onClose={() => setFeedback(null)}
            />
          ) : (
            <h2 className="text-slate-500 text-lg text-center">Loading...</h2>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dash-shell">
      <Sidebar />

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

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-500 mt-2 max-w-xl">
              Manage your account credentials and AI-generated insights history
              for optimized career performance tracking.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="dash-card lg:col-span-2">
            <div className="flex gap-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5 flex-1">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    <User className="w-3.5 h-3.5" />
                    Full Name
                  </p>
                  <p className="text-lg font-semibold text-slate-900">{profile.name}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    <Mail className="w-3.5 h-3.5" />
                    Email Address
                  </p>
                  <p className="text-lg font-semibold text-slate-900 break-all">{profile.email}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    Current Role
                  </p>
                  <p className="text-lg font-semibold text-slate-900">{profile.role}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Location
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {profile.location || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-6 border-slate-200" />

            <div className="flex gap-3">
              <button className="dash-btn-primary flex items-center gap-2" onClick={openEdit}>
                <Pencil className="w-4 h-4" />
                Update Information
              </button>
              <button className="dash-btn-secondary" onClick={() => navigate("/changepassword")}>
                Change Password
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="dash-card flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4">
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
                    strokeDashoffset={2 * Math.PI * 52 * (1 - (profile.aiMatch || 0) / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-900">{profile.aiMatch}</span>
                  <span className="text-xs text-slate-400 tracking-wide">AI MATCH</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Total Resumes</h3>
              <p className="text-4xl font-bold text-teal-700 mt-1">{profile.totalResumes}</p>
              <p className="text-sm text-slate-500 mt-1">Analyses completed this month</p>
            </div>

            <div className="dash-card">
              <p className="flex items-center gap-2 font-semibold text-slate-900 mb-4">
                <Zap className="w-4 h-4 text-cyan-500" />
                Quick Insights
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-teal-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Last scan: {profile.lastScan || "No scans yet"}
                    </p>
                    <p className="text-xs text-slate-400">{profile.lastScanTime || ""}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <Crosshair className="w-4 h-4 text-teal-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {profile.targetRole ? `Targeting ${profile.targetRole} roles` : "No target role set"}
                    </p>
                    <p className="text-xs text-slate-400">Strategy updated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-card mt-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Detected Expertise</h3>
              <p className="text-slate-500 text-sm mt-1">
                AI identified skills based on your profile and uploaded history.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {(profile.skills || []).map((skill) => (
              <span key={skill} className="skill-pill">
                {skill}
                <CheckCircle2 className="w-4 h-4" />
              </span>
            ))}
            {(profile.suggestedSkills || []).map((skill) => (
              <span key={skill} className="skill-pill-muted">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Update Information</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Edit the profile details that should appear across your account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-xl px-3 py-2 text-slate-500 hover:bg-slate-100 transition"
                >
                  Close
                </button>
              </div>

              <form className="space-y-5" onSubmit={saveProfile}>
                <div>
                  <label className="field-label">Full Name</label>
                  <input
                    className="security-input"
                    value={editForm.name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="field-label">Email Address</label>
                  <input className="security-input opacity-80" value={profile.email} readOnly />
                  <p className="text-xs text-slate-400 mt-2">
                    Email is used for login, so it stays locked here.
                  </p>
                </div>

                <div>
                  <label className="field-label">Role</label>
                  <input className="security-input opacity-80" value={profile.role} readOnly />
                </div>

                <div>
                  <label className="field-label">Location</label>
                  <input
                    className="security-input"
                    value={editForm.location}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter your location"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="dash-btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="dash-btn-primary flex-1 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
