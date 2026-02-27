import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function ListDetails() {
  const { id } = useParams();

  const [items, setItems] = useState([]);
  const [listInfo, setListInfo] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
  });

  const [budget, setBudget] = useState(0);

  useEffect(() => {
    fetchList();
    fetchItems();
  }, []);

  const fetchList = async () => {
    const res = await API.get(`/lists/${id}`);
    setListInfo(res.data);
    setBudget(res.data.budget || 0);
  };

  const fetchItems = async () => {
    const res = await API.get(`/items/${id}`);
    setItems(res.data);
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.price) return;

    await API.post("/items", {
      ...newItem,
      list_id: id,
    });

    setNewItem({ name: "", price: "", category: "" });
    fetchItems();
    fetchList();
  };

  const togglePurchased = async (item) => {
    await API.put(`/items/${item.id}`, {
      ...item,
      purchased: !item.purchased,
    });

    fetchItems();
    fetchList();
  };

  const deleteItem = async (itemId) => {
    await API.delete(`/items/${itemId}`);
    fetchItems();
    fetchList();
  };

  const updateBudget = async () => {
    await API.put(`/lists/${id}`, { budget });
    fetchList();
  };

  const spent = items
    .filter((i) => i.purchased)
    .reduce((sum, i) => sum + Number(i.price), 0);

  const remaining = budget - spent;

  const percentage =
    budget > 0
      ? Math.min((spent / budget) * 100, 100)
      : 0;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-900 text-white p-8">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-8">
          {listInfo?.title}
        </h1>

        {/* BUDGET SECTION */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">

          <div className="flex gap-4 items-center mb-4">
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="p-3 rounded bg-slate-700 border border-slate-600"
              placeholder="Set Budget"
            />

            <button
              onClick={updateBudget}
              className="bg-indigo-500 px-5 py-3 rounded-lg font-semibold"
            >
              Save Budget
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div>
              <p className="text-slate-400 text-sm">Spent</p>
              <p className="text-2xl font-bold text-emerald-400">
                ₹{spent}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Remaining</p>
              <p
                className={`text-2xl font-bold ${
                  remaining < 0
                    ? "text-red-500"
                    : "text-indigo-400"
                }`}
              >
                ₹{remaining}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">Progress</p>

              <div className="w-full bg-slate-700 h-3 rounded-full mt-2">
                <div
                  className={`h-3 rounded-full ${
                    remaining < 0
                      ? "bg-red-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              {remaining < 0 && (
                <p className="text-red-500 text-xs mt-2">
                  ⚠ Budget exceeded
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ADD ITEM */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg mb-8 flex flex-wrap gap-4">

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
            placeholder="Price"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: e.target.value })
            }
            className="p-3 rounded bg-slate-700 border border-slate-600"
          />

          <input
            type="text"
            placeholder="Category"
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            className="p-3 rounded bg-slate-700 border border-slate-600"
          />

          <button
            onClick={addItem}
            className="bg-emerald-500 px-6 py-3 rounded-lg font-semibold"
          >
            Add Item
          </button>

        </div>

        {/* ITEMS LIST */}
        <div className="space-y-4">

          {items.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl shadow-lg flex justify-between items-center ${
                item.purchased
                  ? "bg-emerald-900"
                  : "bg-slate-800"
              }`}
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>

                <p className="text-slate-400 text-sm">
                  ₹{item.price}
                </p>

                {item.category && (
                  <span className="text-xs bg-indigo-600 px-3 py-1 rounded-full mt-2 inline-block">
                    {item.category}
                  </span>
                )}
              </div>

              <div className="flex gap-4">

                <button
                  onClick={() => togglePurchased(item)}
                  className="text-sm text-emerald-400"
                >
                  {item.purchased
                    ? "Unmark"
                    : "Purchased"}
                </button>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-sm text-red-400"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>
    </>
  );
}