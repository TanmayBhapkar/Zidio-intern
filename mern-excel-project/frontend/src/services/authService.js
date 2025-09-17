import api from "../api/axios.js";

export async function register({ email, password, name }) {
  const res = await api.post("/auth/register", { email, password, name });
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}
