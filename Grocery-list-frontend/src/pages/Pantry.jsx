import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Pantry() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    expiry_date: "",
  });

  useEffect(() => {
    fetchPantry();
  }, []);

  const fetchPantry = async () => {
    const res = await API.get("/pantry");
    setItems(res.data);
  };

  const addItem = async () => {
    if (!newItem.name) return;

    await API.post("/pantry", newItem);

    setNewItem({
      name: "",
      quantity: "",
      expiry_date: "",
    });

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
    const diffTime = expiry - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 3;
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-900 text-white p-8">

        <h1 className="text-3xl font-bold mb-8">
          🧺 Your Pantry
        </h1>

        {/* ADD ITEM SECTION */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg mb-10 flex flex-wrap gap-4">

          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) =>
              setNewItem({ ...newItem, name: e.target.value })
            }
            className="p-3 rounded bg-slate-700 border border-slate-600"
          />

          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: e.target.value })
            }
            className="p-3 rounded bg-slate-700 border border-slate-600"
          />

          <input
            type="date"
            value={newItem.expiry_date}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                expiry_date: e.target.value,
              })
            }
            className="p-3 rounded bg-slate-700 border border-slate-600"
          />

          <button
            onClick={addItem}
            className="bg-emerald-500 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition"
          >
            Add
          </button>

        </div>

        {/* PANTRY ITEMS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">
                {item.name}
              </h3>

              {item.quantity && (
                <p className="text-slate-400 text-sm">
                  Quantity: {item.quantity}
                </p>
              )}

              {item.expiry_date && (
                <p
                  className={`text-sm mt-2 ${
                    isExpiringSoon(item.expiry_date)
                      ? "text-red-500"
                      : "text-indigo-400"
                  }`}
                >
                  Expiry: {item.expiry_date}
                </p>
              )}

              {isExpiringSoon(item.expiry_date) && (
                <p className="text-red-500 text-xs mt-1">
                  ⚠ Expiring Soon
                </p>
              )}

              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-400 text-sm mt-4 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-slate-400">
              Pantry is empty.
            </p>
          )}
        </div>

      </div>
    </>
  );
}