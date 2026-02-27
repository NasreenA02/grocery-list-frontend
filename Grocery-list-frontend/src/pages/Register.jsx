import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import registerSide from "../assets/register-side.jpg";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-900 text-white">

      {/* LEFT FORM */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-slate-900">

        <div className="bg-slate-800 p-10 rounded-2xl shadow-xl w-full max-w-md">

          <h2 className="text-3xl font-bold mb-6 text-emerald-400 text-center">
            Create Account
          </h2>

          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 mb-4 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-emerald-500"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-emerald-500"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-emerald-500"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            onClick={handleRegister}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-black font-semibold py-3 rounded-lg transition"
          >
            Register
          </button>

          <p className="text-sm text-slate-400 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/" className="text-emerald-400 hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden md:block w-1/2 h-full">
        <img
          src={registerSide}
          alt="Register"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}