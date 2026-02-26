import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function ListDetails() {
  const { id } = useParams();

  const [items, setItems] = useState([]);
  const [listInfo, setListInfo] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    category: "",
  });

  useEffect(() => {
    fetchItems();
    fetchListInfo();
  }, [id]);

  const fetchItems = async () => {
    const res = await API.get(`/items/${id}`);
    setItems(res.data);
  };

  const fetchListInfo = async () => {
    const res = await API.get("/lists");
    const current = res.data.find((list) => list.id === id);
    setListInfo(current);
  };

  const updateBudget = async () => {
    const res = await API.get(`/items/${id}`);

    const remaining = res.data.reduce(
      (sum, item) =>
        item.purchased ? sum : sum + Number(item.price),
      0
    );

    await API.put(`/lists/${id}`, {
      total_estimated_cost: remaining,
    });

    fetchListInfo();
  };

  const addItem = async () => {
    await API.post("/items", {
      ...newItem,
      list_id: id,
    });

    setNewItem({ name: "", price: 0, category: "" });
    fetchItems();
    updateBudget();
  };

  const togglePurchased = async (item) => {
    await API.put(`/items/${item.id}`, {
      purchased: !item.purchased,
    });

    fetchItems();
    updateBudget();
  };

  const deleteItem = async (itemId) => {
    await API.delete(`/items/${itemId}`);
    fetchItems();
    updateBudget();
  };

  const totalSpent = items
    .filter((item) => item.purchased)
    .reduce((sum, item) => sum + Number(item.price), 0);

  const remaining = items
    .filter((item) => !item.purchased)
    .reduce((sum, item) => sum + Number(item.price), 0);

  const isExceeded =
    listInfo &&
    listInfo.budget_limit > 0 &&
    remaining > listInfo.budget_limit;

  return (
    <>
      <Navbar />
      <div className="p-10">

        <h2 className="text-2xl font-bold mb-4">Spending Summary</h2>

        <p>Budget Limit: ₹{listInfo?.budget_limit || 0}</p>
        <p>Spent: ₹{totalSpent}</p>
        <p>Remaining: ₹{remaining}</p>

        {isExceeded && (
          <p className="text-red-600 font-bold mt-2">
            ⚠ You have exceeded your budget!
          </p>
        )}

        <div className="mt-6">
          <input
            placeholder="Item Name"
            className="border p-2 mr-2"
            onChange={(e) =>
              setNewItem({ ...newItem, name: e.target.value })
            }
          />
          <input
            placeholder="Category"
            className="border p-2 mr-2"
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
          />
          <input
            placeholder="Price"
            type="number"
            className="border p-2 mr-2"
            onChange={(e) =>
              setNewItem({ ...newItem, price: e.target.value })
            }
          />
          <button
            onClick={addItem}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 mt-4 shadow rounded flex justify-between ${
              item.purchased ? "bg-gray-200 line-through" : "bg-white"
            }`}
          >
            <div>
              <div>{item.name}</div>
              <div className="text-sm text-gray-500">
                {item.category} • ₹{item.price}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => togglePurchased(item)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                {item.purchased ? "Undo" : "Purchased"}
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ListDetails;