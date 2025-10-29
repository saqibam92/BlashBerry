// File: apps/client/src/lib/authApi.js

import api from "./api";

export const loginUser = (credentials) =>
  api.post("/api/auth/login", credentials);
export const registerUser = (userData) =>
  api.post("/api/auth/register", userData);
export const adminLoginUser = (credentials) =>
  api.post("/api/auth/admin/login", credentials);
export const getMe = () => api.get("/api/auth/me");
export const getUserOrders = async (guestEmail, config = {}) => {
  console.log("getUserOrders - Config:", config);
  if (guestEmail) {
    config.params = { ...config.params, guestEmail };
  }
  // const defaultConfig = guestEmail ? { params: { guestEmail } } : {};
  return await api.get("/api/orders/my-orders", config);
};
export const mergeGuestOrders = (guestEmail) =>
  api.post("/api/orders/merge", { guestEmail });
export const getOrder = (id, config = {}) =>
  api.get(`/api/orders/${id}`, config);
