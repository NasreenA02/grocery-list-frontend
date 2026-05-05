import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Grocery() {
  const [lists, setLists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newList, setNewList] = useState({ title: "", budget_limit: "" });
  const [adding, setAdding] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "" });

  useEffect(() => { fetchLists(); }, []);

  const fetchLists = async () => {
    const res = await API.get("/lists");
    setLists(res.data);
  };

  const addList = async () => {
    if (!newList.title) return;
    setAdding(true);
    // ✅ use budget_limit
    await API.post("/lists", { title: newList.title, budget_limit: newList.budget_limit || 0 });
    setNewList({ title: "", budget_limit: "" });
    setShowForm(false);
    setAdding(false);
    fetchLists();
  };

  const deleteList = async (id) => {
    await API.delete(`/lists/${id}`);
    if (selectedList?.id === id) { setSelectedList(null); setItems([]); }
    fetchLists();
  };

  const selectList = async (list) => {
    setSelectedList(list);
    const res = await API.get(`/items/${list.id}`);
    setItems(res.data);
  };

  const fetchItems = async () => {
    if (!selectedList) return;
    const res = await API.get(`/items/${selectedList.id}`);
    setItems(res.data);
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.price) return;
    await API.post("/items", { ...newItem, list_id: selectedList.id });
    setNewItem({ name: "", price: "", category: "" });
    fetchItems();
    fetchLists();
  };

  const togglePurchased = async (item) => {
    await API.put(`/items/${item.id}`, { ...item, purchased: !item.purchased });
    fetchItems();
    fetchLists();
  };

  const deleteItem = async (itemId) => {
    await API.delete(`/items/${itemId}`);
    fetchItems();
    fetchLists();
  };

  // ✅ calculate spent from items directly
  const spent = items.filter(i => i.purchased).reduce((s, i) => s + Number(i.price), 0);
  const budget = Number(selectedList?.budget_limit || 0); // ✅ budget_limit
  const remaining = budget - spent;
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <Layout>
      <div className="grocery-page">
        <div className="page-header">
          <div>
            <h1>🛒 Grocery Lists</h1>
            <p>Manage your shopping lists and items</p>
          </div>
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancel" : "+ New List"}
          </button>
        </div>

        {showForm && (
          <div className="add-form">
            <h3>Create New List</h3>
            <div className="form-row">
              <input
                type="text"
                placeholder="List name (e.g. Weekly Groceries)"
                value={newList.title}
                onChange={(e) => setNewList({ ...newList, title: e.target.value })}
              />
              <div className="input-with-prefix">
                <span>₹</span>
                <input
                  type="number"
                  placeholder="Budget (optional)"
                  value={newList.budget_limit}
                  onChange={(e) => setNewList({ ...newList, budget_limit: e.target.value })}
                />
              </div>
              <button onClick={addList} disabled={adding}>
                {adding ? "Creating..." : "Create List"}
              </button>
            </div>
          </div>
        )}

        <div className="grocery-layout">
          <div className="lists-panel">
            {lists.length === 0 ? (
              <div className="empty-state">
                <p>🛒</p>
                <p>No lists yet. Create your first one!</p>
              </div>
            ) : (
              lists.map((list) => {
                const b = Number(list.budget_limit || 0); // ✅ budget_limit
                const isSelected = selectedList?.id === list.id;

                return (
                  <div
                    key={list.id}
                    className={`list-card ${isSelected ? "selected" : ""}`}
                    onClick={() => selectList(list)}
                  >
                    <div className="list-card-top">
                      <h3>{list.title}</h3>
                      <button className="del-btn" onClick={(e) => { e.stopPropagation(); deleteList(list.id); }}>🗑</button>
                    </div>
                    {b > 0 && <p className="list-budget">Budget: ₹{b}</p>}
                    {!b && <p className="list-budget">No budget set</p>}
                  </div>
                );
              })
            )}
          </div>

          {selectedList && (
            <div className="items-panel">
              <div className="items-header">
                <h2>{selectedList.title}</h2>
                {budget > 0 && (
                  <div className="budget-info">
                    <span className={remaining < 0 ? "over" : "ok"}>
                      ₹{remaining} remaining of ₹{budget}
                    </span>
                    <div className="budget-bar">
                      <div
                        className="budget-fill"
                        style={{
                          width: `${percentage}%`,
                          background: remaining < 0 ? "#ef4444" : "linear-gradient(90deg,#7c3aed,#a78bfa)"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="add-item-form">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price ₹"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                />
                <button onClick={addItem}>Add</button>
              </div>

              <div className="items-list">
                {items.length === 0 && <p className="empty-items">No items yet. Add your first item above!</p>}
                {items.map((item) => (
                  <div key={item.id} className={`item-row ${item.purchased ? "purchased" : ""}`}>
                    <div className="item-info">
                      <span className={`item-name ${item.purchased ? "striked" : ""}`}>{item.name}</span>
                      <span className="item-price">₹{item.price}</span>
                      {item.category && <span className="item-cat">{item.category}</span>}
                    </div>
                    <div className="item-actions">
                      <button className={item.purchased ? "unpurchase-btn" : "purchase-btn"} onClick={() => togglePurchased(item)}>
                        {item.purchased ? "Undo" : "✓ Bought"}
                      </button>
                      <button className="item-del" onClick={() => deleteItem(item.id)}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .grocery-page { max-width: 1100px; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
        .page-header h1 { font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 0.25rem; }
        .page-header p { color: #9ca3af; font-size: 0.9rem; }
        .add-btn { background: linear-gradient(135deg,#7c3aed,#6d28d9); color: white; border: none; padding: 0.7rem 1.4rem; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
        .add-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .add-form { background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.25); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; animation: slideDown 0.2s ease; }
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        .add-form h3 { color: #e9d5ff; font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }
        .form-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .form-row input, .add-item-form input { padding: 0.75rem 1rem; background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.2); border-radius: 10px; color: white; font-size: 0.9rem; outline: none; flex: 1; min-width: 140px; transition: border-color 0.2s; }
        .form-row input:focus, .add-item-form input:focus { border-color: rgba(139,92,246,0.5); }
        .form-row input::placeholder, .add-item-form input::placeholder { color: #6b7280; }
        .input-with-prefix { display: flex; align-items: center; background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.2); border-radius: 10px; overflow: hidden; flex: 1; min-width: 140px; }
        .input-with-prefix span { padding: 0 0.75rem; color: #a78bfa; font-weight: 600; }
        .input-with-prefix input { border: none !important; border-radius: 0 !important; padding-left: 0 !important; }
        .form-row button, .add-item-form button { padding: 0.75rem 1.5rem; background: linear-gradient(135deg,#7c3aed,#6d28d9); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .form-row button:hover:not(:disabled), .add-item-form button:hover { opacity: 0.9; }
        .grocery-layout { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; align-items: start; }
        @media (max-width: 900px) { .grocery-layout { grid-template-columns: 1fr; } }
        .lists-panel { display: flex; flex-direction: column; gap: 0.75rem; }
        .list-card { background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.15); border-radius: 14px; padding: 1.25rem; cursor: pointer; transition: all 0.2s; }
        .list-card:hover { border-color: rgba(139,92,246,0.4); }
        .list-card.selected { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.5); }
        .list-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .list-card-top h3 { color: white; font-size: 1rem; font-weight: 700; }
        .del-btn { background: transparent; border: none; cursor: pointer; font-size: 0.9rem; opacity: 0.5; transition: opacity 0.2s; }
        .del-btn:hover { opacity: 1; }
        .list-budget { color: #9ca3af; font-size: 0.8rem; }
        .empty-state { text-align: center; padding: 3rem 1rem; color: #6b7280; }
        .empty-state p:first-child { font-size: 2rem; margin-bottom: 0.5rem; }
        .items-panel { background: rgba(139,92,246,0.05); border: 1px solid rgba(139,92,246,0.15); border-radius: 20px; padding: 1.5rem; animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .items-header { margin-bottom: 1.25rem; }
        .items-header h2 { font-size: 1.4rem; font-weight: 800; color: white; margin-bottom: 0.5rem; }
        .budget-info .ok { color: #a78bfa; font-size: 0.85rem; }
        .budget-info .over { color: #f87171; font-size: 0.85rem; }
        .budget-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 999px; overflow: hidden; margin-top: 0.4rem; }
        .budget-fill { height: 100%; border-radius: 999px; }
        .add-item-form { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(139,92,246,0.15); }
        .items-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .item-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; background: rgba(139,92,246,0.07); border: 1px solid rgba(139,92,246,0.12); border-radius: 12px; transition: all 0.2s; }
        .item-row.purchased { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.2); }
        .item-info { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .item-name { color: white; font-weight: 600; font-size: 0.95rem; }
        .item-name.striked { text-decoration: line-through; color: #6b7280; }
        .item-price { color: #a78bfa; font-size: 0.875rem; }
        .item-cat { background: rgba(139,92,246,0.2); color: #c4b5fd; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px; }
        .item-actions { display: flex; gap: 0.5rem; align-items: center; }
        .purchase-btn { background: rgba(139,92,246,0.2); border: 1px solid rgba(139,92,246,0.3); color: #c4b5fd; padding: 0.4rem 0.9rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .purchase-btn:hover { background: rgba(139,92,246,0.35); }
        .unpurchase-btn { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #6ee7b7; padding: 0.4rem 0.9rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
        .item-del { background: transparent; border: none; cursor: pointer; opacity: 0.5; font-size: 0.9rem; transition: opacity 0.2s; }
        .item-del:hover { opacity: 1; }
        .empty-items { color: #6b7280; text-align: center; padding: 2rem; }
      `}</style>
    </Layout>
  );
}