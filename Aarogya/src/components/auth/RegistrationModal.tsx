import React, { useState, useEffect } from "react";
import "./RegistrationModal.css";
import { useAuth } from "../../hooks/useAuth.jsx";

type Role = "patient" | "doctor" | "lab";

export interface RegistrationPayload {
  role: Role;
  name: string;
  email: string;
  phone: string;
  password: string;
  specialization?: string;
  address?: string;
}

interface Props {
  open: boolean;
  onClose(): void;
  onRegister?(payload: RegistrationPayload): void;
  onOpenLogin?(): void;
  brandName?: string;
  logoSrc?: string;
}

const generateMathCaptcha = () => {
  const a = Math.floor(Math.random() * 8) + 1;
  const b = Math.floor(Math.random() * 8) + 1;
  return { question: `${a} + ${b} = ?`, answer: String(a + b) };
};

export default function RegistrationModal({ open, onClose, onRegister, onOpenLogin, brandName = "Aarogya 24/7", logoSrc }: Props) {
  const [role, setRole] = useState<Role>("patient");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [captcha, setCaptcha] = useState(() => generateMathCaptcha());
  const [captchaAttempt, setCaptchaAttempt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        specialization: "",
        address: "",
      });
      setCaptchaAttempt("");
      setError("");
      setSuccess(false);
      setCaptcha(generateMathCaptcha());
    }
  }, [open]);

  // Close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !success) onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, success]);

  if (!open) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password.trim()) {
      setError("Please enter a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (role === "doctor" && !formData.specialization.trim()) {
      setError("Please enter your specialization.");
      return;
    }

    if (role === "lab" && !formData.address.trim()) {
      setError("Please enter your lab address.");
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
      const userData: any = {
        role: role,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      if (role === "doctor") {
        userData.specialization = formData.specialization.trim();
      } else if (role === "lab") {
        userData.address = formData.address.trim();
      }

      // @ts-ignore - useAuth register function
      const result: any = await register(userData);

      if (result.success && result.user) {
        // Check if user needs approval
        if (result.user.approval_status === 'pending') {
          setSuccess(true);
          // Show pending message - don't navigate to dashboard
          // The success screen will show pending approval message
        } else {
          setSuccess(true);
          const userRole = result.user.role || role;
          // Call optional onRegister callback
          onRegister?.(userData as RegistrationPayload);
          // Navigate to appropriate dashboard after delay
          setTimeout(() => {
            onClose();
            const dashboardPath = userRole === "lab" ? "/lab-dashboard" : `/${userRole}-dashboard`;
            window.location.href = dashboardPath;
          }, 2000);
        }
      } else {
        setError(result.error || "Registration failed. Please try again.");
        setCaptcha(generateMathCaptcha());
        setCaptchaAttempt("");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || "An error occurred during registration");
      setCaptcha(generateMathCaptcha());
      setCaptchaAttempt("");
    } finally {
      setLoading(false);
    }
  };

  // Success view
  if (success) {
    const needsApproval = (role === "doctor" || role === "lab");
    return (
      <div className="am-overlay" role="dialog" aria-modal="true" onMouseDown={onClose}>
        <div className="am-modal" onMouseDown={(e) => e.stopPropagation()}>
          <div className="am-header am-header-flex">
            <div className="am-brand">
              {logoSrc ? (
                <img src={logoSrc} alt={`${brandName} logo`} className="am-logo-large" />
              ) : (
                <div className="am-logo-text">{brandName}</div>
              )}
              <div className="am-subtitle">{needsApproval ? "Registration Submitted!" : "Registration Successful!"}</div>
            </div>
          </div>
          <div className="am-body" style={{ textAlign: "center", padding: "40px 22px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>{needsApproval ? "⏳" : "✓"}</div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
              {needsApproval ? "Account Pending Approval" : "Account Created Successfully!"}
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: "1.6" }}>
              {needsApproval 
                ? "Your registration has been submitted. Your account is pending admin approval. You will be able to login once your account is approved."
                : "Redirecting to your dashboard..."
              }
            </p>
            {needsApproval && (
              <button 
                className="am-primary" 
                onClick={onClose}
                style={{ marginTop: "16px" }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="am-overlay" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="am-modal am-modal-large" onMouseDown={(e) => e.stopPropagation()}>
        <button className="am-close" onClick={onClose} aria-label="Close">×</button>

        <div className="am-header am-header-flex">
          <div className="am-brand">
            {logoSrc ? (
              <img src={logoSrc} alt={`${brandName} logo`} className="am-logo-large" />
            ) : (
              <div className="am-logo-text">{brandName}</div>
            )}
            <div className="am-subtitle">Create your account — join our platform</div>
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

          {/* Role selection */}
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
          </div>

          {/* Name */}
          <div className="am-field">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              disabled={loading}
              required
            />
          </div>

          {/* Phone */}
          <div className="am-field">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 98765 43210"
              disabled={loading}
              required
            />
          </div>

          {/* Email */}
          <div className="am-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              disabled={loading}
              required
            />
          </div>

          {/* Role-specific fields */}
          {role === "doctor" && (
            <div className="am-field">
              <label>Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder="e.g., Pathology, Cardiology"
                disabled={loading}
                required
              />
            </div>
          )}

          {role === "lab" && (
            <div className="am-field">
              <label>Lab Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter lab address"
                disabled={loading}
                required
              />
            </div>
          )}

          {/* Password */}
          <div className="am-field">
            <label>Password</label>
            <div className="am-pass-row">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password (min. 6 characters)"
                disabled={loading}
                required
              />
              <button type="button" className="am-show-btn" onClick={() => setShowPassword((s) => !s)} disabled={loading}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="am-field">
            <label>Confirm Password</label>
            <div className="am-pass-row">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                disabled={loading}
                required
              />
              <button type="button" className="am-show-btn" onClick={() => setShowConfirm((s) => !s)} disabled={loading}>
                {showConfirm ? "Hide" : "Show"}
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

          <button className="am-primary" type="submit" disabled={loading}>
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>

          <div className="am-or">or</div>

          {/* Social buttons row */}
          <div className="am-social-row">
            <button type="button" className="am-social" onClick={() => alert("Google signup (demo)")} disabled={loading}>
              <span className="am-icon">G</span> Continue with Google
            </button>
            <button type="button" className="am-social" onClick={() => alert("Facebook signup (demo)")} disabled={loading}>
              <span className="am-icon">f</span> Continue with Facebook
            </button>
          </div>

          <div className="am-small-note">
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onClose(); onOpenLogin?.(); }}>Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
}

