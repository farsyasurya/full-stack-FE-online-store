import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

type Order = {
  id: number;
  produk: string;
  tanggal: string;
  harga: number;
  admin: string;
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://full-stack-be-online-store-production.up.railway.app/api/products/order/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Gagal mengambil riwayat order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDownloadPDF = async (order: Order) => {
    // ukuran struk: lebar 80mm, tinggi 150mm (bisa auto menyesuaikan konten)
    const doc = new jsPDF({
      unit: "mm",
      format: [80, 150],
    });

    // ambil logo dari URL → convert ke base64
    const getBase64ImageFromUrl = async (url: string) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    };

    const logo = await getBase64ImageFromUrl("https://iili.io/KBFUkhv.md.png");

    let y = 10;

    // tampilkan logo di atas
    doc.addImage(logo, "PNG", 20, y, 40, 20);
    y += 28;

    // teks header
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    doc.text("FARSYA STORE", 40, y, { align: "center" });
    y += 6;

    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.text("----------------------------------------", 40, y, {
      align: "center",
    });
    y += 6;

    // isi transaksi
    doc.text(`ID ORDER : #${order.id}`, 10, y);
    y += 5;
    doc.text(
      `TANGGAL  : ${new Date(order.tanggal).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })}`,
      10,
      y
    );
    y += 8;

    doc.text("----------------------------------------", 40, y, {
      align: "center",
    });
    y += 6;

    doc.text(`PRODUK   : ${order.produk}`, 10, y);
    y += 5;
    doc.text(`HARGA    : Rp ${order.harga.toLocaleString("id-ID")}`, 10, y);
    y += 5;
    doc.text(`ADMIN    : ${order.admin}`, 10, y);
    y += 8;

    doc.text("----------------------------------------", 40, y, {
      align: "center",
    });
    y += 8;

    // footer
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("=== TERIMA KASIH TELAH BERBELANJA ===", 40, y, {
      align: "center",
    });

    doc.save(`bukti-transaksi-${order.id}.pdf`);
  };

  if (loading) return <p className="text-center mt-10">Memuat data order...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300">
        🧾 Riwayat Order
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Belum ada order
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center transition hover:shadow-lg"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {order.produk}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Tanggal:</span>{" "}
                  {new Date(order.tanggal).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Admin:</span> {order.admin}
                </p>
              </div>

              <div className="mt-4 sm:mt-0 text-right flex flex-col items-end gap-2">
                <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                  Rp {order.harga.toLocaleString("id-ID")}
                </div>
                <button
                  onClick={() => handleDownloadPDF(order)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg transition"
                >
                  Unduh Bukti
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
