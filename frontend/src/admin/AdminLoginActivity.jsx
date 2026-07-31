import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminLoginActivity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch(
        "https://school-website-backend-ixx2.onrender.com/api/admin-settings/login-activity"
      );

      const data = await res.json();

      if (data.success) {
        setLogs(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">

        <Link
          to="/admin/settings"
          className="flex items-center gap-2 mb-6 text-purple-600 font-semibold"
        >
          <ArrowLeft size={18} />
          Back to Settings
        </Link>

        <h1 className="text-3xl font-bold mb-8">
          Login Activity History
        </h1>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">Device</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">IP Address</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Time</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b"
                >
                  <td className="p-4">{log.device}</td>
                  <td className="p-4">{log.location}</td>
                  <td className="p-4">{log.ip_address}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(
                      log.login_time
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}
