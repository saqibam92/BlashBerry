// File: apps/client/src/lib/productApi.js

import api from "./api";

/**
 * Fetches featured products from the server.
 * @returns {Promise<Array>} A promise that resolves to an array of featured products.
 */
export const getFeaturedProducts = async () => {
  try {
    const response = await api.get("/api/products/featured");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
};

/**
 * Fetches all products with optional filtering, sorting, and pagination.
 * @param {object} params - The query parameters for the API call.
 * @param {string} params.category - Filter by category.
 * @param {string} params.size - Filter by size.
 * @param {number} params.minPrice - Minimum price.
 * @param {number} params.maxPrice - Maximum price.
 * @param {number} params.rating - Minimum rating.
 * @param {string} params.sort - Sorting order (e.g., 'price_asc', 'newest').
 * @param {number} params.page - Page number for pagination.
 * @param {number} params.limit - Number of items per page.
 * @param {string} params.search - Search term.
 * @param {string} params.color - Filter by color.
 * @returns {Promise<object>} A promise that resolves to the API response object.
 */
export const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get("/api/products", { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { data: [], pagination: {} };
  }
};

/**
 * Fetches a single product by its slug.
 * @param {string} slug - The slug of the product to fetch.
 * @returns {Promise<object|null>} A promise that resolves to the product object or null if not found.
 */
export const getProductBySlug = async (slug) => {
  try {
    const response = await api.get(`/api/products/${slug}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch product with slug ${slug}:`, error);
    return null;
  }
};

/**
 * Fetches products similar to the one specified by the slug.
 * @param {string} slug - The slug of the product.
 * @returns {Promise<Array>} A promise that resolves to an array of similar products.
 */
export const getSimilarProducts = async (slug) => {
  try {
    const response = await api.get(`/api/products/${slug}/similar`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch similar products for slug ${slug}:`, error);
    return [];
  }
};

/**
 * Searches for products based on a search term.
 * @param {string} term - The search term.
 * @returns {Promise<Array>} A promise that resolves to an array of matching products.
 */
export const searchProducts = async (term) => {
  if (!term) return [];
  try {
    const response = await api.get("/api/products/search", {
      params: { term },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to search products:", error);
    return [];
  }
};

/**
 * Fetches all active public categories for the filter.
 * @returns {Promise<Array>} A promise that resolves to an array of category objects.
 */
export const getCategories = async () => {
  try {
    const response = await api.get("/api/category/categories");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { success: false, data: [] };
  }
};

/**
 * Fetches details of a specific category by slug.
 * @param {string} slug - The slug of the category to fetch.
 * @returns {Promise<object|null>} A promise that resolves to the category object or null if not found.
 */
export const getCategoryData = async (slug) => {
  try {
    const response = await api.get(`/api/category/${slug}`);
    return response.data.data.category;
  } catch (error) {
    console.error(`Failed to fetch category ${slug}:`, error);
    return null;
  }
};

/**
 * Fetches products for a specific category by its ID.
 * @param {string} categoryId - The ID of the category.
 * @param {object} params - Additional query parameters (e.g., page, limit, sort).
 * @returns {Promise<object>} A promise that resolves to the API response object.
 */
export const getCategoryProducts = async (categoryId, params = {}) => {
  try {
    const response = await api.get(`/api/products/category/${categoryId}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch products for category ${categoryId}:`,
      error
    );
    return { data: [], pagination: {} };
  }
};

export const getActiveBanners = () => api.get("/api/products/banners/active");

/**
 * Fetches the selected video for the homepage.
 * @returns {Promise<object>} A promise that resolves to the API response object.
 */
export const getSelectedVideo = async () => {
  try {
    const response = await api.get("/api/video");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch selected video:", error);
    return { success: false, data: null };
  }
};

export const getTrendingProducts = async () => {
  try {
    const response = await api.get("/api/products/trending");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch trending products:", error);
    return [];
  }
};

export const getBestSellerProducts = async () => {
  try {
    const response = await api.get("/api/products/bestsellers");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch best sellers:", error);
    return [];
  }
};

export const getNewArrivalProducts = async () => {
  try {
    const response = await api.get("/api/products/newarrivals");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch new arrivals:", error);
    return [];
  }
};
