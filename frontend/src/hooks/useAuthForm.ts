// hooks/useAuthForm.ts - ENHANCED VERSION
import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import * as DocumentPicker from 'expo-document-picker';

export const useAuthForm = (type: 'farmer' | 'customer' | 'delivery' | 'admin') => {
  const router = useRouter();
  const { register } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    license: null as any,
    trn: null as any,
    permit: null as any
  });

  const getRoleNavigationPath = (role: string, status?: string) => {
    // If farmer is pending approval, redirect to pending screen
    if (role === 'farmer' && status === 'pending') {
      return '/(screens)/(auth)/pending-approval';
    }
    
    switch (role) {
      case 'admin':
        return '/(screens)/(admin)/(tabs)/home';
      case 'delivery':
        return '/(screens)/(delivery)/(tabs)/home';
      case 'farmer':
        return '/(screens)/(farmers)/(tabs)/home';
      case 'customer':
      default:
        return '/(screens)/(customers)/(tabs)/home';
    }
  };

  const handleBack = () => {
    if (currentPage === 1) {
      router.replace('/(screens)/(auth)/choice');
    } else {
      setCurrentPage(1);
    }
  };

  const validatePage1 = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      Alert.alert('Error', 'Please fill all fields');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    // Basic phone validation
    if (formData.phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }

    // Password strength
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const validatePage2 = () => {
    if (type === 'farmer') {
      if (!formData.license || !formData.trn || !formData.permit) {
        Alert.alert('Error', 'Please upload all required documents');
        return false;
      }
    }
    return true;
  };

  const handleFileUpload = async (type: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (result.type === 'success') {
        setFormData(prev => ({
          ...prev,
          [type]: result
        }));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleSubmit = async () => {
    if (type !== 'farmer') {
      // Single page for customer, delivery, admin
      if (!validatePage1()) return;
      
      try {
        setLoading(true);
        const result = await register({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: type
        });
        
        const navigationPath = getRoleNavigationPath(type, result.user?.status);
        console.log('Registration successful, navigating to:', navigationPath);
        router.replace(navigationPath);
      } catch (err: any) {
        Alert.alert('Registration Failed', err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Multi-page for farmers
      if (currentPage === 1) {
        if (!validatePage1()) return;
        setCurrentPage(2);
      } else {
        if (!validatePage2()) return;
        
        try {
          setLoading(true);
          const result = await register({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: 'farmer',
            documents: {
              license: formData.license,
              trn: formData.trn,
              permit: formData.permit
            }
          });
          
          const navigationPath = getRoleNavigationPath('farmer', result.user?.status);
          console.log('Farmer registration successful, navigating to:', navigationPath);
          router.replace(navigationPath);
        } catch (err: any) {
          Alert.alert('Registration Failed', err.message);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return {
    showPassword,
    setShowPassword,
    loading,
    currentPage,
    setCurrentPage,
    formData,
    setFormData,
    handleBack,
    handleFileUpload,
    handleSubmit,
    validatePage1,
    validatePage2
  };
};