import axios from "axios";

const API = axios.create({
  baseURL: "https://listora-backend-w2li.onrender.com",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;