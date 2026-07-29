import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("smritibam005@gmail.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load remembered credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem("admin_saved_email");
    const savedPass = localStorage.getItem("admin_saved_password");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      setEmail("smritibam005@gmail.com");
    }
    if (savedPass) {
      setPassword(savedPass);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    // Save session
    localStorage.setItem("admin_token", "active");
    localStorage.setItem("admin_user_email", email.trim());

    if (rememberMe) {
      localStorage.setItem("admin_saved_email", email.trim());
      localStorage.setItem("admin_saved_password", password);
    } else {
      localStorage.removeItem("admin_saved_email");
      localStorage.removeItem("admin_saved_password");
    }

    setSuccess(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">SS</div>

        <div className="eyebrow">WELCOME TO</div>
        <h1>Smriti School</h1>
        <p className="subtitle">Sign in to the administration portal</p>

        {error && (
          <div className="p-3 mb-4 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Authenticating... Redirecting to Dashboard</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="field">
            <label className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Email address</span>
            </label>
            <input
              type="email"
              required
              placeholder="smritibam005@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-red-500" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-row">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="button flex items-center justify-center gap-2">
            <span>Sign in to dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
