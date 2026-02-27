import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import loginSide from "../assets/login-side.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-900 text-white">

      {/* LEFT IMAGE SECTION */}
      <div className="hidden md:block w-1/2 h-full">
        <img
          src={loginSide}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-slate-900">

        <div className="bg-slate-800 p-10 rounded-2xl shadow-xl w-full max-w-md">

          <h2 className="text-3xl font-bold mb-6 text-indigo-400 text-center">
            Welcome Back
          </h2>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-indigo-500"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-indigo-500"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            onClick={handleLogin}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-3 rounded-lg transition"
          >
            Login
          </button>

          <p className="text-sm text-slate-400 mt-6 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:underline">
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}