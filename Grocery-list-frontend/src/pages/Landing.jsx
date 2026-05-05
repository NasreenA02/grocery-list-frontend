import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-logo">🛒 Listora</div>
        <div className="nav-links">
          <Link to="/login" className="btn-ghost">Sign In</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">✨ Smart Grocery Management</div>
        <h1 className="hero-title">
          Plan Smarter.<br />
          <span className="gradient-text">Spend Better.</span>
        </h1>
        <p className="hero-sub">
          Organize grocery lists, track budgets, manage your pantry,
          and analyze your spending — all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-primary btn-lg">Start for Free →</Link>
          <Link to="/login" className="btn-ghost btn-lg">Sign In</Link>
        </div>

        {/* Glow blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </section>

      {/* Features */}
      <section className="features">
        {[
          { icon: "📋", title: "Smart Lists", desc: "Create and manage multiple grocery lists with ease." },
          { icon: "💰", title: "Budget Tracking", desc: "Set budgets, track spending, and avoid overspending." },
          { icon: "🧺", title: "Pantry Manager", desc: "Track items at home and get expiry alerts." },
          { icon: "📊", title: "Analytics", desc: "Visualize your monthly and weekly spend trends." },
          { icon: "📦", title: "Purchase History", desc: "Review everything you've bought over time." },
          { icon: "⚡", title: "Fast & Simple", desc: "Clean interface built for everyday use." },
        ].map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to take control of your grocery budget?</h2>
        <Link to="/register" className="btn-primary btn-lg">Create Free Account →</Link>
      </section>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing {
          min-height: 100vh;
          background: #0a0118;
          color: white;
          font-family: 'Segoe UI', sans-serif;
          overflow-x: hidden;
        }

        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 4rem;
          border-bottom: 1px solid rgba(139, 92, 246, 0.15);
          position: sticky;
          top: 0;
          background: rgba(10, 1, 24, 0.85);
          backdrop-filter: blur(12px);
          z-index: 50;
        }

        .nav-logo {
          font-size: 1.4rem;
          font-weight: 800;
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-links {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .hero {
          position: relative;
          text-align: center;
          padding: 7rem 2rem 6rem;
          overflow: hidden;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #c4b5fd;
          padding: 0.4rem 1.2rem;
          border-radius: 999px;
          font-size: 0.85rem;
          margin-bottom: 1.75rem;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #a78bfa, #7c3aed, #c026d3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-sub {
          color: #9ca3af;
          font-size: 1.1rem;
          max-width: 520px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          pointer-events: none;
          z-index: -1;
        }

        .blob-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #7c3aed, transparent);
          top: -100px;
          left: -100px;
        }

        .blob-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #a21caf, transparent);
          bottom: -80px;
          right: -80px;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 4rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .feature-card {
          background: rgba(139, 92, 246, 0.07);
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.2s ease;
        }

        .feature-card:hover {
          background: rgba(139, 92, 246, 0.14);
          border-color: rgba(139, 92, 246, 0.35);
          transform: translateY(-3px);
        }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #e9d5ff;
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          color: #9ca3af;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .cta {
          text-align: center;
          padding: 5rem 2rem;
          border-top: 1px solid rgba(139, 92, 246, 0.15);
        }

        .cta h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 2rem;
          color: #e9d5ff;
        }

        .btn-primary {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: white;
          padding: 0.65rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #6d28d9, #5b21b6);
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
        }

        .btn-ghost {
          background: transparent;
          color: #c4b5fd;
          padding: 0.65rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          border: 1px solid rgba(139, 92, 246, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .btn-ghost:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .btn-lg {
          padding: 0.85rem 2rem;
          font-size: 1rem;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}