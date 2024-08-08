import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          username,
          email,
          password,
        }
      );

      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error: any) {
      if (!error.response) {
        setMessage("No response from the server. Please try again later.");
      } else if (error.response.status === 400) {
        setMessage(
          error.response.data?.message ||
            "Registration failed. Please check your input."
        );
      } else if (error.response.status === 500) {
        setMessage("Server error occurred. Please try again later.");
      } else {
        setMessage(
          error.response.data?.message ||
            "Registration failed due to an unknown error."
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 mt-10">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        <input
          type="text"
          placeholder="Username"
          className="mb-4 p-2 border rounded w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-2 border rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 border rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="bg-blue-500 text-white p-2 rounded w-full mb-2"
        >
          Register
        </button>
        <span>
          Old?{" "}
          <span
            onClick={() => navigate("/login")}
            className="underline text-sm hover:cursor-pointer"
          >
            Login
          </span>
        </span>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
