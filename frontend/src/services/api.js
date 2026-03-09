import axios from "axios";

export const BASE_URL = "http://localhost:5000";
const API_BASE_URL = "/api";

/* =======================
   ADMIN
======================= */

// Admin login
export const handleAdminLoginApi = (password) => {
  return axios.post(`${API_BASE_URL}/admin/login`, {
    password,
  });
};

/* =======================
   PRODUCTS
======================= */

// Search products
export const searchProductApi = (query) => {
  return axios.get(`${API_BASE_URL}/products/search`, {
    params: { query },
  });
};

// Get all products with filters

export const createProductApi = (formData) => {
  return axios.post(`${API_BASE_URL}/admin/products`, formData, {
    headers: {
      "x-admin": localStorage.getItem("adminPassword"),
    },
  });
};
export const getProductsApi = (params = {}) => {
  return axios.get(`${API_BASE_URL}/products`, { params });
};

// Get product by ID
export const getProductById = (id) => {
  return axios.get(`${API_BASE_URL}/product/${id}`);
};

// Image URL helper
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${API_BASE_URL}${imagePath}`;
};
