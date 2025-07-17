import axios from "axios";

export const orderProduct = async (productId: number) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    "http://localhost:3000/api/products/order",
    { productId },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("✅ Response status:", res.status);
  console.log("✅ Response data:", res.data);

  return res.data;
};
