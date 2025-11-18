
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import AdminApp from "./AdminApp.tsx";
import "./styles/globals.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
  