import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/Login.jsx";
import "./index.css";
import EmployeeList from "./Screens/EmployeeList.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Signup from "./Screens/Signup.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <EmployeeList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </StrictMode>
);
