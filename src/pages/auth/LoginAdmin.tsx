import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { FaLock, FaUserShield } from "react-icons/fa";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setError("");

      const res = await axios.post(
        "http://localhost:3000/api/auth/login/admin",
        { email, password },
        { withCredentials: true }
      );

      const token = res.data.token;
      const admin = res.data.admin;

      login(token, admin);

      navigate("/products");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-teal-100 p-4">
      {/* Admin Panel Heading and Description */}
      <div className="text-center mb-10 mt-8 md:mt-0">
        <h1 className="text-6xl font-extrabold text-gray-800 drop-shadow-lg animate-fade-in-down">
          ADMIN PANEL
        </h1>
        <p className="text-xl text-gray-600 mt-3 max-w-lg mx-auto animate-fade-in-up">
          Manajemen kontrol penuh untuk FARSYA STORE Anda.
        </p>
      </div>

      {/* Admin Login Card */}
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-xl border border-gray-100 transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login Admin
        </h2>
        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUserShield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="email"
              placeholder="Email Admin"
              value={email}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-teal-400 transition-all duration-200 text-gray-800 placeholder-gray-500"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="password"
              placeholder="Password Admin"
              value={password}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-teal-400 transition-all duration-200 text-gray-800 placeholder-gray-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 transition-colors duration-300 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
