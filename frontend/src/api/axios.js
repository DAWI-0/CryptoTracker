import axios from "axios";

const api = axios.create({
  baseURL: "/api", // plus besoin du localhost
  withCredentials: true
});

export default api;
