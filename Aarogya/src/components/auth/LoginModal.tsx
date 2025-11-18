import React, { useState, useEffect } from "react";
import "./LoginModal.css";
import { useAuth } from "../../hooks/useAuth.jsx";

type Role = "patient" | "doctor" | "lab";

export interface LoginPayload {
  role: Role;
  identifier: string;
  password?: string;
  remember?: boolean;
}

interface Props {
  open: boolean;
  onClose(): void;
  onLogin?(payload: LoginPayload): void;
  onOpenRegister?(): void;
  brandName?: string;      // e.g. "PulsePathology" or "Aarogya 24/7"
  logoSrc?: string;        // optional path to logo image
}

const generateMathCaptcha = () => {
  const a = Math.floor(Math.random() * 8) + 1;
  const b = Math.floor(Math.random() * 8) + 1;
  return { question: `${a} + ${b} = ?`, answer: String(a + b) };
};

export default function LoginModal({ open, onClose, onLogin, onOpenRegister, brandName = "Aarogya 24/7", logoSrc }: Props) {
  const [usePhone, setUsePhone] = useState(true); // Default to phone for backend compatibility
  const [role, setRole] = useState<Role>("patient");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [captcha, setCaptcha] = useState(() => generateMathCaptcha());
  const [captchaAttempt, setCaptchaAttempt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setIdentifier("");
      setPassword("");
      setCaptchaAttempt("");
      setError("");
      setCaptcha(generateMathCaptcha());
    }
  }, [open]);

  // close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!identifier.trim()) {
      setError("Enter email or mobile.");
      return;
    }
    
    if (!password.trim()) {
      setError("Enter password.");
      return;
    }
    
    if (captchaAttempt.trim() !== captcha.answer) {
      setError("Captcha incorrect. Please try again.");
      setCaptcha(generateMathCaptcha());
      setCaptchaAttempt("");
      return;
    }

    setLoading(true);
    try {
      // For backend, we use phone number (identifier) and password
      // Map pathologist role to lab for backend compatibility
      const backendRole = role === "lab" ? "lab" : role;
      // @ts-ignore - useAuth login function accepts 3 parameters (phone, password, role)
      const result: any = await login(identifier.trim(), password, backendRole);
      
      if (result.success && result.user) {
        const userRole = result.user.role || backendRole;
        // Call optional onLogin callback
        onLogin?.({ role: backendRole as Role, identifier: identifier.trim(), password, remember });
        onClose();
        // Navigate to appropriate dashboard
        setTimeout(() => {
          const dashboardPath = userRole === "lab" ? "/lab-dashboard" : `/${userRole}-dashboard`;
          window.location.href = dashboardPath;
        }, 100);
      } else {
        setError(result.error || "Login failed. Please check your credentials.");
        setCaptcha(generateMathCaptcha());
        setCaptchaAttempt("");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || "An error occurred during login");
      setCaptcha(generateMathCaptcha());
      setCaptchaAttempt("");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = () => {
    if (!identifier.trim()) {
      setError("Enter mobile to receive OTP.");
      return;
    }
    // TODO: Implement OTP flow with backend
    alert("OTP sent (demo) to: " + identifier);
  };

  return (
    <div className="am-overlay" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="am-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="am-close" onClick={onClose} aria-label="Close">×</button>

        <div className="am-header am-header-flex">
          <div className="am-brand">
            {logoSrc ? (
              <img src={logoSrc} alt={`${brandName} logo`} className="am-logo-large" />
            ) : (
              <div className="am-logo-text">{brandName}</div>
            )}
            <div className="am-subtitle">Secure patient portal — access your reports</div>
          </div>
        </div>

        <form className="am-body" onSubmit={handleSubmit}>
          {/* Error message */}
          {error && (
            <div style={{ 
              padding: "10px 12px", 
              background: "#fee2e2", 
              border: "1px solid #fca5a5", 
              borderRadius: "8px", 
              color: "#dc2626", 
              fontSize: "13px" 
            }}>
              {error}
            </div>
          )}

          {/* Role + email/phone toggle */}
          <div className="am-role-row">
            <div className="am-role-pill-row" role="tablist" aria-label="Select role">
              <button
                type="button"
                className={`am-role-pill ${role === "patient" ? "active" : ""}`}
                onClick={() => setRole("patient")}
              >Patient</button>
              <button
                type="button"
                className={`am-role-pill ${role === "doctor" ? "active" : ""}`}
                onClick={() => setRole("doctor")}
              >Doctor</button>
              <button
                type="button"
                className={`am-role-pill ${role === "lab" ? "active" : ""}`}
                onClick={() => setRole("lab")}
              >Lab</button>
            </div>

            <label className="am-switch-label">
              <input
                type="checkbox"
                checked={usePhone}
                onChange={() => {
                  setUsePhone((s) => !s);
                  setIdentifier("");
                }}
              />
              <span>{usePhone ? "Phone" : "Email"}</span>
            </label>
          </div>

          {/* Identifier */}
          <div className="am-field">
            <label>{usePhone ? "Mobile number" : "Email address"}</label>
            <input
              type={usePhone ? "tel" : "email"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={usePhone ? "+91 98765 43210" : "you@example.com"}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="am-field">
            <label>Password</label>
            <div className="am-pass-row">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button type="button" className="am-show-btn" onClick={() => setShowPassword((s) => !s)} disabled={loading}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Captcha */}
          <div className="am-field am-captcha-row">
            <label>Prove you're human</label>
            <div className="am-captcha-inner">
              <div className="am-captcha-question">{captcha.question}</div>
              <input
                value={captchaAttempt}
                onChange={(e) => setCaptchaAttempt(e.target.value)}
                placeholder="Answer"
                disabled={loading}
              />
              <button
                type="button"
                className="am-refresh"
                onClick={() => {
                  setCaptcha(generateMathCaptcha());
                  setCaptchaAttempt("");
                }}
                title="Refresh captcha"
                disabled={loading}
              >↻</button>
            </div>
          </div>

          <div className="am-row-between">
            <label className="am-remember" style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "13px", color: "#475569" }}>
              <input 
                type="checkbox" 
                checked={remember} 
                onChange={(e) => setRemember(e.target.checked)} 
                disabled={loading}
              />
              Remember me
            </label>
            <a href="/forgot" className="am-forgot" style={{ color: "#5565f3", textDecoration: "none", fontSize: "13px" }}>Forgot?</a>
          </div>

          <button className="am-primary" type="submit" disabled={loading}>
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <button type="button" className="am-otp" onClick={handleOtp} disabled={loading}>
            Send OTP
          </button>

          <div className="am-or">or</div>

          {/* Social buttons row */}
          <div className="am-social-row">
            <button type="button" className="am-social" onClick={() => alert("Google login (demo)")} disabled={loading}>
              <span className="am-icon">G</span> Continue with Google
            </button>
            <button type="button" className="am-social" onClick={() => alert("Facebook login (demo)")} disabled={loading}>
              <span className="am-icon">f</span> Continue with Facebook
            </button>
          </div>

          <div className="am-small-note">
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onClose(); onOpenRegister?.(); }}>Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
}

