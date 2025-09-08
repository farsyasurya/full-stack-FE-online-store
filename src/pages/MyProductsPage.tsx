import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  deletedAt: string | null;
}

const MyProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: null as File | null,
    editId: null as number | null,
  });
  const [showDialog, setShowDialog] = useState(false);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://full-stack-be-online-store-production.up.railway.app/api/products/mine",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setProducts(res.data.products);
    } catch (err: any) {
      console.error(
        "Gagal mengambil produk admin:",
        err?.response?.data || err
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    if (form.image) formData.append("image", form.image);

    try {
      const token = localStorage.getItem("token");
      if (form.editId) {
        await axios.put(
          `http://localhost:3000/api/products/${form.editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        Swal.fire("Berhasil!", "Produk berhasil diupdate.", "success");
      } else {
        await axios.post(
          "http://localhost:3000/api/products/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        Swal.fire("Berhasil!", "Produk berhasil ditambahkan.", "success");
      }
      setForm({ name: "", price: "", image: null, editId: null });
      setShowDialog(false);
      fetchProducts();
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan produk", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus produk ini?",
      text: "Produk akan disembunyikan dari halaman publik.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `https://full-stack-be-online-store-production.up.railway.app/api/products/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        Swal.fire(
          "Terhapus!",
          "Produk berhasil dihapus (soft delete).",
          "success"
        );
        fetchProducts();
      } catch (err) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus produk", "error");
      }
    }
  };

  const handleRestore = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin mengembalikan produk ini?",
      text: "Produk akan tersedia kembali di etalase!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, kembalikan!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.patch(
          `https://full-stack-be-online-store-production.up.railway.app/api/products/restore/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        Swal.fire("Berhasil!", "Produk berhasil dikembalikan.", "success");
        fetchProducts();
      } catch (err) {
        Swal.fire("Gagal", "Terjadi kesalahan saat restore produk.", "error");
      }
    }
  };

  // --- Fungsi Baru: Hard Delete Produk ---
  const handleHardDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "ANDA YAKIN?",
      text: "Produk ini akan dihapus PERMANEN dari database dan tidak bisa dikembalikan!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "YA, HAPUS PERMANEN!",
      cancelButtonText: "BATAL",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `https://full-stack-be-online-store-production.up.railway.app/api/products/hard-delete/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        Swal.fire(
          "Terhapus Permanen!",
          "Produk berhasil dihapus secara permanen.",
          "success"
        );
        fetchProducts();
      } catch (err) {
        Swal.fire(
          "Gagal",
          "Terjadi kesalahan saat menghapus produk permanen.",
          "error"
        );
      }
    }
  };
  // --- Akhir Fungsi Baru ---

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl my-8">
      <h2 className="text-4xl font-extrabold mb-8 text-blue-700 dark:text-blue-400 flex items-center gap-3">
        <span className="text-5xl">📦</span> Produk Saya
      </h2>

      {/* Tombol Tambah Produk */}
      <div className="flex justify-end mb-10">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-xl text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 h-12 px-6 py-3 shadow-lg transform hover:-translate-y-1 hover:shadow-xl duration-300">
              <span className="mr-2 text-xl">➕</span> Tambah Produk
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                {form.editId ? (
                  <>
                    <span className="text-3xl">✏️</span> Edit Produk
                  </>
                ) : (
                  <>
                    <span className="text-3xl">✨</span> Tambah Produk Baru
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2 text-base">
                {form.editId
                  ? "Sesuaikan detail produk Anda di sini."
                  : "Isi detail produk baru di bawah ini untuk menambahkannya."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Nama Produk
                </label>
                <input
                  id="productName"
                  type="text"
                  placeholder="Contoh: Kemeja Katun Premium"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="productPrice"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Harga (IDR)
                </label>
                <input
                  id="productPrice"
                  type="number"
                  placeholder="Contoh: 150000"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  required
                  min="0"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div>
                <label
                  htmlFor="productImage"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Gambar Produk
                </label>
                <input
                  id="productImage"
                  type="file"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      image: e.target.files?.[0] || null,
                    }))
                  }
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 dark:file:bg-blue-700 file:text-blue-700 dark:file:text-white hover:file:bg-blue-200 dark:hover:file:bg-blue-600 cursor-pointer"
                />
                {form.image && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    File terpilih:{" "}
                    <span className="font-medium">{form.image.name}</span>
                  </p>
                )}
              </div>

              <DialogFooter className="flex justify-end gap-4 pt-6">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 h-12 px-6 py-3 shadow-md transform hover:scale-[1.02] duration-200"
                >
                  {form.editId ? (
                    <>
                      <span className="mr-2">💾</span> Update Produk
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✨</span> Tambah Produk
                    </>
                  )}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bagian Produk Tersedia */}
      <h3 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400 flex items-center gap-2">
        <span className="text-3xl">🟢</span> Produk Tersedia
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
        {products
          .filter((p) => !p.deletedAt)
          .map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col transform hover:scale-[1.03] transition-all duration-300 cursor-pointer"
            >
              <div className="w-full aspect-square overflow-hidden rounded-lg mb-4 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <img
                  src={`https://full-stack-be-online-store-production.up.railway.app/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-3">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => {
                    setForm({
                      name: product.name,
                      price: String(product.price),
                      image: null,
                      editId: product.id,
                    });
                    setShowDialog(true);
                  }}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center justify-center gap-1"
                >
                  <span className="text-lg">✏️</span> Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center justify-center gap-1"
                >
                  <span className="text-lg">🗑</span> Hapus
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Bagian Produk Terhapus */}
      <h3 className="text-2xl font-bold mb-6 text-red-700 dark:text-red-400 flex items-center gap-2">
        <span className="text-3xl">🗑</span> Produk Terhapus
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products
          .filter((p) => p.deletedAt)
          .map((product) => (
            <div
              key={product.id}
              className="bg-gray-100 dark:bg-gray-700 p-5 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-600 flex flex-col opacity-70 cursor-not-allowed"
            >
              <div className="w-full aspect-square overflow-hidden rounded-lg mb-4 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                <img
                  src={`https://full-stack-be-online-store-production.up.railway.app/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-contain rounded grayscale transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                {product.name}
              </h3>
              <p className="text-2xl font-extrabold text-gray-500 dark:text-gray-400 mb-3 line-through">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => handleRestore(product.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center justify-center gap-1"
                >
                  <span className="text-lg">🔄</span> Restore
                </button>
                {/* --- Tombol Hard Delete Baru --- */}
                <button
                  onClick={() => handleHardDelete(product.id)}
                  className="flex-1 bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center justify-center gap-1"
                >
                  <span className="text-lg">🔥</span> Hapus Permanen
                </button>
                {/* --- Akhir Tombol Hard Delete Baru --- */}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyProductsPage;
