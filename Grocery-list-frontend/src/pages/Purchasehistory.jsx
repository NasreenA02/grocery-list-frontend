import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function PurchaseHistory() {
  const [listData, setListData] = useState([]);
  const [filterList, setFilterList] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const listsRes = await API.get("/lists");
      const lists = listsRes.data;

      const data = [];
      for (const list of lists) {
        const itemsRes = await API.get(`/items/${list.id}`);
        const purchased = itemsRes.data.filter((i) => i.purchased);
        if (purchased.length > 0) {
          data.push({ list, items: purchased });
        }
      }
      setListData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filterList === "all"
    ? listData
    : listData.filter((d) => d.list.id === filterList);

  const totalSpent = filtered.reduce(
    (s, d) => s + d.items.reduce((ss, i) => ss + Number(i.price || 0), 0),
    0
  );

  return (
    <Layout>
      <div className="purchases-page">
        <div className="page-header">
          <div>
            <h1>📦 Purchase History</h1>
            <p>All items you've marked as purchased</p>
          </div>
          <div className="total-badge">Total: ₹{totalSpent}</div>
        </div>

        {/* Filter */}
        <div className="filter-row">
          <button className={filterList === "all" ? "filter-btn active" : "filter-btn"} onClick={() => setFilterList("all")}>
            All Lists
          </button>
          {listData.map((d) => (
            <button
              key={d.list.id}
              className={filterList === d.list.id ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilterList(d.list.id)}
            >
              {d.list.title}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading purchases...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>📦</p>
            <p>No purchases yet. Mark items as purchased in your grocery lists!</p>
          </div>
        ) : (
          <div className="grouped-purchases">
            {filtered.map((d) => {
              const listTotal = d.items.reduce((s, i) => s + Number(i.price || 0), 0);
              return (
                <div className="group" key={d.list.id}>
                  <div className="group-header">
                    <h2>{d.list.title}</h2>
                    <span className="group-total">₹{listTotal}</span>
                  </div>
                  <div className="purchase-list">
                    {d.items.map((item) => (
                      <div className="purchase-row" key={item.id}>
                        <div className="purchase-info">
                          <span className="purchase-name">{item.name}</span>
                          {item.category && (
                            <span className="purchase-cat">{item.category}</span>
                          )}
                          {item.quantity && (
                            <span className="purchase-qty">x{item.quantity}</span>
                          )}
                        </div>
                        <span className="purchase-price">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .purchases-page { max-width: 800px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .page-header h1 { font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 0.25rem; }
        .page-header p { color: #9ca3af; font-size: 0.9rem; }
        .total-badge { background: linear-gradient(135deg,rgba(124,58,237,0.3),rgba(109,40,217,0.2)); border: 1px solid rgba(139,92,246,0.4); color: #c4b5fd; padding: 0.5rem 1.25rem; border-radius: 999px; font-weight: 700; font-size: 1rem; }
        .filter-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.75rem; }
        .filter-btn { padding: 0.45rem 1rem; border-radius: 999px; font-size: 0.82rem; font-weight: 600; cursor: pointer; border: 1px solid rgba(139,92,246,0.25); background: transparent; color: #9ca3af; transition: all 0.2s; }
        .filter-btn:hover { border-color: rgba(139,92,246,0.5); color: #c4b5fd; }
        .filter-btn.active { background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.5); color: #c4b5fd; }
        .grouped-purchases { display: flex; flex-direction: column; gap: 1.5rem; }
        .group { background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.15); border-radius: 16px; overflow: hidden; }
        .group-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; background: rgba(139,92,246,0.1); border-bottom: 1px solid rgba(139,92,246,0.15); }
        .group-header h2 { color: #e9d5ff; font-size: 1rem; font-weight: 700; }
        .group-total { color: #a78bfa; font-weight: 700; font-size: 1rem; }
        .purchase-list { padding: 0.5rem 0; }
        .purchase-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1.5rem; border-bottom: 1px solid rgba(139,92,246,0.07); transition: background 0.15s; }
        .purchase-row:last-child { border-bottom: none; }
        .purchase-row:hover { background: rgba(139,92,246,0.06); }
        .purchase-info { display: flex; align-items: center; gap: 0.75rem; }
        .purchase-name { color: white; font-size: 0.9rem; font-weight: 500; }
        .purchase-cat { background: rgba(139,92,246,0.15); color: #c4b5fd; font-size: 0.72rem; padding: 0.15rem 0.55rem; border-radius: 999px; }
        .purchase-qty { color: #6b7280; font-size: 0.8rem; }
        .purchase-price { color: #a78bfa; font-weight: 700; font-size: 0.9rem; }
        .loading, .empty-state { text-align: center; padding: 4rem 2rem; color: #6b7280; }
        .empty-state p:first-child { font-size: 2.5rem; margin-bottom: 0.75rem; }
      `}</style>
    </Layout>
  );
}