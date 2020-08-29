import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1026",
});

export default api;
