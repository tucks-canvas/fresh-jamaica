import api from './api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const LIKES_STORAGE_KEY = 'freshja_likes';

export const likeService = {
  // ===== SERVER LIKE OPERATIONS =====
  async getLikedProducts() {
    const response = await api.get('/likes');
    return response.data;
  },

  async toggleLike(productId) {
    const response = await api.post('/likes/toggle', { productId });
    return response.data;
  },

  async likeProduct(productId) {
    const response = await api.post('/likes', { productId });
    return response.data;
  },

  async unlikeProduct(productId) {
    const response = await api.delete(`/likes/${productId}`);
    return response.data;
  },

  // ===== LOCAL LIKE OPERATIONS =====
  async getLocalLikes() {
    try {
      const likesJson = await AsyncStorage.getItem(LIKES_STORAGE_KEY);
      return likesJson ? JSON.parse(likesJson) : [];
    } catch (error) {
      console.error('Error getting local likes:', error);
      return [];
    }
  },

  async saveLocalLikes(likes) {
    try {
      await AsyncStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
    } catch (error) {
      console.error('Error saving local likes:', error);
      throw error;
    }
  },

  async toggleLocalLike(productId, product) {
    try {
      const currentLikes = await likeService.getLocalLikes();
      const isLiked = currentLikes.some(item => item.id === productId);
      
      let updatedLikes;
      if (isLiked) {
        updatedLikes = currentLikes.filter(item => item.id !== productId);
      } else {
        updatedLikes = [...currentLikes, {
          id: productId,
          title: product.name,
          seller: product.seller,
          price: product.price,
          image: product.images?.[0] || product.image,
          grading: product.grading
        }];
      }
      
      await likeService.saveLocalLikes(updatedLikes);
      return updatedLikes;
    } catch (error) {
      console.error('Error toggling local like:', error);
      throw error;
    }
  },

  // ===== SYNC OPERATIONS =====
  async syncLikesWithServer() {
    try {
      const localLikes = await likeService.getLocalLikes();
      
      if (localLikes.length === 0) return { success: true, message: 'No local likes to sync' };

      // Add all local likes to server
      for (const likedProduct of localLikes) {
        await likeService.toggleLike(likedProduct.id);
      }
      
      // Clear local likes after successful sync
      await AsyncStorage.removeItem(LIKES_STORAGE_KEY);
      
      console.log('Likes synced successfully with server');
      return { success: true, message: 'Likes synced successfully' };
    } catch (error) {
      console.error('Error syncing likes with server:', error);
      throw error;
    }
  },

  // ===== DEBUG UTILITIES =====
  async debugLikes() {
    try {
      const localLikes = await likeService.getLocalLikes();
      console.log('❤️ Local likes:', localLikes);
      
      try {
        const serverLikes = await likeService.getLikedProducts();
        console.log('❤️ Server likes:', serverLikes);
      } catch (serverError) {
        console.log('❤️ Could not fetch server likes:', serverError.message);
      }
    } catch (error) {
      console.error('Error debugging likes:', error);
    }
  }
};