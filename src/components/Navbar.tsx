import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSignOutAlt, FaStore, FaMoneyBill } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin logout?",
      text: "Akun Anda akan keluar dari sesi ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      Swal.fire("Logout berhasil", "Sampai jumpa lagi!", "success");
      navigate("/login");
    }
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold hover:opacity-90 flex">
        <img
          className="w-14 h-auto mr-3"
          src="https://iili.io/KBFUkhv.md.png"
          alt=""
        />{" "}
        FAR STORE
      </Link>

      <div className="flex items-center gap-4 text-sm font-medium">
        {!user && (
          <>
            <Link
              to="/login"
              className="hover:underline transition duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:underline transition duration-200"
            >
              Register
            </Link>
            <Link
              to="/login/admin"
              className="hover:underline transition duration-200"
            >
              Admin
            </Link>
          </>
        )}

        {user?.role === "user" && (
          <>
            <Link to="/products" className="hover:underline">
              <FaStore className="inline mr-1" /> Produk
            </Link>
            <Link to="/saldo" className="hover:underline">
              <FaMoneyBill className="inline mr-1" /> Saldo
            </Link>
            <Link to="/orders" className="hover:underline">
              🛒 Orders
            </Link>
            <button
              onClick={handleLogout}
              className="hover:underline text-red-200"
            >
              <FaSignOutAlt className="inline mr-1" /> Logout
            </button>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/products" className="hover:underline">
              <FaStore className="inline mr-1" /> Produk
            </Link>
            <Link to="/admin/my-product" className="hover:underline">
              📦 My Products
            </Link>
            <Link to="/orders" className="hover:underline">
              🛒 Orders
            </Link>
            <Link to="/admin/orders/me" className="hover:underline">
              🧾 Orders to Me
            </Link>
            <Link to="/saldo" className="hover:underline">
              <FaMoneyBill className="inline mr-1" /> Saldo
            </Link>
            <button
              onClick={handleLogout}
              className="hover:underline text-red-200"
            >
              <FaSignOutAlt className="inline mr-1" /> Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
