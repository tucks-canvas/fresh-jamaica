import React, { createContext, useState, useContext, useEffect } from 'react';
import { productService } from '@/services/productService';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: string;
  title: string;
  name: string;
  seller: string;
  description: string;
  about: string;
  nutrition: string;
  fact: string;
  category: string; // Changed to string to match backend
  grading: string;
  topic: string;
  price: number;
  discountPrice: number;
  percentage: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  vitamin: number;
  potassium: number;
  images: string[];
  stock: number;
  unit: string;
  soldCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchMyProducts: () => Promise<void>;
  createProduct: (productData: any) => Promise<Product>;
  updateProduct: (id: string, productData: any) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isAuthenticated || user?.role !== 'farmer') {
        console.log('User not authenticated or not a farmer');
        setProducts([]);
        return;
      }

      const data = await productService.getMyProducts();
      console.log('📦 Farmer products loaded:', data);
      setProducts(data.products || []);
    } 
    catch (err: any) {
      console.error('Error fetching farmer products:', err);
      
      if (err.response?.status === 404) {
        console.log('🔄 my-products endpoint not found, trying all products');
        const allData = await productService.getProducts();
        // Filter products by sellerId if available, or show all for demo
        const farmerProducts = allData.products || [];
        setProducts(farmerProducts);
      } 
      else {
        setError(err.response?.data?.message || 'Failed to fetch your products');
      }
    } finally {
      setLoading(false);
    }
  };


  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts();
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: any): Promise<Product> => {
    try {
      setLoading(true);
      setError(null);
      
      // Map data to match backend expectations
      const mappedData = {
        name: productData.name,
        title: productData.title,
        seller: productData.seller,
        description: productData.description,
        about: productData.about,
        nutrition: productData.nutrition,
        fact: productData.fact,
        category: productData.category.toString(),
        grading: productData.grading,
        topic: productData.topic,
        price: productData.price,
        discountPrice: productData.discount,
        percentage: productData.percentage,
        calories: productData.calories,
        carbs: productData.carbs,
        protein: productData.protein,
        fat: productData.fat,
        fiber: productData.fiber,
        vitamin: productData.vitamin,
        potassium: productData.potassium,
        images: productData.image ? [productData.image] : [],
        stock: productData.stock || 0,
        unit: productData.unit || 'kg'
      };
      
      const data = await productService.createProduct(mappedData);
      setProducts(prev => [data.product, ...prev]);
      return data.product;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create product';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: any): Promise<Product> => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? data.product : p));
      return data.product;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update product';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete product';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    await fetchMyProducts();
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id.toString() === id.toString());
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'farmer') {
      fetchMyProducts();
    }
  }, [isAuthenticated, user?.role]);

  const value: ProductsContextType = {
    products,
    loading,
    error,
    fetchProducts: fetchMyProducts,
    fetchMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchMyProducts,
    getProductById,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};