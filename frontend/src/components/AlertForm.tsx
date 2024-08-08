import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AlertForm: React.FC = () => {
  const [currency, setCurrency] = useState("bitcoin");
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setMessage("Login first to set a alert!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/alerts`, {
        userId,
        currency,
        targetPrice,
        direction,
      });
      alert("Alert created successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Failed to create alert:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-4 rounded shadow"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Cryptocurrency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="litecoin">Litecoin</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Target Price</label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Direction</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as "above" | "below")}
            className="w-full p-2 border rounded"
          >
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Set Alert
        </button>
      </form>
      {message && <span className="text-red-700 mt-5 text-lg">{message}</span>}
    </div>
  );
};

export default AlertForm;
