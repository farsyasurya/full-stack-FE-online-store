import axios from "axios";

export const getAllProducts = async (_token: string) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(
      "http://localhost:3000/api/products/all-products",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    throw error;
  }
};
