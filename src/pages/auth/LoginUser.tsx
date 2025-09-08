import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";

function LoginUserPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const res = await axios.post(
        "https://full-stack-be-online-store-production.up.railway.app/api/auth/login",
        {
          email,
          password,
        }
      );
      const token = res.data.token;
      const user = res.data.user;

      login(token, user);
      navigate("/products");
    } catch (err) {
      setError("Email atau password salah.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-teal-100 p-4">
      {/* FARSYA STORE Heading and Description */}
      <div className="text-center mb-10 mt-8 md:mt-0">
        <h1 className="text-6xl font-extrabold text-gray-800 drop-shadow-lg animate-fade-in-down">
          FARSYA STORE
        </h1>
        <p className="text-xl text-gray-600 mt-3 max-w-lg mx-auto animate-fade-in-up">
          Pilihan terbaik untuk kebutuhan digital Anda.
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-xl border border-gray-100 transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login User
        </h2>
        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="email"
              placeholder="Email"
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
              placeholder="Password"
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
        <p className="text-center text-base text-gray-600 mt-6">
          Belum punya akun?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-teal-600 hover:underline cursor-pointer font-medium transition-colors duration-200"
          >
            Daftar di sini
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginUserPage;
