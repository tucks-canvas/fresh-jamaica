import api from './api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const productService = {
  async getProducts(category = null, search = null, page = 1, limit = 20) {
    const params = { page, limit };
    
    if (category && category !== 'all' && category !== 'null') {
      params.category = category;
    }
    
    if (search) params.search = search;

    console.log('📡 Making products API call with params:', params);
    
    const response = await api.get('/products', { params });
    console.log('📡 Products API response structure:', response.data);
    return response.data;
  },

  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(productData) {
    const mappedData = {
      ...productData,
      discountPrice: productData.discount,
      images: productData.image ? [productData.image] : []
    };
    
    const response = await api.post('/products', mappedData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const mappedData = {
      ...productData,
      discountPrice: productData.discount,
      images: productData.image ? [productData.image] : []
    };
    
    const response = await api.put(`/products/${id}`, mappedData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async getMyProducts() {
    const response = await api.get('/products/my-products');
    return response.data;
  },
};