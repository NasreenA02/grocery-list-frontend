import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Grocery from "./pages/Grocery";
import Pantry from "./pages/Pantry";
import Budget from "./pages/Budget";
import PurchaseHistory from "./pages/PurchaseHistory";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/grocery" element={<Grocery />} />
      <Route path="/pantry" element={<Pantry />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/purchases" element={<PurchaseHistory />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}