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
        "https://full-stack-be-online-store-production.up.railway.app/api/products/order/me",
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

  const handleExportPDF = async (
    orders: Order[],
    adminName: string,
    startDate?: string,
    endDate?: string
  ) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // fungsi convert gambar url → base64
    const getBase64ImageFromUrl = async (url: string) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    };

    // ambil logo
    const logo = await getBase64ImageFromUrl("https://iili.io/KBFUkhv.md.png");
    doc.addImage(logo, "PNG", 90, 8, 30, 15);

    // header toko
    doc.setFont("courier", "bold");
    doc.setFontSize(18);
    doc.text("🛒 FARSYA STORE", 105, 30, { align: "center" });

    doc.setFontSize(10);
    doc.text("Jl. Pemrograman No. 123, Jakarta", 105, 36, { align: "center" });
    doc.text("Telp: (021) 12345678", 105, 40, { align: "center" });

    // garis pemisah
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(15, 44, 195, 44);

    // judul laporan
    doc.setFontSize(12);
    doc.setFont("courier", "normal");
    doc.text("📃 Laporan Order Masuk", 105, 50, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Admin: ${adminName}`, 15, 56);
    doc.text(`Dicetak: ${new Date().toLocaleString("id-ID")}`, 195, 56, {
      align: "right",
    });

    if (startDate && endDate) {
      doc.text(`Periode: ${startDate} s/d ${endDate}`, 15, 62);
    }

    // tabel order
    autoTable(doc, {
      startY: startDate && endDate ? 68 : 64,
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

    // total pendapatan
    const totalHarga = orders.reduce((sum, o) => sum + o.harga, 0);
    const finalY = (doc as any).lastAutoTable.finalY || 90;

    doc.setFont("courier", "bold");
    doc.setFontSize(11);
    doc.text(
      `TOTAL PENDAPATAN: Rp ${totalHarga.toLocaleString("id-ID")}`,
      195,
      finalY + 10,
      { align: "right" }
    );

    // ucapan
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "Terima kasih telah menggunakan layanan kami 💙",
      105,
      finalY + 18,
      {
        align: "center",
      }
    );

    // nomor halaman
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(`Halaman ${i} dari ${pageCount}`, 105, 290, { align: "center" });
    }

    doc.save("laporan-order-admin.pdf");
  };

  const onExportClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    handleExportPDF(orders, "Admin Farsya");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📋 Order Masuk</h2>

      <button
        onClick={onExportClick}
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
