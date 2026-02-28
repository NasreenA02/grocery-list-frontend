import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">

      {/* Navbar */}
      <nav className="bg-slate-900 shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-50">
          Listora 🛒
        </h1>

        <div className="space-x-6">
          <Link
            to="/login"
             className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition shadow"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition shadow"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-5xl font-extrabold text-slate-50 mb-6">
          Smarter Grocery Planning
        </h2>

        <p className="text-slate-100 text-lg max-w-2xl mb-8">
          Organize lists. Track spending. Manage your pantry.
          All in one beautifully simple space.
        </p>

        <Link
          to="/register"
          className="bg-emerald-600 text-white px-8 py-3 rounded-xl text-lg shadow-md hover:shadow-xl hover:scale-105 transition"
        >
          Get Started
        </Link>
      </div>

      {/* Features */}
      <div className="py-16 px-8">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-slate-800">
              📋 Smart Lists
            </h3>
            <p className="text-slate-600">
              Keep everything organized and accessible.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-slate-800">
              💰 Budget Tracking
            </h3>
            <p className="text-slate-600">
              Set limits and avoid overspending effortlessly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-slate-800">
              🥫 Pantry Manager
            </h3>
            <p className="text-slate-600">
              Track purchased items and manage expiry dates.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}