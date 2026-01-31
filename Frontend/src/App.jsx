// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./app/components/Login";
import OtpVerify from "./app/components/OtpVerify";
import Register from "./app/components/RegisterPage";
import Profile from "./app/components/Profile";

// add these files from earlier messages
import ProtectedRoute from "./app/components/ProtectedRoute";
import DashboardLayout from "./app/components/DashBoardLayout";
import { AuthProvider } from "./app/help/AuthContext";

// demo pages (you can replace later)
import DashboardHome from "./app/components/DashBoardHome";
import EventsPage from "./app/components/EventsPage";
import ManagePage from "./app/components/ManagePage";
import AdminPage from "./app/components/AdminPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes (your current ones) */}
          <Route path="/" element={<Login />} />
          <Route path="/otp/verify" element={<OtpVerify />} />
          <Route path="/register" element={<Register />} />

          {/* Optional: keep /profile for now */}
          <Route path="/profile" element={<Profile />} />

          {/* Dashboard (protected + layout route) */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "ORGANIZER", "PARTICIPANT"]} />
            }
          >
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="events" element={<EventsPage />} />

              {/* organizer/admin */}
              <Route
                element={<ProtectedRoute allowedRoles={["ADMIN", "ORGANIZER"]} />}
              >
                <Route path="manage" element={<ManagePage />} />
              </Route>

              {/* admin only */}
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="admin" element={<AdminPage />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter> 
    </AuthProvider>
  );
}

