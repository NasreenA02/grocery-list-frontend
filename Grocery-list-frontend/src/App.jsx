import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pantry from "./pages/Pantry";
import ListDetails from "./pages/ListDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pantry" element={<Pantry />} />
      <Route path="/list/:id" element={<ListDetails />} />
    </Routes>
  );
}