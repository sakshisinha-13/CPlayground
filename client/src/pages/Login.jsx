// src/pages/Login.jsx
// -----------------------------------------------------------------------------
// Login page for CodePlayground users. Handles:
// - Email/password input and validation
// - Login API call
// - Storing user & token in localStorage
// - Redirecting to Dashboard on success
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";                   // App logo
import { ToastContainer, toast } from "react-toastify";  // Notifications
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // 🔐 Auto-redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("codeplayground-user")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // 🚀 Handle login form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, password } = values;
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_BASE}/api/auth/login`,
          { email, password }
        );

        localStorage.setItem("codeplayground-user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed", toastOptions);
      }
    }
  };

  // 🧠 Validate form fields
  const handleValidation = () => {
    const { email, password } = values;
    if (!email) {
      toast.error("Email is required.", toastOptions);
      return false;
    } else if (!password) {
      toast.error("Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  // 🔄 Handle input field changes
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
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-500 text-white py-3 px-4 rounded-md uppercase font-semibold transition"
          >
            Login
          </button>
          <span className="text-white text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-400 font-bold underline">
              Signup
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
