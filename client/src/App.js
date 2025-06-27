// src/App.js
// -----------------------------------------------------------------------------
// Main application component that handles routing using React Router.
// -----------------------------------------------------------------------------

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // React Router imports
import Dashboard from "./pages/Dashboard";        // Dashboard page after login
import Playground from "./pages/Playground";      // Coding playground page
import Login from "./pages/Login";                // Login page
import Signup from "./pages/Signup";              // Signup page
import ProtectedRoute from "./components/ProtectedRoute"; // Auth guard for protected routes

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes (requires login) */}
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/playground/:id" element={<ProtectedRoute> <Playground /> </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
