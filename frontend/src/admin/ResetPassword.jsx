import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Save updated admin password
    localStorage.setItem("admin_saved_email", "smritibam005@gmail.com");
    localStorage.setItem("admin_saved_password", newPassword);
    setMessage("Password updated successfully! Redirecting to login...");

    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">SS</div>
        <h1>Create new password</h1>
        <p className="subtitle">Set your admin portal password for <strong>smritibam005@gmail.com</strong></p>

        {error && <div className="p-3 mb-4 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl">{error}</div>}
        {message && <div className="p-3 mb-4 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl">{message}</div>}

        <form onSubmit={handleReset} className="login-form">
          <div className="field">
            <label className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>New password</span>
            </label>
            <input
              type="password"
              required
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Confirm new password</span>
            </label>
            <input
              type="password"
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="button flex items-center justify-center gap-2">
            <span>Update Admin Password</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
