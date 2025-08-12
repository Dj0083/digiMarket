// authService.js - Create this file to handle authentication
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'your-api-base-url'; // Replace with your actual API URL

class AuthService {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add token to headers
    axios.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token expiration
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken
              });

              const { token, refreshToken: newRefreshToken } = response.data;
              
              // Store new tokens
              await AsyncStorage.setItem('authToken', token);
              await AsyncStorage.setItem('refreshToken', newRefreshToken);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            await this.logout();
            // Navigate to login screen
            // NavigationService.navigate('Login');
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token, refreshToken, user } = response.data;

      // Store tokens securely
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  }

  async logout() {
    await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'user']);
  }

  async getCurrentUser() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return null;

      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      return response.data.user;
    } catch (error) {
      if (error.response?.status === 403) {
        await this.logout();
      }
      return null;
    }
  }

  async isAuthenticated() {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  }
}

export default new AuthService();