import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Brain } from "lucide-react";
import "../styles/register.css";
import StatusBanner from "../components/StatusBanner";
import { getUserFriendlyErrorMessage } from "../utils/errorMessages";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 4500);
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
    const email = form.email.trim();
    const password = form.password.trim();
    const name = form.name.trim();

    if (!name) {
      errors.name = "Name is required";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!agreed) {
      errors.agreed = "You must agree to continue";
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
        message: "Please review your details before creating the account.",
      });
      return;
    }
    try {
      await api.post("/auth/register", form);
      const flash = {
        type: "success",
        title: "Registration successful",
        message: "Your account has been created. Redirecting to login...",
      };
      setFeedback(flash);
      setTimeout(() => navigate("/", { state: { flash } }), 900);
    } catch (err) {
      setFeedback({
        type: "error",
        title: "Registration failed",
        message: getUserFriendlyErrorMessage(err, "Please try again."),
      });
    }
  };

  return (
    <div className="register-page">
      
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-300/50 mb-6">
          <Brain className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-teal-800 text-center">
          AI Resume Analyser
        </h1>
        <p className="text-slate-500 text-sm tracking-widest uppercase mt-2">
          Enterprise Precision Intelligence
        </p>
      </div>

      
      <div className="relative w-full max-w-md">
        <div className="register-card">
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
          <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-1 mb-6">
            Start your career transformation today.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                aria-invalid={Boolean(fieldErrors.name)}
                className="register-input pl-4"
              />
              {fieldErrors.name && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                aria-invalid={Boolean(fieldErrors.email)}
                className="register-input pl-4"
              />
              {fieldErrors.email && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(fieldErrors.password)}
                  className="register-input pl-4 pr-10"
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

            <label className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-cyan-400"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="text-cyan-600 font-medium hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-cyan-600 font-medium hover:underline">
                  AI Ethics Policy
                </a>
                .
              </span>
            </label>
            {fieldErrors.agreed && (
              <p className="-mt-3 text-sm text-red-600">{fieldErrors.agreed}</p>
            )}

            <button type="submit" className="register-btn">
              Register
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-slate-700 mb-6">
            Already have an account?{" "}
            <Link to="/" className="text-teal-700 font-semibold hover:underline">
              Login
            </Link>
          </p>

        </div>

        
      </div>

      
      <p className="text-xs text-slate-400 text-center mt-10 max-w-md">
        © 2024 CareerAI Systems. Powered by Advanced Neural Networks for
        Precision Analysis.
      </p>
    </div>
  );
}

export default Register;
