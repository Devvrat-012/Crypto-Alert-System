import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import HomePage from "./pages/HomePage.tsx";
import AlertsPage from "./pages/AlertsPage.tsx";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import GetAlert from "./components/GetAlert.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/alerts" element={<AlertsPage />} />
          </Routes>
        </div>
        <GetAlert />
      </div>
    </Router>
  );
};

export default App;
