import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getApiBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  
  // If environment variable is set, use it
  
  if (envUrl) {
    return envUrl.startsWith('http') ? envUrl : `http://${envUrl}`;
  }

  // Development environment detection

  if (__DEV__) {
    // For Android emulator
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3001/api';
    }
    
    // For iOS simulator
    if (Platform.OS === 'ios') {
      return 'http://localhost:3001/api';
    }
    
    // For physical devices
    return 'http://localhost:3001/api';
  }

};

const API_BASE_URL = getApiBaseUrl();

console.log('🌐 API Configuration:', {
  platform: Platform.OS,
  isDev: __DEV__,
  apiUrl: API_BASE_URL
});

console.log('=== API CONFIGURATION ===');
console.log('EXPO_PUBLIC_API_URL from env:', process.env.EXPO_PUBLIC_API_URL);
console.log('Final API_BASE_URL:', API_BASE_URL);
console.log('=========================');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Auth token found:', !!token);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.log('API Error:', error.response?.status, error.config.url);
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('Token expired or invalid, clearing auth data...');
      await AsyncStorage.multiRemove(['authToken', 'userData']);
    }
    
    return Promise.reject(error);
  }
);

export default api;