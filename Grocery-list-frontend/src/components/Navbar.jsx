import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-green-600 text-white p-4 flex justify-between">
      <div className="flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/pantry">Pantry</Link>
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}