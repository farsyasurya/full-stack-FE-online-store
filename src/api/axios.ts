import axios from "axios";

export const api = axios.create({
  baseURL: "https://full-stack-be-online-store-production.up.railway.app/api",
  withCredentials: true, // penting untuk cookie JWT
});
