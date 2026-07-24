import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/api";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Brain } from "lucide-react";
import "../styles/login.css";
import StatusBanner from "../components/StatusBanner";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState(location.state?.flash || null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    if (fieldErrors[name]) {
      setFieldErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (!form.password.trim()) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFeedback({
        type: "error",
        title: "Fix the highlighted fields",
        message: "Please review the email and password before logging in.",
      });
      return;
    }
    try {
      const response = await api.post("/auth/login", form);
      const token = response.data;
      if (typeof token !== "string" || token.split(".").length !== 3) {
        throw new Error("Login did not return a valid token");
      }
      localStorage.setItem("token", token);
      setFeedback({
        type: "success",
        title: "Login successful",
        message: "Redirecting you to the dashboard.",
      });
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err) {
      localStorage.removeItem("token");
      setFeedback({
        type: "error",
        title: "Login failed",
        message: getErrorMessage(err, "Please check your credentials and try again."),
      });
    }
  };

  return (
    <div className="login-page">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

     
      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-6">
          <Brain className="w-8 h-8 text-cyan-100" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
          AI Resume Analyser
        </h1>
        <p className="text-slate-500 text-center mt-3 max-w-xs">
          Precision engineering for your professional evolution.
        </p>
      </div>

    
      <div className="login-card">
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="name@career-ai.com"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="login-input"
                aria-invalid={Boolean(fieldErrors.email)}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-800">
                Password
              </label>
              <p
                onClick={() => navigate("/forgotpassword")}
                className="text-sm font-medium text-cyan-600 hover:text-cyan-700 cursor-pointer"
              >
                Forgot Password?
              </p>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="login-input pr-10"
                aria-invalid={Boolean(fieldErrors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <button type="submit" className="login-btn">
            Login
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="flex justify-center mt-6">
          <span className="text-[11px] tracking-widest uppercase text-slate-500 bg-slate-300/60 px-3 py-1 rounded">
            System Access
          </span>
        </div>

        <p className="text-center text-slate-700 mt-6">
          Don't have Account?{" "}
          <Link to="/register" className="text-cyan-600 font-semibold hover:text-cyan-700">
            Register
          </Link>
        </p>
      </div>
      
      <div className="relative z-10 mt-10 flex flex-col items-center text-center">
        <div className="flex gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-slate-200">Privacy Policy</a>
          <a href="#" className="hover:text-slate-200">AI Ethics</a>
          <a href="#" className="hover:text-slate-200">Support</a>
        </div>
        <p className="text-xs text-slate-600 mt-3">
          © 2024 CareerAI Systems. Powered by Advanced Neural Networks.
        </p>
      </div>

    
      <div className="ai-status-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cyan-600 font-semibold text-sm">AI Core Status</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <div className="h-0.5 w-full bg-cyan-400/40 rounded mb-3">
          <div className="h-0.5 w-2/3 bg-cyan-400 rounded" />
        </div>
        <p className="text-xs text-slate-600">
          Neural pathways optimized for resume parsing.
        </p>
      </div>
    </div>
  );
}

export default Login;
