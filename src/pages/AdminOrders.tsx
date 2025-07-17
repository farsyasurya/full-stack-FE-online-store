import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Order {
  id: number;
  produk: string;
  harga: number;
  tanggal: string;
  pembeli: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/api/products/order/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Gagal mengambil data order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFont("courier", "bold");
    doc.setFontSize(18);
    doc.text("\ud83d\uded2 FARSYA STORE", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text("Jl. Pemrograman No. 123, Jakarta", 105, 26, { align: "center" });
    doc.text("Telp: (021) 12345678", 105, 30, { align: "center" });

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(15, 34, 195, 34);

    doc.setFontSize(12);
    doc.setFont("courier", "normal");
    doc.text("\ud83e\uddf3 Laporan Order Masuk", 105, 40, { align: "center" });
    doc.setFontSize(10);
    doc.text(
      `\ud83d\udd52 Dicetak: ${new Date().toLocaleString("id-ID")}`,
      105,
      46,
      {
        align: "center",
      }
    );

    autoTable(doc, {
      startY: 52,
      head: [["No", "Produk", "Harga", "Tanggal", "Pembeli"]],
      body: orders.map((order, i) => [
        i + 1,
        order.produk,
        `Rp ${order.harga.toLocaleString("id-ID")}`,
        new Date(order.tanggal).toLocaleString("id-ID"),
        order.pembeli,
      ]),
      styles: { font: "courier", fontSize: 10, halign: "center" },
      headStyles: { fillColor: [0, 102, 204], textColor: 255 },
      theme: "striped",
    });

    const finalY = (doc as any).lastAutoTable.finalY || 90;
    doc.text(
      "Terima kasih telah menggunakan layanan kami \ud83d\udc99",
      105,
      finalY + 10,
      { align: "center" }
    );

    doc.save("laporan-order-admin.pdf");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📋 Order Masuk</h2>

      <button
        onClick={handleExportPDF}
        className="mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
      >
        📤 Export PDF
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>Tidak ada order masuk.</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Produk</th>
                <th className="px-4 py-2">Harga</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Pembeli</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2">{order.produk}</td>
                  <td className="px-4 py-2 text-right">
                    Rp {order.harga.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(order.tanggal).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-2">{order.pembeli}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
