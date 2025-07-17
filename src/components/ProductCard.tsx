import Swal from "sweetalert2";

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

type OrderResponse = {
  message: string;
  detail: {
    produk: {
      nama: string;
      harga: number;
    };
    saldoDikirim: number;
    saldoSisaUser: number;
    penerima: {
      email: string;
    };
  };
};

type Props = {
  product: Product;
  onOrder?: (productId: number) => Promise<OrderResponse>;
};

const ProductCard = ({ product, onOrder }: Props) => {
  const handleOrderClick = () => {
    Swal.fire({
      title: "Yakin ingin order produk ini?",
      text: product.name,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Order",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await onOrder!(product.id);

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: response.message,
            html: `
          <p><b>Produk:</b> ${response.detail.produk.nama}</p>
          <p><b>Harga:</b> Rp ${response.detail.produk.harga.toLocaleString(
            "id-ID"
          )}</p>
          <p><b>Saldo dikirim ke:</b> ${response.detail.penerima.email}</p>
          <p><b>Jumlah dikirim:</b> Rp ${response.detail.saldoDikirim.toLocaleString(
            "id-ID"
          )}</p>
          <p><b>Sisa saldo Anda:</b> Rp ${response.detail.saldoSisaUser.toLocaleString(
            "id-ID"
          )}</p>
        `,
            showConfirmButton: false,
            timer: 10500,
          });
        } catch (err: any) {
          const message = err?.response?.data?.message;
          if (message === "Saldo tidak cukup") {
            Swal.fire(
              "Saldo Tidak Cukup",
              "Silakan isi saldo terlebih dahulu.",
              "warning"
            );
          } else {
            Swal.fire(
              "Gagal!",
              message || "Terjadi kesalahan saat order produk.",
              "error"
            );
          }
        }
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-200 dark:border-gray-700">
      <div className="w-full aspect-[4/3] overflow-hidden flex items-center justify-center">
        {" "}
        {/* Added flex for centering */}
        <img
          src={`http://localhost:3000/uploads/${product.image}`}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105" // Changed object-cover to object-contain
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {product.name}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
          Rp {product.price.toLocaleString("id-ID")}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Dijual oleh: <span className="font-medium">{product.user.email}</span>
        </p>

        <button
          onClick={handleOrderClick}
          className="mt-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
        >
          Beli
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
