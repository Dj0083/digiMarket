import axios from 'axios';

const BASE_URL = 'http://192.168.43.219:3000'; // Change to your server URL

// Create axios instance
const apiClient = axios.create({
  baseURL: 'http://192.168.43.219:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  register: (userData) =>
    apiClient.post('/auth/register', userData),

  getProfile: (token) =>
    apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }),

  updateProfile: (profileData, token) =>
    apiClient.put('/auth/profile', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    }),
};

// Products API
export const productsAPI = {
  searchProducts: (params) =>
    apiClient.get('/products/search', { params }),

  getProductById: (id) =>
    apiClient.get(`/products/${id}`),

  getRelatedProducts: (id, limit = 10) =>
    apiClient.get(`/products/${id}/related`, { params: { limit } }),
};

// Categories API
export const categoriesAPI = {
  getCategories: () =>
    apiClient.get('/categories'),

  getCategoryById: (id, params = {}) =>
    apiClient.get(`/categories/${id}`, { params }),
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
  createOrder: (orderData, token) =>
    apiClient.post('/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getOrders: (params, token) =>
    apiClient.get('/orders', {
      params,
      headers: { Authorization: `Bearer ${token}` }
    }),

  getOrderById: (id, token) =>
    apiClient.get(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  updateOrderStatus: (id, status, trackingNumber, token) =>
    apiClient.put(`/orders/${id}/status`, 
      { status, tracking_number: trackingNumber }, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  cancelOrder: (id, token) =>
    apiClient.post(`/orders/${id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }),
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: (productId, params = {}) =>
    apiClient.get(`/reviews/products/${productId}`, { params }),

  addProductReview: (productId, reviewData, token) =>
    apiClient.post(`/reviews/products/${productId}`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  updateProductReview: (productId, reviewId, reviewData, token) =>
    apiClient.put(`/reviews/products/${productId}/${reviewId}`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  deleteProductReview: (productId, reviewId, token) =>
    apiClient.delete(`/reviews/products/${productId}/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getVendorReviews: (vendorId, params = {}) =>
    apiClient.get(`/reviews/vendors/${vendorId}`, { params }),

  addVendorReview: (vendorId, reviewData, token) =>
    apiClient.post(`/reviews/vendors/${vendorId}`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    }),
};

// Promotions API
export const promotionsAPI = {
  getPromotions: (params = {}) =>
    apiClient.get('/promotions', { params }),

  getSeasonalPromotions: () =>
    apiClient.get('/promotions/seasonal'),

  getVendorPromotions: (vendorId) =>
    apiClient.get(`/promotions/vendors/${vendorId}`),

  validatePromotion: (promotionCode, cartTotal, productIds = []) =>
    apiClient.post('/promotions/validate', {
      promotion_code: promotionCode,
      cart_total: cartTotal,
      product_ids: productIds
    }),

  getPromotionProducts: (params = {}) =>
    apiClient.get('/promotions/products', { params }),
};

export default apiClient;