// File: apps/client/src/lib/adminApi.js

import api from "./api";

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const res = await api.get("/api/admin/stats");
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return null;
  }
};

// --- CATEGORY APIS ---
export const getAdminCategories = () => api.get("/api/admin/categories");
export const createAdminCategory = (data) =>
  api.post("/api/admin/categories", data);
export const updateAdminCategory = (id, data) =>
  api.put(`/api/admin/categories/${id}`, data);
export const deleteAdminCategory = (id) =>
  api.delete(`/api/admin/categories/${id}`);

// --- PRODUCT APIS ---
export const getAdminProducts = (filters = {}) =>
  api.get("/api/admin/products", { params: filters });
export const getAdminBrands = () => api.get("/api/admin/brands");
export const createAdminProduct = (data) =>
  api.post("/api/admin/products", data);
export const updateAdminProduct = (id, data) =>
  api.put(`/api/admin/products/${id}`, data);
export const deleteAdminProduct = (id) =>
  api.delete(`/api/admin/products/${id}`);
export const getAdminProductById = (id) => api.get(`/api/admin/products/${id}`);

// --- USER APIS ---
export const getAdminUsers = () => api.get("/api/admin/users");
export const createAdminUser = (data) => api.post("/api/admin/users", data);
export const updateAdminUser = (id, data) =>
  api.put(`/api/admin/users/${id}`, data);
export const deleteAdminUser = (id) => api.delete(`/api/admin/users/${id}`);

// --- ORDER APIS ---
export const getAdminOrders = () => api.get("/api/admin/orders");
export const updateAdminOrderStatus = (id, status) =>
  api.put(`/api/admin/orders/${id}/status`, { status });

// --- BANNER APIS ---
export const getAdminBanners = () => api.get("/api/admin/banners");
export const createAdminBanner = (data) => api.post("/api/admin/banners", data);
export const updateAdminBanner = (id, data) =>
  api.put(`/api/admin/banners/${id}`, data);
export const deleteAdminBanner = (id) => api.delete(`/api/admin/banners/${id}`);
export const uploadBannerImage = (formData) =>
  api.post("/api/admin/upload/banner", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const toggleBannerActiveStatus = (id) =>
  api.put(`/admin/banners/${id}/toggle-active`);

export const getAdminVideos = async () => {
  try {
    const response = await api.get("/api/video/admin");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return { success: false, data: [] };
  }
};

export const createAdminVideo = async (videoData) => {
  try {
    const response = await api.post("/api/videos", videoData);
    return response.data;
  } catch (error) {
    console.error("Failed to create video:", error);
    throw error;
  }
};

export const updateAdminVideo = async (id, videoData) => {
  try {
    const response = await api.put(`/api/videos/${id}`, videoData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update video ${id}:`, error);
    throw error;
  }
};

export const deleteAdminVideo = async (id) => {
  try {
    const response = await api.delete(`/api/videos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete video ${id}:`, error);
    throw error;
  }
};

export const uploadProductImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await api.post("/api/products/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.urls;
};

/**
 * Uploads a CSV file for preview.
 * @param {File} file The CSV file.
 * @returns {Promise<object>} A promise that resolves to the preview data.
 */
export const previewCsvImport = async (file) => {
  const formData = new FormData();
  formData.append("csvFile", file);

  try {
    const res = await api.post("/api/products/import/preview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Failed to preview CSV:", error);
    throw error.response?.data || new Error("Preview failed");
  }
};

/**
 * Confirms and imports the CSV file.
 * @param {File} file The same CSV file.
 * @returns {Promise<object>} A promise that resolves to the import summary.
 */
export const confirmCsvImport = async (productsToImport) => {
  try {
    const res = await api.post("/api/products/import/confirm", {
      products: productsToImport,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to import CSV:", error);
    throw error.response?.data || new Error("Import failed");
  }
};
/**
 * Downloads the CSV template file.
 */
export const downloadCsvTemplate = async () => {
  try {
    const response = await api.get("/api/products/import/sample-csv", {
      responseType: "blob", // Important: tells axios to handle a file download
    });

    // Create a temporary link to trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "blashberry-product-template.csv");
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download CSV template:", error);
    throw new Error("Could not download file.");
  }
};
