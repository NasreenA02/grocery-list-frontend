import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
    fetchLists();
  }, []);

  const fetchLists = async () => {
    const res = await API.get("/lists");
    setLists(res.data);
  };

  const addList = async () => {
    if (!newListTitle) return;
    await API.post("/lists", { title: newListTitle });
    setNewListTitle("");
    fetchLists();
  };

  const deleteList = async (id) => {
    await API.delete(`/lists/${id}`);
    fetchLists();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-900 text-white p-8">

        {/* Add List */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg mb-10 flex gap-4">
          <input
            type="text"
            placeholder="New List Title"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            className="flex-1 p-3 rounded bg-slate-700 border border-slate-600"
          />
          <button
            onClick={addList}
            className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-lg font-semibold"
          >
            Add List
          </button>
        </div>

        {/* Lists */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => {
            const spent = Number(list.total_spent || 0);
            const estimated = Number(list.total_estimated_cost || 0);
            const exceeded = spent > estimated;

            return (
              <div
                key={list.id}
                className="bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300"
              >
                <Link to={`/list/${list.id}`}>
                  <h3 className="text-xl font-semibold mb-3">
                    {list.title}
                  </h3>
                </Link>

                <p className="text-slate-400 text-sm">
                  Estimated: ₹{estimated}
                </p>

                <p
                  className={`text-sm mt-1 ${
                    exceeded ? "text-red-500" : "text-emerald-400"
                  }`}
                >
                  Spent: ₹{spent}
                </p>

                {exceeded && (
                  <p className="text-red-500 text-xs mt-2">
                    ⚠ Budget exceeded
                  </p>
                )}

                <button
                  onClick={() => deleteList(list.id)}
                  className="text-red-400 text-sm mt-4 hover:text-red-600"
                >
                  Delete List
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}