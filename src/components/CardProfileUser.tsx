import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: number;
  email: string;
  role: string;
  profile?: string | null;
};

const CardProfileUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "http://localhost:3000/api/auth/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setUser(res.data);
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      }
    };

    fetchUser();
  }, []);

  if (!user) return null;

  return (
    <div className="w-full mb-8 p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl flex items-center gap-6">
      <div>
        <img
          src={
            user.profile
              ? `http://localhost:3000/uploads/${user.profile}`
              : "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
          }
          alt="Foto Profil"
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
        />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">
          👤 Profil Anda
        </h3>
        <div className="text-gray-800 dark:text-gray-200 space-y-1">
          <p>
            <span className="font-semibold">📧 Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">🛡️ Role:</span> {user.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardProfileUser;
