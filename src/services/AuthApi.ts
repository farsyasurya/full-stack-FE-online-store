// src/services/AuthApi.ts
import axios from "axios";

const BASE_URL =
  "https://full-stack-be-online-store-production.up.railway.app/api/auth";

axios.defaults.withCredentials = true;

export const getMe = () => axios.get(`${BASE_URL}/me`).then((res) => res.data);

export const logoutUser = () =>
  axios.post(`${BASE_URL}/logout`).then((res) => res.data);
