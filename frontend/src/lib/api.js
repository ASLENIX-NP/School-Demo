import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 12000,
});

export default api;
