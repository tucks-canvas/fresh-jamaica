import api from './api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const userService = {
  // Get all home data
  getHomeData: async (params = {}) => {
    const response = await api.get('/user', { params }); // Should point to your user.js routes
    return response.data;
  },

  // Search products
  searchProducts: async (searchQuery, category = null) => {
    const params = { q: searchQuery };
    if (category) params.category = category;
    
    const response = await api.get('/user/search', { params });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId, page = 1, limit = 20) => {
    const response = await api.get(`/user/category/${categoryId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get('/user/featured');
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get all banners
  getBanners: async () => {
    const response = await api.get('/banners');
    return response.data;
  },

  // Like a product
  likeProduct: async (productId) => {
    const response = await api.post(`/likes/${productId}`);
    return response.data;
  },

  // Unlike a product
  unlikeProduct: async (productId) => {
    const response = await api.delete(`/likes/${productId}`);
    return response.data;
  },

  // Get liked products
  getLikedProducts: async () => {
    const response = await api.get('/likes');
    return response.data;
  },

  // Toggle like (combines like/unlike)
  toggleLike: async (productId) => {
    try {
      // First check if already liked
      const likedResponse = await api.get('/likes');
      const isLiked = likedResponse.data.data.some(item => item.product === productId);
      
      if (isLiked) {
        return await userService.unlikeProduct(productId);
      } else {
        return await userService.likeProduct(productId);
      }
    } catch (error) {
      throw error;
    }
  }
};