import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cartAPI } from '../services/api';
import { AuthContext } from './AuthContext';
import Toast from 'react-native-toast-message';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    item_count: 0,
    total_quantity: 0,
    subtotal: '0.00'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load cart when user authenticates
  useEffect(() => {
    if (isAuthenticated && token) {
      loadCart();
    } else {
      clearCart();
    }
  }, [isAuthenticated, token]);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartAPI.getCart(token);
      
      if (response.success) {
        setCartItems(response.data.items);
        setCartSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Load cart error:', error);
      // Try to load from local storage as fallback
      await loadLocalCart();
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalCart = async () => {
    try {
      const localCart = await AsyncStorage.getItem('cart_data');
      if (localCart) {
        const cartData = JSON.parse(localCart);
        setCartItems(cartData.items || []);
        setCartSummary(cartData.summary || { item_count: 0, total_quantity: 0, subtotal: '0.00' });
      }
    } catch (error) {
      console.error('Load local cart error:', error);
    }
  };

  const saveLocalCart = async (items, summary) => {
    try {
      const cartData = { items, summary };
      await AsyncStorage.setItem('cart_data', JSON.stringify(cartData));
    } catch (error) {
      console.error('Save local cart error:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (!isAuthenticated) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Required',
          text2: 'Please login to add items to cart'
        });
        return { success: false, message: 'Authentication required' };
      }

      setIsLoading(true);
      const response = await cartAPI.addToCart(productId, quantity, token);
      
      if (response.success) {
        await loadCart(); // Refresh cart
        Toast.show({
          type: 'success',
          text1: 'Added to Cart',
          text2: 'Item has been added to your cart'
        });
        return { success: true };
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage
      });
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (cartId, quantity) => {
    try {
      if (!isAuthenticated) {
        return { success: false, message: 'Authentication required' };
      }

      setIsLoading(true);
      const response = await cartAPI.updateCartItem(cartId, quantity, token);
      
      if (response.success) {
        await loadCart(); // Refresh cart
        return { success: true };
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Update cart item error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update cart item';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage
      });
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      if (!isAuthenticated) {
        return { success: false, message: 'Authentication required' };
      }

      setIsLoading(true);
      const response = await cartAPI.removeFromCart(cartId, token);
      
      if (response.success) {
        await loadCart(); // Refresh cart
        Toast.show({
          type: 'success',
          text1: 'Removed',
          text2: 'Item removed from cart'
        });
        return { success: true };
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage
      });
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated && token) {
        await cartAPI.clearCart(token);
      }
      
      setCartItems([]);
      setCartSummary({ item_count: 0, total_quantity: 0, subtotal: '0.00' });
      await AsyncStorage.removeItem('cart_data');
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  const getCartItemCount = () => {
    return cartSummary.item_count;
  };

  const getCartTotal = () => {
    return parseFloat(cartSummary.subtotal);
  };

  const isProductInCart = (productId) => {
    return cartItems.some(item => item.product_id === productId);
  };

  const getProductQuantityInCart = (productId) => {
    const item = cartItems.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const applyPromotion = async (promotionCode) => {
    try {
      if (!isAuthenticated) {
        return { success: false, message: 'Authentication required' };
      }

      setIsLoading(true);
      const response = await cartAPI.applyPromotion(promotionCode, token);
      
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Promotion Applied',
          text2: `You saved $${response.data.discount_amount}`
        });
        return response;
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid Code',
          text2: response.message
        });
        return response;
      }
    } catch (error) {
      console.error('Apply promotion error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to apply promotion';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage
      });
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cartItems,
    cartSummary,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    getCartItemCount,
    getCartTotal,
    isProductInCart,
    getProductQuantityInCart,
    applyPromotion,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};