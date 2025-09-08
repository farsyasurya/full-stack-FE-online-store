import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SaldoPage = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchSaldo = async () => {
      try {
        const res = await axios.get(
          "https://full-stack-be-online-store-production.up.railway.app/api/auth/me/saldo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setBalance(res.data.balance);
        setMessage(res.data.message);
      } catch (err) {
        console.error("Gagal mengambil saldo:", err);
        navigate("/login");
      }
    };

    fetchSaldo();
  }, []);

  if (balance === null)
    return <p className="text-center mt-10">Memuat saldo...</p>;

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-950 text-gray-900 dark:text-gray-50 shadow-2xl rounded-3xl p-10 transform hover:scale-105 transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center mb-6">
        <span className="text-5xl mr-3">💰</span>
        <h2 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400">
          Informasi Saldo Anda
        </h2>
      </div>
      <p className="text-2xl font-semibold mb-4 text-center leading-relaxed">
        {message}
      </p>
      <div className="text-center">
        <p className="text-6xl font-extrabold text-green-600 dark:text-green-400 tracking-tight">
          Rp {balance.toLocaleString("id-ID")}
        </p>
      </div>
      <p className="text-md text-gray-500 dark:text-gray-400 mt-6 text-center">
        Saldo terbaru Anda per hari ini.
      </p>
    </div>
  );
};

export default SaldoPage;
