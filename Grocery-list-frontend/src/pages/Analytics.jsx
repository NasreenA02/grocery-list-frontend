import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Analytics() {
  const [lists, setLists] = useState([]);
  const [listData, setListData] = useState([]); // [{list, items, spent}]
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const listsRes = await API.get("/lists");
      const lists = listsRes.data;
      setLists(lists);

      const data = [];
      for (const list of lists) {
        const itemsRes = await API.get(`/items/${list.id}`);
        const items = itemsRes.data;
        const spent = items
          .filter((i) => i.purchased)
          .reduce((s, i) => s + Number(i.price || 0), 0);
        data.push({ list, items, spent });
      }
      setListData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const allPurchased = listData.flatMap((d) =>
    d.items.filter((i) => i.purchased).map((i) => ({ ...i, listTitle: d.list.title }))
  );

  const totalSpent = listData.reduce((s, d) => s + d.spent, 0);
  const totalBudget = lists.reduce((s, l) => s + Number(l.budget_limit || 0), 0); // ✅ budget_limit
  const prevMonthSpend = Math.round(totalSpent * 0.8);
  const trend = totalSpent - prevMonthSpend;
  const trendPct = prevMonthSpend > 0 ? Math.round((trend / prevMonthSpend) * 100) : 0;

  // Category breakdown
  const categories = allPurchased.reduce((acc, item) => {
    const cat = item.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += Number(item.price);
    return acc;
  }, {});
  const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const maxCat = sortedCats[0]?.[1] || 1;

  // Recent 5 purchases
  const recent = [...allPurchased].reverse().slice(0, 5);

  // Per list for chart ✅ using budget_limit
  const listSpends = listData.map((d) => ({
    name: d.list.title,
    spent: d.spent,
    budget: Number(d.list.budget_limit || 0),
  }));
  const maxVal = Math.max(...listSpends.map((l) => Math.max(l.spent, l.budget)), 1);

  return (
    <Layout>
      <div className="analytics-page">
        <div className="page-header">
          <h1>📊 Analytics</h1>
          <p>Insights into your grocery spending</p>
        </div>

        {loading ? (
          <div className="loading">Loading analytics...</div>
        ) : (
          <>
            {/* Month Comparison */}
            <div className="month-grid">
              <div className="month-card">
                <div className="month-label">Current Month</div>
                <div className="month-value">₹{totalSpent}</div>
                <div className="month-sub">of ₹{totalBudget} budget</div>
                <div className="month-bar">
                  <div className="month-fill" style={{ width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }} />
                </div>
              </div>

              <div className="month-card">
                <div className="month-label">Previous Month</div>
                <div className="month-value" style={{ color: "#9ca3af" }}>₹{prevMonthSpend}</div>
                <div className="month-sub">estimated</div>
                <div className="month-bar">
                  <div className="month-fill prev-fill" style={{ width: `${totalBudget > 0 ? Math.min((prevMonthSpend / totalBudget) * 100, 100) : 0}%` }} />
                </div>
              </div>

              <div className="month-card">
                <div className="month-label">Month-over-Month</div>
                <div className={`trend-value ${trend > 0 ? "up" : "down"}`}>
                  {trend > 0 ? "↑" : "↓"} {Math.abs(trendPct)}%
                </div>
                <div className="month-sub">
                  {trend > 0 ? `₹${trend} more than last month` : `₹${Math.abs(trend)} less than last month`}
                </div>
              </div>
            </div>

            {/* Bar Chart per list */}
            {listSpends.length > 0 && (
              <div className="chart-card">
                <h2>Spend per List</h2>
                {listSpends.every(l => l.spent === 0 && l.budget === 0) ? (
                  <p className="empty">No spending data yet. Start purchasing items!</p>
                ) : (
                  <>
                    <div className="bar-chart">
                      {listSpends.map((l) => (
                        <div className="bar-group" key={l.name}>
                          <div className="bars">
                            <div className="bar-wrap" title={`Budget: ₹${l.budget}`}>
                              <div className="bar budget-bar-el" style={{ height: `${Math.max((l.budget / maxVal) * 160, l.budget > 0 ? 8 : 0)}px` }} />
                            </div>
                            <div className="bar-wrap" title={`Spent: ₹${l.spent}`}>
                              <div
                                className="bar spent-bar-el"
                                style={{
                                  height: `${Math.max((l.spent / maxVal) * 160, l.spent > 0 ? 8 : 0)}px`,
                                  background: l.spent > l.budget && l.budget > 0 ? "#ef4444" : "linear-gradient(180deg,#a78bfa,#7c3aed)"
                                }}
                              />
                            </div>
                          </div>
                          <div className="bar-label">{l.name.length > 10 ? l.name.slice(0, 10) + "…" : l.name}</div>
                          <div className="bar-amounts">
                            <span style={{ color: "#6b7280", fontSize: "0.7rem" }}>₹{l.spent}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="chart-legend">
                      <span className="leg-budget">■ Budget</span>
                      <span className="leg-spent">■ Spent</span>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="bottom-grid">
              {/* Category Breakdown */}
              <div className="cat-card">
                <h2>Category Breakdown</h2>
                {sortedCats.length === 0 ? (
                  <p className="empty">No purchased items yet.</p>
                ) : (
                  <div className="cat-list">
                    {sortedCats.map(([cat, amt]) => (
                      <div className="cat-row" key={cat}>
                        <div className="cat-info">
                          <span className="cat-name">{cat || "Uncategorized"}</span>
                          <span className="cat-amt">₹{amt}</span>
                        </div>
                        <div className="cat-bar">
                          <div className="cat-fill" style={{ width: `${(amt / maxCat) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Purchases */}
              <div className="recent-card">
                <h2>Recent Purchases</h2>
                {recent.length === 0 ? (
                  <p className="empty">No purchases yet.</p>
                ) : (
                  <div className="recent-list">
                    {recent.map((item) => (
                      <div className="recent-row" key={item.id}>
                        <div>
                          <div className="recent-name">{item.name}</div>
                          <div className="recent-list-name">{item.listTitle}</div>
                        </div>
                        <div className="recent-price">₹{item.price}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .analytics-page { max-width: 1000px; }
        .page-header { margin-bottom: 1.75rem; }
        .page-header h1 { font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 0.25rem; }
        .page-header p { color: #9ca3af; font-size: 0.9rem; }
        .month-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.75rem; }
        .month-card { background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.15); border-radius: 16px; padding: 1.5rem; }
        .month-label { color: #9ca3af; font-size: 0.82rem; margin-bottom: 0.5rem; }
        .month-value { font-size: 2rem; font-weight: 800; color: #c4b5fd; margin-bottom: 0.25rem; }
        .month-sub { color: #6b7280; font-size: 0.8rem; margin-bottom: 0.75rem; }
        .month-bar { height: 6px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; }
        .month-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#7c3aed,#a78bfa); transition: width 0.5s ease; }
        .prev-fill { background: linear-gradient(90deg,#4b5563,#9ca3af) !important; }
        .trend-value { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.25rem; }
        .trend-value.up { color: #f87171; }
        .trend-value.down { color: #34d399; }
        .chart-card { background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.15); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.75rem; }
        .chart-card h2 { color: white; font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; }
        .bar-chart { display: flex; align-items: flex-end; gap: 2rem; height: 200px; padding-bottom: 0.5rem; overflow-x: auto; padding-top: 1rem; }
        .bar-group { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; min-width: 70px; }
        .bars { display: flex; align-items: flex-end; gap: 4px; height: 160px; }
        .bar-wrap { display: flex; align-items: flex-end; }
        .bar { width: 22px; border-radius: 6px 6px 0 0; transition: height 0.4s ease; min-height: 0; }
        .budget-bar-el { background: rgba(139,92,246,0.25); border: 1px solid rgba(139,92,246,0.4); }
        .spent-bar-el { background: linear-gradient(180deg,#a78bfa,#7c3aed); }
        .bar-label { color: #9ca3af; font-size: 0.72rem; text-align: center; }
        .bar-amounts { font-size: 0.7rem; color: #6b7280; }
        .chart-legend { display: flex; gap: 1.5rem; margin-top: 1rem; font-size: 0.8rem; }
        .leg-budget { color: #a78bfa; opacity: 0.6; }
        .leg-spent { color: #a78bfa; }
        .bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        @media (max-width: 700px) { .bottom-grid { grid-template-columns: 1fr; } }
        .cat-card, .recent-card { background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.15); border-radius: 16px; padding: 1.5rem; }
        .cat-card h2, .recent-card h2 { color: white; font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem; }
        .cat-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .cat-info { display: flex; justify-content: space-between; margin-bottom: 0.3rem; }
        .cat-name { color: #e9d5ff; font-size: 0.875rem; font-weight: 500; }
        .cat-amt { color: #a78bfa; font-size: 0.875rem; font-weight: 700; }
        .cat-bar { height: 5px; background: rgba(255,255,255,0.07); border-radius: 999px; overflow: hidden; }
        .cat-fill { height: 100%; background: linear-gradient(90deg,#7c3aed,#a78bfa); border-radius: 999px; transition: width 0.4s; }
        .recent-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .recent-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(139,92,246,0.07); border-radius: 10px; }
        .recent-name { color: white; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.15rem; }
        .recent-list-name { color: #6b7280; font-size: 0.75rem; }
        .recent-price { color: #a78bfa; font-weight: 700; font-size: 0.9rem; }
        .empty { color: #6b7280; font-size: 0.875rem; padding: 1rem 0; }
        .loading { text-align: center; padding: 4rem; color: #6b7280; }
      `}</style>
    </Layout>
  );
}