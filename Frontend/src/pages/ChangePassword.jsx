import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  LayoutGrid,
  ScanLine,
  Target,
  TrendingUp,
  Settings,
  Bell,
  Sparkles,
  HelpCircle,
  LogOut,
  Search,
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Info,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import StatusBanner from "../components/StatusBanner";
import { getUserFriendlyErrorMessage } from "../utils/errorMessages";

function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0–4
  };

  const strength = getStrength(newPassword);

  const changePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setFeedback({
        type: "error",
        title: "Missing fields",
        message: "Please fill in all fields before continuing.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({
        type: "error",
        title: "Password mismatch",
        message: "New password and confirmation do not match.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put("/auth/changepassword", {
        oldPassword,
        newPassword,
      });

      setFeedback({
        type: "success",
        title: "Password updated",
        message: response.data,
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setFeedback({
        type: "error",
        title: "Update failed",
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
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8 max-w-xl mx-auto">

          <span className="text-slate-500 font-medium">Security</span>
        </div>

        <div className="security-card">
          {feedback && (
            <div className="mb-5">
              <StatusBanner
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                onClose={() => setFeedback(null)}
              />
            </div>
          )}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mb-5">
              <Lock className="w-7 h-7 text-teal-700" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              Update Security Credentials
            </h1>
            <p className="text-slate-500 mt-3 max-w-sm">
              Ensure your career data remains protected with a strong, unique
              password.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="field-label">Current Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showOld ? "text" : "password"}
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="security-input"
                />
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="field-label">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="security-input"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              
            </div>

            <div>
              <label className="field-label">Confirm New Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="security-input pr-4"
                />
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-red-500 mt-2">Passwords do not match</p>
              )}
            </div>

            <button
              onClick={changePassword}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-teal-700/30 transition disabled:opacity-60"
            >
              <RotateCcw className="w-5 h-5" />
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>

          <hr className="border-slate-100 my-6" />

         
        </div>
      </main>

      
    <Footer/>
    </div>
  );
}

export default ChangePassword;
