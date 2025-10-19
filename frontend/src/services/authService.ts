// services/authService.ts - FIXED VERSION
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData: any) {
    // Handle file uploads for farmer registration
    if (userData.role === 'farmer' && userData.documents) {
      const formData = new FormData();
      
      // Add basic user data
      Object.keys(userData).forEach(key => {
        if (key !== 'documents') {
          formData.append(key, userData[key]);
        }
      });
      
      // Add documents as files
      if (userData.documents.license) {
        formData.append('documents[license]', {
          uri: userData.documents.license.uri,
          type: 'application/octet-stream',
          name: 'license.pdf'
        } as any);
      }
      if (userData.documents.trn) {
        formData.append('documents[trn]', {
          uri: userData.documents.trn.uri,
          type: 'application/octet-stream',
          name: 'trn.pdf'
        } as any);
      }
      if (userData.documents.permit) {
        formData.append('documents[permit]', {
          uri: userData.documents.permit.uri,
          type: 'application/octet-stream',
          name: 'permit.pdf'
        } as any);
      }

      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Regular registration for other roles
      const response = await api.post('/auth/register', userData);
      return response.data;
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async logout() {
    await AsyncStorage.multiRemove(['authToken', 'userData']);
    return { success: true, message: 'Logged out successfully' };
  },

  // Password Reset Endpoints - FIXED PATHS
  async forgotPassword(email: string) {
    const response = await api.post('/reset/forgot', { email });
    return response.data;
  },

  async verifyResetCode(userId: string, code: string) {
    const response = await api.post('/reset/verify-code', { userId, code });
    return response.data;
  },

  async resetPassword(userId: string, code: string, newPassword: string) {
    const response = await api.post('/reset/reset', { 
      userId, 
      code, 
      newPassword 
    });
    return response.data;
  },
};