import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import CardProfileUser from "../components/CardProfileUser";
import { orderProduct } from "../api/order";

// Tipe produk
type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  user: {
    id: number;
    email: string;
  };
};

const AllProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [, setTotal] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: any = {
          search,
          sortBy,
          order,
          page,
          limit: 8,
        };
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3000/api/products/all-products",
          {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setProducts(res.data.data);
        setTotal(res.data.total || 0);
      } catch (err) {
        setError("Gagal mengambil produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, sortBy, order, minPrice, maxPrice, page]);

  const handleOrder = async (productId: number) => {
    const res = await orderProduct(productId);
    return res;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-gray-800 dark:text-gray-200">
      <CardProfileUser />
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">
        🛍️ Semua Produk
      </h2>

      {/* Filter & Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/3"
        />
        <input
          type="number"
          placeholder="Min Harga"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/6"
        />
        <input
          type="number"
          placeholder="Max Harga"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/6"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/6"
        >
          <option value="name">Nama</option>
          <option value="price">Harga</option>
          <option value="id">Terbaru</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/6"
        >
          <option value="asc">⬆️ Naik</option>
          <option value="desc">⬇️ Turun</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : error ? (
        <p className="text-center mt-10 text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOrder={handleOrder}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setSearchParams({ page: String(page - 1) })}
              disabled={page <= 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              ⬅️ Prev
            </button>
            <span className="self-center">Page {page}</span>
            <button
              onClick={() => setSearchParams({ page: String(page + 1) })}
              disabled={products.length < 8}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllProductsPage;
