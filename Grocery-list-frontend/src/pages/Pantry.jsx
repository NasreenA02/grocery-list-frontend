import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Pantry() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    expiry_date: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await API.get("/pantry");
    setItems(res.data);
  };

  const addItem = async () => {
    await API.post("/pantry", newItem);
    setNewItem({ name: "", quantity: 1, expiry_date: "" });
    fetchItems();
  };

  const today = new Date();

  return (
    <>
      <Navbar />
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-6">Pantry</h1>

        <div className="mb-6">
          <input
            placeholder="Item Name"
            className="border p-2 mr-2"
            value={newItem.name}
            onChange={(e) =>
              setNewItem({ ...newItem, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Quantity"
            className="border p-2 mr-2"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: e.target.value })
            }
          />
          <input
            type="date"
            className="border p-2 mr-2"
            value={newItem.expiry_date}
            onChange={(e) =>
              setNewItem({ ...newItem, expiry_date: e.target.value })
            }
          />
          <button
            onClick={addItem}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        {items.map((item) => {
          const expiry = new Date(item.expiry_date);
          const diffDays =
            (expiry - today) / (1000 * 60 * 60 * 24);

          let warningClass = "bg-white";

          if (item.expiry_date) {
            if (diffDays < 0) {
              warningClass = "bg-red-200";
            } else if (diffDays <= 3) {
              warningClass = "bg-yellow-200";
            }
          }

          return (
            <div
              key={item.id}
              className={`p-4 shadow rounded mb-3 ${warningClass}`}
            >
              <div className="font-semibold">{item.name}</div>
              <div>Qty: {item.quantity}</div>
              <div>
                Expiry:{" "}
                {item.expiry_date
                  ? item.expiry_date
                  : "Not Set"}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Pantry;