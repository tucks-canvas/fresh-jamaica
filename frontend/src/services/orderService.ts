import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDERS_STORAGE_KEY = 'freshja_orders';

export const orderService = {
  // Create order
  async createOrder(orderData: any, isAuthenticated: boolean = false) {
    try {
      if (isAuthenticated) {
        const response = await api.post('/orders', orderData);
        return response.data;
      } else {
        // Store order locally
        return await this.createLocalOrder(orderData);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get user's orders
  async getMyOrders(isAuthenticated: boolean = false) {
    try {
      if (isAuthenticated) {
        const response = await api.get('/orders/my-orders');
        return response.data;
      } else {
        return await this.getLocalOrders();
      }
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  },

  // Get specific order
  async getOrder(id: string, isAuthenticated: boolean = false) {
    try {
      if (isAuthenticated) {
        const response = await api.get(`/orders/${id}`);
        return response.data;
      } else {
        const orders = await this.getLocalOrders();
        return orders.find(order => order.id === id) || null;
      }
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  },

  // Local storage operations
  async getLocalOrders() {
    try {
      const ordersJson = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      return ordersJson ? JSON.parse(ordersJson) : [];
    } catch (error) {
      console.error('Error getting local orders:', error);
      return [];
    }
  },

  async createLocalOrder(orderData: any) {
    try {
      const currentOrders = await this.getLocalOrders();
      const newOrder = {
        id: `local_${Date.now()}`,
        ...orderData,
        createdAt: new Date().toISOString(),
        status: 'Confirmed'
      };
      
      const updatedOrders = [newOrder, ...currentOrders];
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
      
      return { success: true, order: newOrder };
    } catch (error) {
      console.error('Error creating local order:', error);
      throw error;
    }
  },

  async updateOrderStatus(id: string, status: string, isAuthenticated: boolean = false) {
    try {
      if (isAuthenticated) {
        const response = await api.put(`/orders/${id}/status`, { status });
        return response.data;
      } else {
        // Update local order status
        const orders = await this.getLocalOrders();
        const updatedOrders = orders.map(order => 
          order.id === id ? { ...order, status } : order
        );
        await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async cancelOrder(id: string, isAuthenticated: boolean = false) {
    try {
      if (isAuthenticated) {
        const response = await api.put(`/orders/${id}/cancel`);
        return response.data;
      } else {
        return await this.updateOrderStatus(id, 'Cancelled', false);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

  // Sync local orders with server when user logs in
  async syncOrdersWithServer() {
    try {
      const localOrders = await this.getLocalOrders();
      
      if (localOrders.length === 0) return { success: true, message: 'No local orders to sync' };

      // Add all local orders to server
      for (const order of localOrders) {
        await this.createOrder(order, true);
      }
      
      // Clear local orders after successful sync
      await AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
      
      console.log('Orders synced successfully with server');
      return { success: true, message: 'Orders synced successfully' };
    } catch (error) {
      console.error('Error syncing orders with server:', error);
      throw error;
    }
  }
};