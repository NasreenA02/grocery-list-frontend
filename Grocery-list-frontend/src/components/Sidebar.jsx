import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: "⊞", label: "Dashboard" },
  { to: "/grocery", icon: "🛒", label: "Grocery" },
  { to: "/pantry", icon: "🧺", label: "Pantry" },
  { to: "/budget", icon: "💰", label: "Budget" },
  { to: "/purchases", icon: "📦", label: "Purchase History" },
  { to: "/analytics", icon: "📊", label: "Analytics" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🛒</span>
        <span className="logo-text">Listora</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <span>⎋</span>
        <span>Logout</span>
      </button>

      <style>{`
        .sidebar {
          width: 240px;
          min-height: 100vh;
          background: linear-gradient(180deg, #1a0533 0%, #0f0220 100%);
          display: flex;
          flex-direction: column;
          padding: 2rem 1rem;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          border-right: 1px solid rgba(139, 92, 246, 0.2);
          z-index: 100;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0 0.75rem;
          margin-bottom: 2.5rem;
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          background: rgba(139, 92, 246, 0.15);
          color: #c4b5fd;
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.2));
          color: #a78bfa;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .nav-icon {
          font-size: 1.1rem;
          width: 1.5rem;
          text-align: center;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          color: #f87171;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }
      `}</style>
    </aside>
  );
}