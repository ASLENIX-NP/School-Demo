import { NavLink, useNavigate } from "react-router-dom";

const links = [
  ["/dashboard", "Dashboard", "▦"], ["/students", "Students", "♙"], ["/teachers", "Teachers", "♧"],
  ["/classes", "Classes", "▤"], ["/subjects", "Subjects", "◈"], ["/attendance", "Attendance", "✓"],
  ["/fees", "Fees", "₹"], ["/exams", "Exams", "★"],
];

export default function AdminLayout({ title, subtitle, children }) {
  const navigate = useNavigate();
  return <div className="admin-shell">
    <aside className="sidebar">
      <NavLink to="/dashboard" className="brand"><span>SS</span><div>Smriti <b>School</b><small>ADMIN PORTAL</small></div></NavLink>
      <nav>{links.map(([to, label, icon]) => <NavLink key={to} to={to}><i>{icon}</i>{label}</NavLink>)}</nav>
      <button className="logout" onClick={() => navigate("/")}>↪ Sign out</button>
    </aside>
    <main className="admin-main">
      <header className="topbar"><div><p className="eyebrow">SMRITI SCHOOL • ACADEMIC YEAR 2083</p><h1>{title}</h1>{subtitle && <p className="subtitle">{subtitle}</p>}</div><div className="profile-chip"><span>AS</span><div>Admin Smriti<small>School Administrator</small></div></div></header>
      {children}
    </main>
  </div>;
}

export const PageCard = ({ children, className = "" }) => <section className={`page-card ${className}`}>{children}</section>;
