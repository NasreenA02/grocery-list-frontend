import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="brand">🛒 Listora</div>
        <h2 className="panel-title">Smarter grocery planning starts here.</h2>
        <p className="panel-sub">Track spending, manage your pantry, and stay on budget effortlessly.</p>

        <div className="feature-list">
          {["📋 Smart grocery lists", "💰 Budget tracking", "🧺 Pantry manager", "📊 Spend analytics"].map(f => (
            <div className="feature-item" key={f}>{f}</div>
          ))}
        </div>

        <div className="blob b1" />
        <div className="blob b2" />
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account</p>

          {error && <div className="error-msg">{error}</div>}

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              onKeyDown={handleKeyDown}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              onKeyDown={handleKeyDown}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button className="submit-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <p className="switch-link">
            Don't have an account?{" "}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-page {
          display: flex;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .auth-left {
          flex: 1;
          background: linear-gradient(145deg, #1a0533, #0f0220);
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .auth-left { display: none; }
        }

        .brand {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 3rem;
        }

        .panel-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: white;
          line-height: 1.2;
          margin-bottom: 1rem;
          max-width: 380px;
        }

        .panel-sub {
          color: #9ca3af;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 360px;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .feature-item {
          color: #c4b5fd;
          font-size: 0.95rem;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
          padding: 0.65rem 1rem;
          border-radius: 10px;
          max-width: 280px;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.2;
          pointer-events: none;
        }

        .b1 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, #7c3aed, transparent);
          bottom: -100px; right: -100px;
        }

        .b2 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, #a21caf, transparent);
          top: -50px; right: 50px;
        }

        .auth-right {
          width: 480px;
          background: #0a0118;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .auth-right { width: 100%; }
        }

        .auth-card {
          width: 100%;
          max-width: 380px;
        }

        .auth-title {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.4rem;
        }

        .auth-subtitle {
          color: #9ca3af;
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }

        .error-msg {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
        }

        .field {
          margin-bottom: 1.25rem;
        }

        .field label {
          display: block;
          color: #c4b5fd;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }

        .field input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: rgba(139, 92, 246, 0.07);
          border: 1px solid rgba(139, 92, 246, 0.25);
          border-radius: 10px;
          color: white;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .field input::placeholder { color: #6b7280; }

        .field input:focus {
          border-color: rgba(139, 92, 246, 0.6);
          background: rgba(139, 92, 246, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 0.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.2s ease;
        }

        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #6d28d9, #5b21b6);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
        }

        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .switch-link {
          text-align: center;
          color: #9ca3af;
          font-size: 0.875rem;
        }

        .switch-link a {
          color: #a78bfa;
          text-decoration: none;
          font-weight: 600;
        }

        .switch-link a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}