import api from './api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const CART_STORAGE_KEY = 'freshja_cart';

export const cartService = {
  // Cart operations

  async addToCart(productId: string, quantity: number = 1, product?: any, isAuthenticated: boolean = false) {
    try {
      if (isAuthenticated) {
        return await this.addToServerCart(productId, quantity);
      } else {
        return await this.addToLocalCart(product || { id: productId }, quantity);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update cart item with auth parameter
  async updateCartItem(productId: string, quantity: number, isAuthenticated: boolean = false) {
    try {
      if (isAuthenticated) {
        return await this.updateServerCart(productId, quantity);
      } else {
        return await this.updateLocalCartQuantity(productId, quantity);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove from cart with auth parameter
  async removeFromCart(productId: string, isAuthenticated: boolean = false) {
    try {
      if (isAuthenticated) {
        return await this.removeFromServerCart(productId);
      } else {
        return await this.removeFromLocalCart(productId);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Get cart with auth parameter
  async getCart(isAuthenticated: boolean = false) {
    try {
      if (isAuthenticated) {
        return await this.getServerCart();
      } else {
        return await this.getLocalCart();
      }
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  },

  // Local cart operations
  getLocalCart: async () => {
    try {
      const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return cartJson ? JSON.parse(cartJson) : [];
    } catch (error) {
      console.error('Error getting local cart:', error);
      return [];
    }
  },

  addToLocalCart: async (product, quantity = 1) => {
    try {
      const currentCart = await cartService.getLocalCart();
      const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
      
      let updatedCart;
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        updatedCart = currentCart.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        updatedCart = [...currentCart, { ...product, quantity }];
      }
      
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      return updatedCart;
    } catch (error) {
      console.error('Error adding to local cart:', error);
      throw error;
    }
  },

  updateLocalCartQuantity: async (productId, newQuantity) => {
    try {
      const currentCart = await cartService.getLocalCart();
      
      let updatedCart;
      if (newQuantity === 0) {
        // Remove item if quantity is 0
        updatedCart = currentCart.filter(item => item.id !== productId);
      } else {
        // Update quantity
        updatedCart = currentCart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      }
      
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      return updatedCart;
    } catch (error) {
      console.error('Error updating local cart:', error);
      throw error;
    }
  },

  removeFromLocalCart: async (productId) => {
    try {
      const currentCart = await cartService.getLocalCart();
      const updatedCart = currentCart.filter(item => item.id !== productId);
      
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      return updatedCart;
    } catch (error) {
      console.error('Error removing from local cart:', error);
      throw error;
    }
  },

  clearLocalCart: async () => {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      return [];
    } catch (error) {
      console.error('Error clearing local cart:', error);
      throw error;
    }
  },

  // Server cart operations
  getServerCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error getting server cart:', error);
      throw error;
    }
  },

  addToServerCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart', { productId, quantity });
      return response.data;
    } catch (error) {
      console.error('Error adding to server cart:', error);
      throw error;
    }
  },

  updateServerCart: async (productId, quantity) => {
    try {
      const response = await api.put('/cart', { productId, quantity });
      return response.data;
    } catch (error) {
      console.error('Error updating server cart:', error);
      throw error;
    }
  },

  removeFromServerCart: async (productId) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from server cart:', error);
      throw error;
    }
  },

  // Sync local cart with server
  syncCartWithServer: async () => {
    try {
      const localCart = await cartService.getLocalCart();
      
      if (localCart.length === 0) return;

      // Add all local cart items to server
      for (const item of localCart) {
        await cartService.addToServerCart(item.id, item.quantity);
      }
      
      // Clear local cart after successful sync
      await cartService.clearLocalCart();
      
      console.log('Cart synced successfully with server');
    } catch (error) {
      console.error('Error syncing cart with server:', error);
      throw error;
    }
  }
};