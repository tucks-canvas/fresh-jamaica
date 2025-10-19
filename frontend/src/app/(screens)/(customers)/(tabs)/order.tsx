import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

// Import React-Native Content
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Animated, ActivityIndicator } from 'react-native';

// Import Other Supported Content
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Colors, Icons, and Images
import colors from '@/constants/colors';
import { icons, images } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

// Import Services
import { orderService } from '@/services/orderService';

/* Interfaces */

interface OrderItem {
  id: string;
  title: string;
  name?: string;
  quantity: number;
  price: number;
  image: any;
}

interface Order {
  id: string;
  status: string;
  date: string;
  createdAt?: string;
  customer: string;
  items: OrderItem[];
  subtotal?: number;
  delivery?: number;
  discount?: number;
  tax?: number;
  total?: number;
}

interface ProgressSegmentProps {
  active: boolean;
  current: boolean;
  isLast: boolean;
}

interface ProgressBarProps {
  status: string;
}

/* Order Stages */

const orderstages = [
  { 
    id: 1, 
    status: 'Order Placed', 
    text: 'Your order has been placed and is being processed. We will notify you once it moves to the next stage.' 
  },
  { 
    id: 2, 
    status: 'Pending', 
    text: 'Your order is pending confirmation. Please wait while we verify your details and payment.' 
  },
  { 
    id: 3, 
    status: 'Confirmed', 
    text: 'Your order has been confirmed. Our team is preparing everything for fulfillment.' 
  },
  { 
    id: 4, 
    status: 'Processing', 
    text: 'Your order is being prepared. We are carefully packing your items for delivery.' 
  },
  { 
    id: 5, 
    status: 'In-Transit', 
    text: 'Your order is on the way. Track your delivery as it makes its way to you.' 
  },
  { 
    id: 6, 
    status: 'Delivered', 
    text: 'Your order has been delivered. We hope you enjoy your purchase and shop again soon.'
  },
];

const Order = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [animation] = useState(new Animated.Value(0));

  /* Order Functions */

  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log('📦 Loading orders, authenticated:', isAuthenticated);
      
      const data = await orderService.getMyOrders(isAuthenticated);
      console.log('📦 Orders data:', data);
      
      // Handle different response structures
      let ordersData: Order[] = [];
      
      if (Array.isArray(data)) {
        ordersData = data;
      } else if (data && Array.isArray(data.orders)) {
        ordersData = data.orders;
      } else if (data && Array.isArray(data.data)) {
        ordersData = data.data;
      }
      
      setOrders(ordersData);
      console.log(`📦 Loaded ${ordersData.length} orders`);
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setExpandedOrderId(orderId);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  /* Progress Components */

  const ProgressSegment = ({ active, current, isLast }: ProgressSegmentProps) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (active && current) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0.3,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }, [active, current, fadeAnim]);

    return (
      <Animated.View
        style={[
          styles.segment,
          active ? styles.activesegment : styles.inactivesegment,
          { opacity: current ? fadeAnim : 1 },
          isLast && { marginRight: 0 } 
        ]}
      />
    );
  };

  const ProgressBar = ({ status }: ProgressBarProps) => {
    const currentStageIndex = orderstages.findIndex(stage => stage.status === status);
    const normalizedStatus = currentStageIndex === -1 ? 0 : currentStageIndex;
    
    return (
      <View style={styles.progresses}>
        <View style={styles.progress}>
          {orderstages.map((stage, index) => (
            <ProgressSegment
              key={stage.id}
              active={index <= normalizedStatus}
              current={index === normalizedStatus}
              isLast={index === orderstages.length - 1}
            />
          ))}
        </View>

        <View style={styles.progresstext}>
          <Text style={styles.progressubtext}>
            {orderstages[normalizedStatus]?.text || 'Order processing...'}
          </Text>
        </View>
      </View>
    );
  };

  /* Helper Functions */

  const getOrderStatus = (status: string) => {
    const validStatuses = orderstages.map(stage => stage.status);
    return validStatuses.includes(status) ? status : 'Order Placed';
  };

  const calculateOrderTotals = (order: Order) => {
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = order.delivery || 500;
    const discount = order.discount || subtotal * 0.30; // 30% discount
    const tax = order.tax || subtotal * 0.15; // 15% tax
    const total = subtotal + delivery - discount + tax;
    
    return { subtotal, delivery, discount, tax, total };
  };

  /* Use-Focus Effects */

  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Order screen focused');
      loadOrders();
    }, [isAuthenticated])
  );

  /* Loading State */

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.fresh} />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headertext}>My Orders</Text>
            </View>

            <View style={styles.body}>
              {orders.length > 0 ? (
                <View style={styles.orderview}>
                  {orders.map((order) => {
                    const totals = calculateOrderTotals(order);
                    return (
                      <TouchableOpacity
                        key={order.id}
                        activeOpacity={0.8}
                        style={styles.order}
                        onPress={() => toggleOrder(order.id)}
                      >
                        <View style={styles.ordersnippets}>
                          <View style={styles.orderheader}>
                            <View style={styles.ordersnippet}>
                              <Text style={styles.orderstatus}>{getOrderStatus(order.status)}</Text>
                              
                              <Text style={styles.orderdate}>
                                {new Date(order.date || order.createdAt || Date.now()).toLocaleString()}
                              </Text>
                            </View>

                            <TouchableOpacity
                              onPress={() => toggleOrder(order.id)}
                            >
                              <Image
                                source={expandedOrderId === order.id ? icons.up : icons.down}
                                style={styles.icon}
                              />
                            </TouchableOpacity>
                          </View>
                          
                          <ProgressBar status={getOrderStatus(order.status)} />
                        </View>

                        {expandedOrderId === order.id && (
                          <Animated.View style={styles.orderinfo}>
                            <View style={styles.orderitems}>
                              {order.items.map((item) => (
                                <View key={item.id} style={styles.product}>
                                  <View style={styles.productimage}>
                                    <Image
                                      source={item.image}
                                      style={styles.largeimage}
                                      resizeMode="cover"
                                    />
                                  </View>
                                  
                                  <View style={styles.productdetail}>
                                    <Text style={styles.productext}>{item.title || item.name}</Text>
                                    <Text style={styles.productper}>Qty: {item.quantity}</Text>
                                  </View>

                                  <View style={styles.productprice}>
                                    <Text style={styles.productsubtext}>
                                      <Text style={styles.productprice}>JMD </Text> {item.price}
                                      <Text style={styles.productper}> /kg</Text>
                                    </Text>
                                  </View>
                                </View>
                              ))}
                            </View>

                            <View style={styles.orderoverviews}>
                              <View style={styles.orderoverview}>
                                <Text style={styles.orderoverviewtext}>Subtotal</Text>
                                <Text style={styles.orderoverviewsubtext}>
                                  JMD ${totals.subtotal.toFixed(2)}
                                </Text>              
                              </View>

                              <View style={styles.orderoverview}>
                                <Text style={styles.orderoverviewtext}>Delivery</Text>
                                <Text style={styles.orderoverviewsubtext}>
                                  JMD ${totals.delivery.toFixed(2)}
                                </Text>              
                              </View>

                              <View style={styles.orderoverview}>
                                <Text style={styles.orderoverviewtext}>Discount</Text>
                                <Text style={styles.orderoverviewsubtext}>
                                  JMD ${totals.discount.toFixed(2)}
                                </Text>              
                              </View>

                              <View style={styles.orderoverview}>
                                <Text style={styles.orderoverviewtext}>Tax</Text>
                                <Text style={styles.orderoverviewsubtext}>
                                  JMD ${totals.tax.toFixed(2)}
                                </Text>              
                              </View>
                            </View>

                            <View style={styles.orderfooter}>
                              <Text style={styles.ordertotaltext}>Total</Text>
                              <Text style={styles.ordertotal}>
                                JMD ${totals.total.toFixed(2)}
                              </Text>
                            </View>
                          </Animated.View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.defaultview}>
                  <Text style={styles.emptyText}>You have no orders yet.</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

// ... keep your existing styles, but add these new ones:

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },

  scrollViewContent: {
    height: '100%',
    width: '100%',
    paddingBottom: 80,
    paddingTop: 20,
  },
  
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
    color: colors.grey,
  },

  emptyText: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
    color: colors.grey,
    textAlign: 'center',
    marginBottom: 20,
  },

  shopButton: {
    backgroundColor: colors.fresh,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  shopButtonText: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
    color: colors.white,
  },

  /* Header */

  header: {
    width: '90%',
    height: 'auto',
    paddingVertical: 20,
    marginBottom: 5,
  },
  
  headertext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 25,
    color: colors.black,
  },

  /* Body */
  
  body: {
    width: '90%',
  },

  /* Views */

  defaultview: {
    width: '100%',
  },
  
  orderview: {
    flexDirection: 'column',
    width: '100%',
    gap: 15,
  },

  /* Order */
  order: {
    width: '90%',
    backgroundColor: colors.gallery,
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },

  orderheader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ordersnippets: {
    flexDirection: 'column',
    gap: 5,
  },

  ordersnippet: {
    flexDirection: 'column',
    gap: 5,
  },

  orderinfo: {
    marginTop: 15,
    width: '100%',
  },

  orderstatus: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 25,
    color: colors.black,
  },

  orderdate: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 13,
    color: colors.dullGrey,
  },

  chevron: {
    width: 20,
    height: 20,
    tintColor: colors.black,
  },

  orderitems: {
    flexDirection: 'column',
    gap: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    paddingBottom: 25,
    borderColor: 'rgba(0,0,0,0.1)',
    paddingTop: 35,
  },
  
  orderfooter: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ordertotal: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 25,
    color: colors.black,
    textAlign: 'right',
  },
  
  ordertotaltext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.black,
  },

  orderoverviews: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 20,
  },

  orderoverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderoverviewtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.black,
  },

  orderoverviewsubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.black,
  },

  /* Product */

  product: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  
  productdetail: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 7,
    flex: 1,
    marginHorizontal: 15,
  },
    
  productext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
    color: colors.black,
  },
  
  productsubtext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 15,
    color: colors.black,
  },
  
  productprice: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.3)',
    marginBottom: 10,
  },
  
  productper: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.3)',
  },

  productimage: {
    backgroundColor: colors.white,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    height: 56,
    width: 58,
    borderRadius: 15,
    elevation: 10,
  },

  /* Add-Ons */

  progresses: {
    marginBottom: 5,
  },

  progress: {
    flexDirection: 'row',
    marginTop: 12,
    height: 4,
    width: '100%',
    gap: 5,
  },

  progresstext: { 
    marginTop: 8, 
    marginBottom: 8, 
  },
  
  progressubtext: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 15,
    lineHeight: 20,
    color: colors.dullGrey,
  },

  segment: {
    flex: 1,
    height: '100%',
    marginRight: 2,
    borderRadius: 2,
  },
  
  activesegment: {
    backgroundColor: colors.fresh, 
  },
  
  inactivesegment: {
    backgroundColor: colors.lightGrey, 
  },

  /* Image */

  largeimage: {
    height: '100%',
    width: '100%',
  },

  /* Icon */

  icon: {
    width: 20,
    height: 20,
  },
});

export default Order;