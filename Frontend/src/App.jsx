// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./app/components/Login";
import OtpVerify from "./app/components/OtpVerify";
import Register from "./app/components/RegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/otp/verify" element={<OtpVerify />} />
        <Route path = "/register" element ={<Register/>}/>
      </Routes>
    </BrowserRouter>
  );
}
