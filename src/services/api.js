import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const BASE_URL = "http://192.168.43.219:5000"; //  server URL

// Create axios instance
const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  async (error) => {
    console.error("API Response Error:", error.response?.data || error.message);

    const status = error.response?.status;
    const message = error.response?.data?.message;

    // Handle both 401 Unauthorized and 403 Forbidden (expired/invalid token)
    if (status === 401 || (status === 403 && message?.includes("Invalid or expired token"))) {
      console.log("Token expired, clearing stored token...");

      await AsyncStorage.removeItem("token");

      // Throw a custom error so UI can handle logout/redirect
      const tokenError = new Error("Session expired. Please login again.");
      tokenError.code = "TOKEN_EXPIRED";
      tokenError.status = status;
      return Promise.reject(tokenError);
    }

    return Promise.reject(error);
  }
);


// Auth API
export const authAPI = {
  login: async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    if (res.token) {
      await AsyncStorage.setItem("token", res.token); // save token
    }
    return res;
  },

  register: (userData) => apiClient.post("/auth/register", userData),

  getProfile: () => apiClient.get("/auth/me"),

  updateProfile: (profileData) => apiClient.put("/auth/profile", profileData),

  logougt: async () => {
    await AsyncStorage.removeItem("token"); // clear token
    console.log('Token cleared from storage');
  }
};

// Products API
export const productsAPI = {
  searchProducts: (params) => apiClient.get("/products/search", { params }),

  getProductById: (id) => apiClient.get(`/products/${id}`),

  getRelatedProducts: (id, limit = 10) =>
    apiClient.get(`/products/${id}/related`, { params: { limit } }),
};

// Categories API
export const categoriesAPI = {
  getCategories: () => apiClient.get("/categories"),

  getCategoryById: (id, params = {}) => apiClient.get(`/categories/${id}`, { params }),
};

// Cart API
export const cartAPI = {
  getCart: (token) =>
    apiClient.get('/cart', {
      headers: { Authorization: `Bearer ${token}` }
    }),

  addToCart: (productId, quantity, token) =>
    apiClient.post('/cart/items', { product_id: productId, quantity }, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  updateCartItem: (cartId, quantity, token) =>
    apiClient.put(`/cart/items/${cartId}`, { quantity }, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  removeFromCart: (cartId, token) =>
    apiClient.delete(`/cart/items/${cartId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  clearCart: (token) =>
    apiClient.delete('/cart', {
      headers: { Authorization: `Bearer ${token}` }
    }),

  applyPromotion: (promotionCode, token) =>
    apiClient.post('/cart/apply-promotion', { promotion_code: promotionCode }, {
      headers: { Authorization: `Bearer ${token}` }
    }),
};


// Orders API
export const ordersAPI = {
  createOrder: (orderData) => apiClient.post("/orders", orderData),

  getOrders: (params) => apiClient.get("/orders", { params }),

  getOrderById: (id) => apiClient.get(`/orders/${id}`),

  updateOrderStatus: (id, status, trackingNumber) =>
    apiClient.put(`/orders/${id}/status`, { status, tracking_number: trackingNumber }),

  cancelOrder: (id) => apiClient.post(`/orders/${id}/cancel`),
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: (productId, params = {}) =>
    apiClient.get(`/reviews/products/${productId}`, { params }),

  addProductReview: (productId, reviewData) =>
    apiClient.post(`/reviews/products/${productId}`, reviewData),

  updateProductReview: (productId, reviewId, reviewData) =>
    apiClient.put(`/reviews/products/${productId}/${reviewId}`, reviewData),

  deleteProductReview: (productId, reviewId) =>
    apiClient.delete(`/reviews/products/${productId}/${reviewId}`),

  getVendorReviews: (vendorId, params = {}) =>
    apiClient.get(`/reviews/vendors/${vendorId}`, { params }),

  addVendorReview: (vendorId, reviewData) =>
    apiClient.post(`/reviews/vendors/${vendorId}`, reviewData),
};

// Promotions API
export const promotionsAPI = {
  getPromotions: (params = {}) => apiClient.get("/promotions", { params }),

  getSeasonalPromotions: () => apiClient.get("/promotions/seasonal"),

  getVendorPromotions: (vendorId) => apiClient.get(`/promotions/vendors/${vendorId}`),

  validatePromotion: (promotionCode, cartTotal, productIds = []) =>
    apiClient.post("/promotions/validate", {
      promotion_code: promotionCode,
      cart_total: cartTotal,
      product_ids: productIds,
    }),

  getPromotionProducts: (params = {}) => apiClient.get("/promotions/products", { params }),
};

// Token utility functions
export const tokenUtils = {
  async checkToken() {
    const token = await AsyncStorage.getItem('token');
    console.log('Current token:', token ? 'Exists' : 'Missing');
    return token;
  },

  async clearToken() {
    await AsyncStorage.removeItem('token');
    console.log('Token cleared manually');
  }
};

export default apiClient;
