import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState({
    title: "",
    budget_limit: 0,
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
    fetchLists();
  }, []);

  const fetchLists = async () => {
    const res = await API.get("/lists");
    setLists(res.data);
  };

  const createList = async () => {
    await API.post("/lists", newList);
    setNewList({ title: "", budget_limit: 0 });
    fetchLists();
  };

  const deleteList = async (id) => {
    await API.delete(`/lists/${id}`);
    fetchLists();
  };

  return (
    <>
      <Navbar />
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-6">Your Grocery Lists</h1>

        <div className="bg-white p-4 shadow rounded mb-6">
          <input
            placeholder="List Title"
            className="border p-2 mr-2"
            value={newList.title}
            onChange={(e) =>
              setNewList({ ...newList, title: e.target.value })
            }
          />
          <input
            placeholder="Budget Limit"
            type="number"
            className="border p-2 mr-2"
            value={newList.budget_limit}
            onChange={(e) =>
              setNewList({ ...newList, budget_limit: e.target.value })
            }
          />
          <button
            onClick={createList}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add List
          </button>
        </div>

        {lists.map((list) => {
          const exceeded =
            list.budget_limit &&
            list.total_estimated_cost > list.budget_limit;

          return (
            <div
              key={list.id}
              className="bg-white p-4 shadow rounded mb-4"
            >
              <Link to={`/list/${list.id}`}>
                <h2 className="font-bold text-lg">{list.title}</h2>
              </Link>

              <p>Total: ₹{list.total_estimated_cost}</p>
              <p>Limit: ₹{list.budget_limit}</p>

              {exceeded && (
                <p className="text-red-600 font-semibold">
                  ⚠ Budget Exceeded!
                </p>
              )}

              <button
                onClick={() => deleteList(list.id)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-2"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Dashboard;