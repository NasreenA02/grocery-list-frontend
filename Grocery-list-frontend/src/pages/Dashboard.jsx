import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [stats, setStats] = useState({
    totalLists: 0,
    totalPantry: 0,
    totalBudget: 0,
    remainingBudget: 0,
    totalSpent: 0,
  });
  const [newMonthlyBudget, setNewMonthlyBudget] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserEmail(payload.email || "");
        } catch {}
      }

      const listsRes = await API.get("/lists");
      const lists = listsRes.data;

      const pantryRes = await API.get("/pantry");
      const pantry = pantryRes.data;

      // ✅ correct field: budget_limit
      const totalBudget = lists.reduce((s, l) => s + Number(l.budget_limit || 0), 0);

      // ✅ calculate spent from purchased items
      let totalSpent = 0;
      for (const list of lists) {
        const itemsRes = await API.get(`/items/${list.id}`);
        const purchased = itemsRes.data.filter((i) => i.purchased);
        totalSpent += purchased.reduce((s, i) => s + Number(i.price || 0), 0);
      }

      setStats({
        totalLists: lists.length,
        totalPantry: pantry.length,
        totalBudget,
        remainingBudget: totalBudget - totalSpent,
        totalSpent,
      });

      setNewMonthlyBudget(totalBudget);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBudget = async () => {
    if (!newMonthlyBudget) return;
    setSaving(true);
    try {
      const listsRes = await API.get("/lists");
      const lists = listsRes.data;
      const perList = lists.length > 0
        ? Math.floor(newMonthlyBudget / lists.length)
        : newMonthlyBudget;
      for (const list of lists) {
        await API.put(`/lists/${list.id}`, { budget_limit: Number(perList) });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const displayName = userEmail ? userEmail.split("@")[0] : "there";

  const statCards = [
    { label: "Total Lists", value: stats.totalLists, icon: "📋", color: "#7c3aed" },
    { label: "Pantry Items", value: stats.totalPantry, icon: "🧺", color: "#0891b2" },
    { label: "Total Budget", value: `₹${stats.totalBudget}`, icon: "💰", color: "#059669" },
    {
      label: "Remaining Budget",
      value: `₹${stats.remainingBudget}`,
      icon: stats.remainingBudget < 0 ? "⚠️" : "✅",
      color: stats.remainingBudget < 0 ? "#dc2626" : "#7c3aed",
    },
  ];

  return (
    <Layout>
      <div className="dashboard">
        <div className="greeting">
          <p className="greeting-sub">{getGreeting()},</p>
          <h1 className="greeting-name">{displayName} 👋</h1>
          <p className="greeting-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>

        <div className="stat-grid">
          {statCards.map((c) => (
            <div className="stat-card" key={c.label} style={{ "--accent": c.color }}>
              <div className="stat-icon">{c.icon}</div>
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label}</div>
              <div className="stat-bar" />
            </div>
          ))}
        </div>

        <div className="budget-card">
          <div className="budget-card-header">
            <h2>💰 Monthly Budget</h2>
            <p>Set and track your overall monthly grocery budget</p>
          </div>
          <div className="budget-body">
            <div className="budget-progress-section">
              <div className="budget-nums">
                <span>₹{stats.totalSpent} spent</span>
                <span>₹{stats.totalBudget} budget</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(stats.totalBudget > 0 ? (stats.totalSpent / stats.totalBudget) * 100 : 0, 100)}%`,
                    background: stats.remainingBudget < 0
                      ? "linear-gradient(90deg, #dc2626, #ef4444)"
                      : "linear-gradient(90deg, #7c3aed, #a78bfa)",
                  }}
                />
              </div>
              {stats.remainingBudget < 0 && (
                <p className="over-budget">⚠ Exceeded by ₹{Math.abs(stats.remainingBudget)}</p>
              )}
            </div>

            <div className="budget-update">
              <label>Update Monthly Budget</label>
              <div className="budget-input-row">
                <span className="rupee">₹</span>
                <input
                  type="number"
                  value={newMonthlyBudget}
                  onChange={(e) => setNewMonthlyBudget(Number(e.target.value))}
                  placeholder="Enter amount"
                />
                <button onClick={handleSaveBudget} disabled={saving}>
                  {saved ? "✓ Saved!" : saving ? "Saving..." : "Update"}
                </button>
              </div>
              <p className="budget-hint">Distributes equally across all your lists</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard { max-width: 1000px; }
        .greeting { margin-bottom: 2rem; }
        .greeting-sub { color: #9ca3af; font-size: 1rem; margin-bottom: 0.25rem; }
        .greeting-name { font-size: 2.5rem; font-weight: 900; color: white; letter-spacing: -1px; margin-bottom: 0.25rem; text-transform: capitalize; }
        .greeting-date { color: #6b7280; font-size: 0.875rem; }
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
        .stat-card { background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.15); border-radius: 16px; padding: 1.5rem; position: relative; overflow: hidden; transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-3px); }
        .stat-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--accent); opacity: 0.6; }
        .stat-icon { font-size: 1.75rem; margin-bottom: 0.75rem; }
        .stat-value { font-size: 1.75rem; font-weight: 800; color: white; margin-bottom: 0.25rem; }
        .stat-label { color: #9ca3af; font-size: 0.85rem; }
        .budget-card { background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.15); border-radius: 20px; overflow: hidden; }
        .budget-card-header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(139,92,246,0.15); }
        .budget-card-header h2 { font-size: 1.2rem; font-weight: 700; color: white; margin-bottom: 0.25rem; }
        .budget-card-header p { color: #9ca3af; font-size: 0.875rem; }
        .budget-body { padding: 1.5rem 2rem; display: flex; gap: 3rem; flex-wrap: wrap; }
        .budget-progress-section { flex: 1; min-width: 200px; }
        .budget-nums { display: flex; justify-content: space-between; color: #c4b5fd; font-size: 0.875rem; margin-bottom: 0.5rem; }
        .progress-bar { width: 100%; height: 10px; background: rgba(255,255,255,0.1); border-radius: 999px; overflow: hidden; margin-bottom: 0.5rem; }
        .progress-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
        .over-budget { color: #f87171; font-size: 0.8rem; margin-top: 0.5rem; }
        .budget-update { flex: 1; min-width: 200px; }
        .budget-update label { display: block; color: #c4b5fd; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.6rem; }
        .budget-input-row { display: flex; align-items: center; background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.25); border-radius: 10px; overflow: hidden; margin-bottom: 0.5rem; }
        .rupee { padding: 0 0.75rem; color: #a78bfa; font-weight: 600; }
        .budget-input-row input { flex: 1; padding: 0.8rem 0.5rem; background: transparent; border: none; color: white; font-size: 0.95rem; outline: none; }
        .budget-input-row button { padding: 0.8rem 1.25rem; background: linear-gradient(135deg,#7c3aed,#6d28d9); color: white; border: none; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .budget-input-row button:hover:not(:disabled) { background: linear-gradient(135deg,#6d28d9,#5b21b6); }
        .budget-input-row button:disabled { opacity: 0.6; cursor: not-allowed; }
        .budget-hint { color: #6b7280; font-size: 0.75rem; }
      `}</style>
    </Layout>
  );
}