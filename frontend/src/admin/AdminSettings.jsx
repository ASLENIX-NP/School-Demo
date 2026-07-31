import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Shield,
  Mail,
  Lock,
  Image as ImageIcon,
  Save,
  Key,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    admin_name: "Admin",
    admin_email: "",
    username: "admin",
    role: "Administrator",
    profile_photo: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // States mapping to backend database columns
  const [lockAccount, setLockAccount] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [maxAttempts, setMaxAttempts] = useState("5");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [activity, setActivity] = useState([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const uniqueDevices = [
    ...new Set(activity.map(item => item.device))
  ];

  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      const res = await fetch("https://school-website-backend-ixx2.onrender.com/api/admin-settings");
      const result = await res.json();

      if (result.data) {
        setSettings((prev) => ({ ...prev, ...result.data }));
      }
      const loginRes = await fetch(
        "https://school-website-backend-ixx2.onrender.com/api/admin-settings/login-activity"
      );
      
      const loginData = await loginRes.json();
      
      if (loginData.success) {
        setActivity(loginData.data);
      }
      
      if (result.data) {
        setLockAccount(result.data.lock_account);
        setTwoFactor(result.data.two_factor);
        setSessionTimeout(String(result.data.session_timeout));
        setMaxAttempts(String(result.data.max_login_attempts));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const showNotification = (
    message,
    type = "success"
  ) => {
    setNotification({
      show: true,
      message,
      type,
    });
  
    setTimeout(() => {
      setNotification((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3500);
  };

  const handleProfileUpload = async (e) => {
    console.log("UPLOAD FUNCTION FIRED");
  
    const file = e.target.files[0];
  
    console.log("SELECTED FILE:", file);
  
    if (!file) {
      console.log("NO FILE SELECTED");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("image", file);
  
      console.log("SENDING REQUEST...");
  
      const res = await fetch(
        "https://school-website-backend-ixx2.onrender.com/api/admin-settings/upload-photo",
        {
          method: "POST",
          body: formData,
        }
      );
  
      console.log("STATUS:", res.status);
  
      const data = await res.json();
  
      console.log("RESPONSE:", data);
  
      if (data.success) {
        await fetchSettings();
        showNotification(
            "Profile photo updated successfully"
          );
      }
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
    }
  };

  const handleSaveChanges = async () => {
    const payload = {
      session_timeout: Number(sessionTimeout),
      max_login_attempts: Number(maxAttempts),
      two_factor: twoFactor,
      lock_account: lockAccount,
    };

    try {
      setSaving(true);

      const res = await fetch("https://school-website-backend-ixx2.onrender.com/api/admin-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchSettings();
        showNotification(
            "Settings saved successfully"
          );
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
        }, 3000);
      } else {
        showNotification(
            "Failed to save settings",
            "error"
          );
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      showNotification("An error occurred while saving.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const res = await fetch(
        "https://school-website-backend-ixx2.onrender.com/api/admin-settings/email",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: newEmail,
          }),
        }
      );
  
      const data = await res.json();
  
      if (data.success) {
        showNotification(
            "Email updated successfully"
          );
  
        setSettings({
          ...settings,
          admin_email: newEmail,
        });
  
        setShowEmailModal(false);
      } else {
        showNotification(
            "Failed to update email",
            "error"
          );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
        showNotification(
            "Passwords do not match",
            "error"
          );
      return;
    }
  
    try {
      const res = await fetch(
        "https://school-website-backend-ixx2.onrender.com/api/admin-settings/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );
  
      const data = await res.json();
  
      if (data.success) {
        showNotification(
            "Password updated successfully"
          );
  
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
  
        setShowPasswordModal(false);
      } else {
        showNotification(data.message || "Could not update password.", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f5] via-[#f7f7fb] to-[#eef5ff]">
        <h2 className="text-xl font-semibold text-slate-700 animate-pulse">
          Loading Settings...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f5] via-[#f7f7fb] to-[#eef5ff] pb-12">
      
      {/* TOP NAVBAR */}
<div
  className="relative z-0"
  style={{
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95))",
    borderBottom: "1px solid rgba(75,46,131,0.12)",
    boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
    backdropFilter: "blur(18px)",
  }}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <Link
      to="/admin/dashboard"
      className="inline-flex w-fit items-center gap-2 font-black transition-all hover:-translate-x-1"
      style={{ color: "#0B1020" }}
    >
      <ArrowLeft size={20} />
      <span>Back to Dashboard</span>
    </Link>

    <button
      onClick={handleSaveChanges}
      disabled={saving}
      className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black shadow-lg transition-all hover:scale-105 disabled:opacity-70"
      style={{
        color: "#020617",
        background: "linear-gradient(135deg, #FACC15, #38BDF8)",
        boxShadow:
          "0 18px 42px rgba(56,189,248,0.24), inset 0 1px 0 rgba(255,255,255,0.45)",
      }}
    >
      <Save size={16} />
      <span>{saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}</span>
    </button>
  </div>
</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* SECURITY STATISTICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium text-sm">Login Attempts</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">
  {activity.length}
</h3>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium text-sm">Devices</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">
  {uniqueDevices.length}
</h3>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium text-sm">2FA Status</p>
            <h3 className={`text-3xl font-black mt-1 ${twoFactor ? "text-green-600" : "text-red-500"}`}>
              {twoFactor ? "Enabled" : "Disabled"}
            </h3>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium text-sm">Account Status</p>
            <h3 className="text-3xl font-black text-green-600 mt-1">Secure</h3>
          </div>
        </div>

        {/* ADMIN ACCOUNT SECTION */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
              <User className="text-purple-700" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Admin Account</h2>
              <p className="text-slate-500">Manage your administrator account info.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* PROFILE LEFT */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-3xl p-6 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <img
                  src={settings?.profile_photo || "https://i.pravatar.cc/150?img=12"}
                  alt="Admin Avatar"
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-purple-100"
                />
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-slate-800">{settings?.admin_name}</h3>
                  <p className="text-slate-500 text-sm">{settings?.admin_email}</p>
                  <p className="text-xs text-purple-600 font-semibold bg-purple-50 inline-block px-2.5 py-1 rounded-md mt-1">
                    @{settings?.username}
                  </p>
                </div>
              </div>

              {/* KPI Style Cards */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Role</p>
                  <h4 className="font-bold text-slate-800 mt-0.5">{settings?.role}</h4>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Status</p>
                  <h4 className="font-bold text-green-600 mt-0.5">Active</h4>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Last Login</p>
                  <h4 className="font-bold text-slate-800 mt-0.5">Today</h4>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Permissions</p>
                  <h4 className="font-bold text-slate-800 mt-0.5">Full Access</h4>
                </div>
              </div>
            </div>

            {/* ACTION CARDS RIGHT */}
            <div className="space-y-4">
              <div 
                onClick={() => setShowPasswordModal(true)}
                className="group border border-slate-150 rounded-3xl p-5 flex items-start gap-4 hover:bg-slate-50 hover:shadow-md cursor-pointer transition-all duration-200"
              >
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-700 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Change Password</h4>
                  <p className="text-slate-500 text-sm mt-0.5">Update administrator credentials security parameters.</p>
                </div>
              </div>

              <div
                onClick={() => {
                  setNewEmail(settings?.admin_email || "");
                  setShowEmailModal(true);
                }}
                className="group border border-slate-150 rounded-3xl p-5 flex items-start gap-4 hover:bg-slate-50 hover:shadow-md cursor-pointer transition-all duration-200"
              >
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-700 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Change Email</h4>
                  <p className="text-slate-500 text-sm mt-0.5">Update primary contact and system alert email address.</p>
                </div>
              </div>

              <div 
               onClick={() => {
                console.log("CARD CLICKED");
                document.getElementById("profileUpload")?.click();
              }}
                className="group border border-slate-150 rounded-3xl p-5 flex items-start gap-4 hover:bg-slate-50 hover:shadow-md cursor-pointer transition-all duration-200"
              >
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-700 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Update Profile Photo</h4>
                  <input
                    id="profileUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileUpload}
                  />
                  <p className="text-slate-500 text-sm mt-0.5">Upload a clean thumbnail layout to Supabase Storage bucket.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECURITY SETTINGS SECTION */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Shield className="text-purple-700" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Security Settings</h2>
              <p className="text-slate-500">Configure global platform security rules.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* CONFIGURATIONS LEFT */}
            <div className="space-y-6">
              <div>
                <label className="font-semibold text-slate-700 text-sm block">
                  Session Timeout
                </label>
                <select 
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 mt-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                  <option value={120}>120 Minutes</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 text-sm block">
                  Maximum Login Attempts
                </label>
                <select 
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 mt-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition"
                >
                  <option value={5}>5 Attempts</option>
                  <option value={10}>10 Attempts</option>
                </select>
              </div>

              {/* TOGGLE 1 */}
              <div className="flex justify-between items-center border border-slate-150 rounded-2xl p-4 bg-slate-50/50">
                <span className="font-medium text-slate-700 text-sm">
                  Lock Account After Failed Attempts
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={lockAccount}
                    onChange={(e) => setLockAccount(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* TOGGLE 2 */}
              <div className="flex justify-between items-center border border-slate-150 rounded-2xl p-4 bg-slate-50/50">
                <span className="font-medium text-slate-700 text-sm">
                  Two Factor Authentication
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={twoFactor}
                    onChange={(e) => setTwoFactor(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>

            {/* RECENT LOGIN & ALERTS RIGHT */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-800">
                    Recent Login Activity
                  </h3>
                  <button
  onClick={() => setShowActivityModal(true)}
  className="text-purple-700 font-semibold hover:text-purple-900"
>
  View All
</button>
                </div>

                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl px-5 divide-y divide-slate-100">
                {activity.map((item) => (
                   <div
                   key={item.id}
                   className="flex justify-between items-center py-4"
                 >
                   <div>
                     <h4 className="font-semibold text-slate-800 text-sm">
                       {item.browser} {item.device}
                     </h4>
                 
                     <p className="text-slate-400 text-xs">
                       {item.location}
                     </p>
                 
                     <p className="text-slate-300 text-xs">
                       {new Date(item.login_time).toLocaleString()}
                     </p>
                   </div>
                 
                   <span className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold">
                     {item.status}
                   </span>
                 </div>
                  ))}
                </div>
              </div>

              {/* MODERN SECURITY RECOMMENDATION CARD */}
              {!twoFactor && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-3xl p-5 flex gap-4 items-start animate-pulse">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-xl mt-0.5">
                    <Key size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-800 text-sm">
                      Security Recommendation
                    </h4>
                    <p className="text-amber-700/90 text-xs mt-1 leading-relaxed">
                      Enable Two Factor Authentication (2FA) immediately to safeguard global administrator rights.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EMAIL MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Change Email</h2>
            <label className="block text-sm font-medium mb-2">New Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border rounded-xl p-3"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 rounded-xl border"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEmail}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white"
              >
                Update Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 border rounded-xl py-3"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="flex-1 bg-purple-600 text-white rounded-xl py-3"
                >
                  Update
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}
      {/* LOGIN ACTIVITY MODAL */}
{showActivityModal && (
  <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl">

      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-2xl font-bold text-slate-800">
          Login Activity
        </h2>

        <button
          onClick={() => setShowActivityModal(false)}
          className="text-3xl text-slate-400 hover:text-red-500"
        >
          ×
        </button>
      </div>

      <div className="overflow-y-auto max-h-[65vh] p-6 space-y-4">

        {activity.length === 0 ? (
          <p className="text-center text-slate-500">
            No login activity found
          </p>
        ) : (
          activity.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 rounded-2xl p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800">
                    {item.browser} {item.device}
                  </h4>

                  <p className="text-slate-500 text-sm">
                    {item.location}
                  </p>

                  <p className="text-slate-400 text-xs mt-1">
                    {new Date(item.login_time).toLocaleString()}
                  </p>
                </div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {item.status}
                </span>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  </div>
)}
{notification.show && (
  <div
    className={`
      fixed
      top-6
      left-6
      z-[9999]
      min-w-[320px]
      px-5
      py-4
      rounded-2xl
      shadow-2xl
      text-white
      animate-[slideIn_.35s_ease]
      ${
        notification.type === "success"
          ? "bg-emerald-500"
          : "bg-red-500"
      }
    `}
  >
    <div className="flex items-center gap-3">
      <span className="text-lg">
        {notification.type === "success"
          ? "✓"
          : "⚠"}
      </span>

      <span className="font-medium">
        {notification.message}
      </span>
    </div>
  </div>
)}
    </div>
  );

}