import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Budget() {
  const [lists, setLists] = useState([]);
  const [listSpends, setListSpends] = useState({});
  const [saving, setSaving] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const listsRes = await API.get("/lists");
      const lists = listsRes.data;
      setLists(lists);

      // Calculate spent per list from items
      const spends = {};
      for (const list of lists) {
        const itemsRes = await API.get(`/items/${list.id}`);
        const purchased = itemsRes.data.filter((i) => i.purchased);
        spends[list.id] = purchased.reduce((s, i) => s + Number(i.price || 0), 0);
      }
      setListSpends(spends);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (listId, budgetLimit) => {
    setSaving(listId);
    try {
      // ✅ correct field: budget_limit
      await API.put(`/lists/${listId}`, { budget_limit: Number(budgetLimit) });
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  // ✅ use budget_limit field
  const totalBudget = lists.reduce((s, l) => s + Number(l.budget_limit || 0), 0);
  const totalSpent = Object.values(listSpends).reduce((s, v) => s + v, 0);
  const totalRemaining = totalBudget - totalSpent;
  const weeklyBudget = (totalBudget / 4).toFixed(0);
  const weeklySpent = (totalSpent / 4).toFixed(0);

  return (
    <Layout>
      <div className="budget-page">
        <div className="page-header">
          <h1>💰 Budget</h1>
          <p>Track and manage your grocery budgets</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          {[
            { label: "Total Budget", value: `₹${totalBudget}`, icon: "🎯", color: "#7c3aed" },
            { label: "Total Spent", value: `₹${totalSpent}`, icon: "🧾", color: "#0891b2" },
            { label: "Remaining", value: `₹${totalRemaining}`, icon: totalRemaining < 0 ? "⚠️" : "✅", color: totalRemaining < 0 ? "#dc2626" : "#059669" },
            { label: "Weekly Budget", value: `₹${weeklyBudget}`, icon: "📅", color: "#d97706" },
            { label: "Weekly Spent (est.)", value: `₹${weeklySpent}`, icon: "📊", color: "#7c3aed" },
          ].map((c) => (
            <div className="summary-card" key={c.label} style={{ "--accent": c.color }}>
              <div className="s-icon">{c.icon}</div>
              <div className="s-val">{c.value}</div>
              <div className="s-label">{c.label}</div>
              <div className="s-bar" />
            </div>
          ))}
        </div>

        {/* Overall Progress */}
        <div className="progress-card">
          <div className="progress-card-header">
            <span>Overall Budget Usage</span>
            <span style={{ color: totalRemaining < 0 ? "#f87171" : "#a78bfa" }}>
              {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
            </span>
          </div>
          <div className="main-bar">
            <div
              className="main-fill"
              style={{
                width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%`,
                background: totalRemaining < 0
                  ? "linear-gradient(90deg,#dc2626,#ef4444)"
                  : "linear-gradient(90deg,#7c3aed,#a78bfa)"
              }}
            />
          </div>
          <div className="bar-labels">
            <span>₹{totalSpent} spent</span>
            <span>₹{totalBudget} total</span>
          </div>
        </div>

        {/* Per List Budget */}
        <div className="list-budgets">
          <h2>Per List Budgets</h2>
          {loading && <p className="empty">Loading...</p>}
          {!loading && lists.length === 0 && (
            <p className="empty">No lists found. Create grocery lists first.</p>
          )}
          {lists.map((list) => {
            const budget = Number(list.budget_limit || 0); // ✅ budget_limit
            const spent = listSpends[list.id] || 0;
            const remaining = budget - spent;
            const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

            return (
              <div className="list-budget-row" key={list.id}>
                <div className="lbr-info">
                  <h3>{list.title}</h3>
                  <div className="lbr-bar">
                    <div
                      className="lbr-fill"
                      style={{
                        width: `${pct}%`,
                        background: remaining < 0 ? "#ef4444" : "linear-gradient(90deg,#7c3aed,#a78bfa)"
                      }}
                    />
                  </div>
                  <div className="lbr-nums">
                    <span>₹{spent} spent</span>
                    <span className={remaining < 0 ? "over" : "ok"}>
                      {remaining < 0 ? `₹${Math.abs(remaining)} over` : `₹${remaining} left`}
                    </span>
                  </div>
                </div>

                <div className="lbr-edit">
                  <BudgetInput
                    defaultValue={budget}
                    onSave={(val) => updateBudget(list.id, val)}
                    saving={saving === list.id}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .budget-page { max-width: 960px; }
        .page-header { margin-bottom: 1.75rem; }
        .page-header h1 { font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 0.25rem; }
        .page-header p { color: #9ca3af; font-size: 0.9rem; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 1rem; margin-bottom: 1.75rem; }
        .summary-card { background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.15); border-radius: 14px; padding: 1.25rem; position: relative; overflow: hidden; transition: transform 0.2s; }
        .summary-card:hover { transform: translateY(-3px); }
        .s-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--accent); }
        .s-icon { font-size: 1.5rem; margin-bottom: 0.6rem; }
        .s-val { font-size: 1.5rem; font-weight: 800; color: white; margin-bottom: 0.2rem; }
        .s-label { color: #9ca3af; font-size: 0.8rem; }
        .progress-card { background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.15); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.75rem; }
        .progress-card-header { display: flex; justify-content: space-between; color: #c4b5fd; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; }
        .main-bar { height: 12px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; margin-bottom: 0.5rem; }
        .main-fill { height: 100%; border-radius: 999px; transition: width 0.5s ease; }
        .bar-labels { display: flex; justify-content: space-between; color: #6b7280; font-size: 0.8rem; }
        .list-budgets h2 { font-size: 1.2rem; font-weight: 700; color: white; margin-bottom: 1rem; }
        .list-budget-row { display: flex; justify-content: space-between; align-items: center; gap: 2rem; background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.15); border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
        .lbr-info { flex: 1; min-width: 200px; }
        .lbr-info h3 { color: white; font-weight: 700; font-size: 1rem; margin-bottom: 0.6rem; }
        .lbr-bar { height: 6px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; margin-bottom: 0.4rem; }
        .lbr-fill { height: 100%; border-radius: 999px; transition: width 0.4s; }
        .lbr-nums { display: flex; justify-content: space-between; font-size: 0.8rem; color: #9ca3af; }
        .lbr-nums .ok { color: #a78bfa; }
        .lbr-nums .over { color: #f87171; }
        .lbr-edit { min-width: 200px; }
        .empty { color: #6b7280; padding: 2rem 0; }
      `}</style>
    </Layout>
  );
}

function BudgetInput({ defaultValue, onSave, saving }) {
  const [val, setVal] = useState(defaultValue);

  useEffect(() => { setVal(defaultValue); }, [defaultValue]);

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        style={{ flex: 1, padding: "0.6rem 0.75rem", background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "8px", color: "white", fontSize: "0.875rem", outline: "none", minWidth: 0 }}
      />
      <button
        onClick={() => onSave(val)}
        disabled={saving}
        style={{ padding: "0.6rem 1rem", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", border: "none", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, whiteSpace: "nowrap" }}
      >
        {saving ? "..." : "Save"}
      </button>
    </div>
  );
}