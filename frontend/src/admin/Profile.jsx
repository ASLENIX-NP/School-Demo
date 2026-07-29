import { useState } from "react";
import AdminLayout, { PageCard } from "./AdminLayout";

export default function Profile() {
  const [email, setEmail] = useState("smritibam005@gmail.com");
  const [password, setPassword] = useState(() => localStorage.getItem("admin_saved_password") || "admin123");
  const [msg, setMsg] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("admin_saved_email", email);
    localStorage.setItem("admin_saved_password", password);
    localStorage.setItem("admin_user_email", email);
    setMsg("Profile & Admin Password updated successfully!");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <AdminLayout title="My Profile & Security" subtitle="Manage your admin account credentials and password.">
      <PageCard>
        {msg && <div className="p-3 mb-4 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl">{msg}</div>}

        <form onSubmit={handleSave}>
          <div className="form-grid">
            <label className="field">
              Full Name
              <input defaultValue="Admin Smriti" />
            </label>
            <label className="field">
              Administrator Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="field">
              Admin Password
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className="field">
              Role
              <input defaultValue="School Administrator" disabled />
            </label>
          </div>

          <button type="submit" className="button" style={{ marginTop: 22 }}>
            Save Credentials & Password
          </button>
        </form>
      </PageCard>
    </AdminLayout>
  );
}
