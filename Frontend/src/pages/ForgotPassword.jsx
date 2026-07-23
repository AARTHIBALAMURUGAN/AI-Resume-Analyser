import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Brain,
  Settings,
  Mail,
  KeyRound,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Fingerprint,
  RotateCw,
} from "lucide-react";
import "../styles/dashboard.css";
import StatusBanner from "../components/StatusBanner";
import { getUserFriendlyErrorMessage } from "../utils/errorMessages";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const sendOtp = async () => {
    if (!email.trim()) {
      setFeedback({
        type: "error",
        title: "Email required",
        message: "Please enter your email address.",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/auth/sendotp", { email });
      setFeedback({
        type: "success",
        title: "OTP sent",
        message: response.data.message,
      });
      setOtpSent(true);
    } catch (err) {
      setFeedback({
        type: "error",
        title: "Could not send OTP",
        message: getUserFriendlyErrorMessage(err, "Please try again."),
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setFeedback({
        type: "error",
        title: "OTP required",
        message: "Please enter the OTP sent to your email.",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/auth/verifyotp", { email, otp });
      setFeedback({
        type: "success",
        title: "OTP verified",
        message: response.data.message,
      });
      setVerified(true);
    } catch (err) {
      setFeedback({
        type: "error",
        title: "Verification failed",
        message: getUserFriendlyErrorMessage(err, "Please check the code and try again."),
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword.trim()) {
      setFeedback({
        type: "error",
        title: "Password required",
        message: "Please enter a new password.",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/auth/resetpassword", {
        email,
        otp,
        newPassword,
      });
      const flash = {
        type: "success",
        title: "Password reset",
        message: response.data.message,
      };
      setFeedback(flash);
      setTimeout(() => navigate("/", { state: { flash } }), 900);
    } catch (err) {
      setFeedback({
        type: "error",
        title: "Reset failed",
        message: getUserFriendlyErrorMessage(err, "Please try again."),
      });
    } finally {
      setLoading(false);
    }
  };

  const step = verified ? 3 : otpSent ? 2 : 1;

  return (
    <div className="recovery-page">
    

    
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="recovery-card">
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
              {step === 1 && <RotateCw className="w-7 h-7 text-teal-700" />}
              {step === 2 && <Fingerprint className="w-7 h-7 text-teal-700" />}
              {step === 3 && <Lock className="w-7 h-7 text-teal-700" />}
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              {step === 1 && "Account Recovery"}
              {step === 2 && "Verify Your Identity"}
              {step === 3 && "Set New Password"}
            </h1>
            <p className="text-slate-500 mt-2">
              {step === 1 && "Enter your email to receive a secure recovery code."}
              {step === 2 && (
                <>
                  Enter the 6-digit code sent to <br />
                  <span className="font-semibold text-slate-700">{email}</span>
                </>
              )}
              {step === 3 && "Choose a strong, unique password for your account."}
            </p>
          </div>

      
          {step === 1 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="recovery-input"
                />
              </div>

              <button onClick={sendOtp} disabled={loading} className="recovery-btn mt-6">
                {loading ? "Sending..." : "Send OTP"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          )}

         
          {step === 2 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block text-center">
                Enter Verification Code
              </label>
              <input
                placeholder="••••••"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                className="otp-input"
              />

              <button onClick={verifyOtp} disabled={loading} className="recovery-btn mt-6">
                {loading ? "Verifying..." : "Verify OTP"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>

              <button
                onClick={sendOtp}
                className="w-full text-center text-sm text-teal-700 font-semibold hover:underline mt-3"
              >
                Resend Code
              </button>
            </div>
          )}

   
          {step === 3 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="recovery-input"
                />
              </div>

              <button onClick={resetPassword} disabled={loading} className="recovery-btn mt-6">
                {loading ? "Resetting..." : "Reset Password"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          )}

        
          <div className="flex items-center justify-center gap-2 mt-8">
            <span className={`step-dot ${step === 1 ? "active" : "done"}`} />
            <span className={`step-dot ${step === 2 ? "active" : step > 2 ? "done" : ""}`} />
            <span className={`step-dot ${step === 3 ? "active" : ""}`} />
          </div>

          <hr className="border-slate-100 my-6" />

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 w-full text-teal-700 font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>

    
        <div className="flex items-center justify-center gap-3 text-xs text-slate-400 tracking-wide mt-8">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            SECURE PROTOCOL
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4" />
            EMAIL AUTH
          </span>
        </div>
      </main>

      <footer className="flex items-center justify-between px-8 py-6 bg-slate-100 text-sm text-slate-500">
        <p>© 2024 CareerAI. Powered by Quantum Intelligence.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-teal-700">Privacy Policy</a>
          <a href="#" className="hover:text-teal-700">Terms of Service</a>
          <a href="#" className="hover:text-teal-700">API Documentation</a>
        </div>
      </footer>
    </div>
  );
}

export default ForgotPassword;
