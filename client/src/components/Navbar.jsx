// components/Navbar.jsx
// -----------------------------------------------------------------------------
// Top navigation bar for CodePlayground.
// - Displays title
// - Toggles dark mode (handled externally)
// - Provides Sign Out functionality (clears localStorage, redirects to login)
// -----------------------------------------------------------------------------

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  // 🔐 Clears user session and redirects to login
  const handleSignOut = () => {
    localStorage.removeItem("codeplayground-user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className={`flex justify-between items-center px-6 py-4  ${darkMode ? "bg-[#111827] text-white" : "bg-[#e5e7eb] text-black"}`}>
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">CodePlayground</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
