// File: apps/client/src/lib/orderApi.js

import api from "./api";

export const getOrder = async (id, config = {}) => {
  console.log("getOrder - Config:", config);
  return await api.get(`/api/orders/${id}`, config);
};

export const getOrdersByPhone = async (phone, config = {}) => {
  console.log("getOrdersByPhone - Config:", config);
  if (phone) {
    config.params = { ...config.params, phone };
  }
  return await api.get("/api/orders/my-orders", config);
};

export const getUserOrders = async (config = {}) => {
  console.log("getUserOrders - Config:", config);
  return await api.get("/api/orders/my-orders", config);
};
