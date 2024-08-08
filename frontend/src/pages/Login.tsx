import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          username,
          password,
        }
      );

      const { user, token } = response.data;
      setMessage(`Welcome, ${response.data.user.username}`);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error: any) {
      if (!error.response) {
        setMessage("No response from the server. Please try again later.");
      } else if (error.response.status === 404) {
        setMessage("User not found. Please register before logging in.");
      } else if (error.response.status === 400) {
        setMessage(
          "Invalid credentials. Please check your username and password."
        );
      } else {
        setMessage(
          error.response.data?.message ||
            "Login failed due to an unknown error."
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 mt-10">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <input
          type="text"
          placeholder="Username"
          className="mb-4 p-2 border rounded w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 border rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white p-2 rounded w-full mb-3"
        >
          Login
        </button>
        <span>
          New?{" "}
          <span
            onClick={() => navigate("/register")}
            className="underline text-sm hover:cursor-pointer"
          >
            Register
          </span>
        </span>
        {message && <p className="mt-4 text-green-700 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
