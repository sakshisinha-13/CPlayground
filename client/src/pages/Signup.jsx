// src/pages/Signup.jsx
// -----------------------------------------------------------------------------
// Signup page for new CodePlayground users. Handles:
// - Input fields for username, email, password, confirm password
// - Validates input fields
// - Sends signup request to backend
// - Stores user/token in localStorage and redirects to Dashboard on success
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";                  // App logo
import { ToastContainer, toast } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const API = process.env.REACT_APP_API_BASE;

  // 🔐 Redirect if already logged in
  useEffect(() => {
    const existingUser = localStorage.getItem("codeplayground-user");
    if (existingUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // ✅ Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!handleValidation()) return;

    const { username, email, password } = values;

    try {
      const response = await axios.post(
        `${API}/api/auth/signup`,
        { username, email, password },
        {
          validateStatus: function (status) {
            return status >= 200 && status < 300; // ✅ Only treat 2xx as success
          },
        }
      );

      const data = response.data;

      toast.success("Account created successfully!", toastOptions);
      localStorage.setItem("codeplayground-user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      navigate("/dashboard");

    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      toast.error(msg, toastOptions);
      console.error("❌ Signup failed:", msg);

      // Clean up localStorage if any leftover
      localStorage.removeItem("codeplayground-user");
      localStorage.removeItem("token");
    }
  };

  // 🧠 Validation logic
  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username must be at least 3 characters", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password must be at least 8 characters", toastOptions);
      return false;
    } else if (!email) {
      toast.error("Email is required", toastOptions);
      return false;
    }
    return true;
  };

  // 🔄 Handle field changes
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center bg-[#2b2b42]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-black bg-opacity-40 rounded-2xl p-10 w-[90%] max-w-md"
        >
          <div className="flex items-center justify-center gap-4">
            <img src={Logo} alt="Logo" className="h-16" />
            <h1 className="text-white text-2xl font-bold uppercase">CodePlayground</h1>
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="bg-transparent text-white border border-indigo-500 rounded-md p-3 focus:outline-none focus:border-indigo-300"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="bg-transparent text-white border border-indigo-500 rounded-md p-3 focus:outline-none focus:border-indigo-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="bg-transparent text-white border border-indigo-500 rounded-md p-3 focus:outline-none focus:border-indigo-300"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="bg-transparent text-white border border-indigo-500 rounded-md p-3 focus:outline-none focus:border-indigo-300"
          />
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-500 text-white py-3 px-4 rounded-md uppercase font-semibold transition"
          >
            Signup
          </button>
          <span className="text-white text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-bold underline">
              Login
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Signup;
