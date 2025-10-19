// contexts/AuthContext.tsx - FIXED VERSION
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services/authService'; // Make sure this import is correct
import api from '@/services/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  membership: string;
  status?: string; // Added status field
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Auth check - token exists:', !!token);
      
      if (token) {
        const userData = await authService.getCurrentUser();
        console.log('User data fetched:', userData);
        setUser(userData.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const data = await authService.login(email, password);
      console.log('Login response:', data);
      
      // Make sure token is being stored
      if (data.token) {
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        console.log('Token stored successfully');
        
        // Update axios default headers
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const register = async (userData: any) => {
    try {
      console.log('Attempting registration:', { ...userData, password: '***' });
      const data = await authService.register(userData);
      console.log('Registration response:', data);
      
      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    authLoading,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};