import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Pantry() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", expiry_date: "" });

  useEffect(() => { fetchPantry(); }, []);

  const fetchPantry = async () => {
    const res = await API.get("/pantry");
    setItems(res.data);
  };

  const addItem = async () => {
    if (!newItem.name) return;
    await API.post("/pantry", newItem);
    setNewItem({ name: "", quantity: "", expiry_date: "" });
    fetchPantry();
  };

  const deleteItem = async (id) => {
    await API.delete(`/pantry/${id}`);
    fetchPantry();
  };

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const today = new Date();
    const expiry = new Date(date);
    return (expiry - today) / (1000 * 60 * 60 * 24) <= 3;
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <Layout>
      <div className="pantry-page">
        <div className="page-header">
          <div>
            <h1>🧺 Pantry</h1>
            <p>Track items at home and watch for expiry dates</p>
          </div>
          <div className="pantry-count">{items.length} items</div>
        </div>

        {/* Add Item */}
        <div className="add-form">
          <input
            type="text"
            placeholder="Item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          />
          <input
            type="date"
            value={newItem.expiry_date}
            onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
          />
          <button onClick={addItem}>+ Add Item</button>
        </div>

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="empty-state">
            <p>🧺</p>
            <p>Your pantry is empty!</p>
          </div>
        ) : (
          <div className="pantry-grid">
            {items.map((item) => {
              const expiring = isExpiringSoon(item.expiry_date);
              const expired = isExpired(item.expiry_date);
              let statusColor = "#a78bfa";
              if (expired) statusColor = "#ef4444";
              else if (expiring) statusColor = "#f59e0b";

              return (
                <div
                  key={item.id}
                  className="pantry-card"
                  style={{ "--status": statusColor }}
                >
                  <div className="card-top">
                    <h3>{item.name}</h3>
                    <button onClick={() => deleteItem(item.id)} className="del-btn">✕</button>
                  </div>

                  {item.quantity && (
                    <p className="card-qty">Qty: {item.quantity}</p>
                  )}

                  {item.expiry_date && (
                    <div className="expiry-badge" style={{ color: statusColor, borderColor: statusColor }}>
                      {expired ? "⛔ Expired" : expiring ? "⚠ Expiring Soon" : "✓ Fresh"}
                      <span className="expiry-date">{item.expiry_date}</span>
                    </div>
                  )}

                  <div className="card-bar" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .pantry-page { max-width: 1000px; }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .page-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.25rem;
        }

        .page-header p { color: #9ca3af; font-size: 0.9rem; }

        .pantry-count {
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #c4b5fd;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .add-form {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          background: rgba(139, 92, 246, 0.07);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          padding: 1.25rem;
          margin-bottom: 1.75rem;
        }

        .add-form input {
          flex: 1;
          min-width: 140px;
          padding: 0.75rem 1rem;
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 10px;
          color: white;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .add-form input:focus { border-color: rgba(139, 92, 246, 0.5); }
        .add-form input::placeholder { color: #6b7280; }

        .add-form button {
          padding: 0.75rem 1.4rem;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .add-form button:hover { opacity: 0.9; }

        .pantry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        .pantry-card {
          background: rgba(139, 92, 246, 0.07);
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 16px;
          padding: 1.25rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s;
        }

        .pantry-card:hover { transform: translateY(-3px); }

        .card-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: var(--status);
          opacity: 0.7;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.6rem;
        }

        .card-top h3 {
          color: white;
          font-size: 1rem;
          font-weight: 700;
        }

        .del-btn {
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 0.8rem;
          transition: color 0.2s;
        }

        .del-btn:hover { color: #f87171; }

        .card-qty { color: #9ca3af; font-size: 0.82rem; margin-bottom: 0.75rem; }

        .expiry-badge {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.35rem 0.6rem;
          border-radius: 8px;
          border: 1px solid;
          background: rgba(0,0,0,0.2);
        }

        .expiry-date { color: #9ca3af; font-weight: 400; }

        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          color: #6b7280;
        }

        .empty-state p:first-child { font-size: 3rem; margin-bottom: 0.75rem; }
      `}</style>
    </Layout>
  );
}