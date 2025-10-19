import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';

// Import Supported Content
import { View, Image, StyleSheet, FlatList, TouchableOpacity, StatusBar, ScrollView, Animated, Text, TextInput, ImageBackground, useColorScheme, ActivityIndicator, Alert } from 'react-native';

// Import Addition Content
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { LinearGradient } from 'expo-linear-gradient';

// Import View and Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
 
// Import Icons, Colors, and Images
import { icons, images } from '@/constants';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

// Import Services
import { cartService } from '@/services/cartService';

const Cart = ({}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  /* Cart-Related Constants */

  const loadCart = async () => {
    try {
      setLoading(true);
      // Use the new cartService
      const data = await cartService.getCart();
      setCart(data.items || data || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, change: number) => {
    try {
      const item = cart.find(i => i.id === productId);
      if (!item) return;

      const newQuantity = item.quantity + change;
      
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        await removeItem(productId);
      } else {
        // Update quantity using cartService
        await cartService.updateCartItem(productId, newQuantity, isAuthenticated);
        // Reload cart to get updated data
        await loadCart();
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await cartService.removeFromCart(productId, isAuthenticated);
      // Reload cart to get updated data
      await loadCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  /* Other Constants */

  const syncCartWithServer = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const localCart = await AsyncStorage.getItem('cart');
      if (localCart) {
        const cartItems = JSON.parse(localCart);
        // Sync local cart to server
        for (const item of cartItems) {
          await cartService.addToCart(item.id, item.quantity);
        }
        // Clear local cart after sync
        await AsyncStorage.removeItem('cart');
        // Reload from server
        await loadCart();
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  }, [isAuthenticated]);

  /* Calculating Constants */

  const calculateTotal = () => {
    if (!Array.isArray(cart)) return 0;
    
    return cart.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  // Update the calculateTotalItems function
  const calculateTotalItems = () => {
    if (!Array.isArray(cart)) return 0;
    
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  /* Use Focus-Effect/Effect */

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && !authLoading) {
        syncCartWithServer();
      }
    }, [isAuthenticated, authLoading, syncCartWithServer])
  );

  useEffect(() => {
    loadCart();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.fresh} />
          <Text style={styles.loadingtext}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"  />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headertext}>My Cart</Text>
            </View>

            <View style={styles.cart}>
              {cart.length > 0 ? (
                <View style={styles.cartview}>
                  {cart.map((item) => (
                      <View key={item.id} style={styles.product}>
                        <View style={styles.productimage}>
                          <Image
                            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                            style={styles.largeimage}
                            resizeMode='cover'               
                          />
                        </View>

                        <View style={styles.productinfo}>
                          <View style={styles.productexts}>
                            <Text style={styles.productext}>{item.name}</Text>
                            
                            <Text style={styles.productsub}>
                              <Text style={styles.productsubprice}>JMD </Text>
                              {item.price}
                              <Text style={styles.productsubper}> /kg</Text>
                            </Text>
                          </View>

                          <Text style={styles.productsubtext}>
                            JMD ${(item.price * item.quantity).toFixed(2)}
                            <Text style={styles.productsubper}> total</Text>
                          </Text>
                        </View>

                        <View style={styles.productquantities}>
                          <TouchableOpacity onPress={() => removeItem(item.id)}>
                            <Image
                              source={icons.close}
                              style={styles.smallicon}
                              tintColor='rgba(0, 0, 0, 0.1)'                            
                            />
                          </TouchableOpacity>

                          <View style={styles.productquantity}>
                            <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                              <Image
                                source={icons.minus}
                                style={styles.tinyicon}
                                tintColor='rgba(0, 0, 0, 0.2)'
                              />
                            </TouchableOpacity>

                            <Text style={styles.productquantitytext}>{item.quantity}</Text>

                            <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                              <Image
                                source={icons.plus}
                                style={styles.tinyicon}
                                tintColor='rgba(0, 0, 0, 0.2)'
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                  ))}
                </View>
              ) : (
                <View style={styles.defaultview}>
                  <Text style={styles.defaultext}>Your cart is empty!</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.cartopayment}>
          <View style={styles.totalsandfees}>
            <View style={styles.subtotals}>
              <Text style={styles.subtotal}>
                Subtotal ({calculateTotalItems()} items)
              </Text>
              <Text style={styles.subtotalprice}>
                JMD ${calculateTotal().toFixed(2)}
              </Text>    
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.checkouts, cart.length === 0 && styles.checkoutdisabled]}
            onPress={() => router.push('/checkout')} 
            disabled={cart.length === 0}
          >
            <View style={styles.checkoutotals}>
              <Text style={styles.checkoutotal}>
                JMD ${calculateTotal().toFixed(2)}
              </Text>
            </View>

            <View style={styles.checkout}>
              <Text style={styles.checkoutext}>Checkout</Text>
              <Image
                source={icons.right}
                tintColor={colors.white}
                style={styles.tinyicon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },

  scrollViewContent: {
    height: '100%',
    width: '100%',
    marginBottom: 80,
    marginTop: 20,
  },

  container: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  /* Views */

  defaultview: {
    width: '100%',
    height: 800,
  },

  cartview: {
    flexDirection: 'column',
    width: '90%',
    height: 1200,
    gap: 25,
    marginTop: 25,
  },

  /* Cart */

  cart: {
    width: '90%',
    height: 'auto',
  },

  /* Default */

  defaultext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.3)',
  },

  /* Header */

  header: {
    width: '90%',
    marginBottom: 20,
    marginTop: 20,
  },

  headertext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 25,
    color: colors.black,
  },

  /* Product */

  product: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: colors.dullGrey,
    paddingBottom: 10,
    height: 100,
  },

  productinfo: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  productexts: {
    flexDirection: 'column',
    gap: 5,
  },

  productext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 17,
    color: colors.black,
  },

  productsubtext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
    color: colors.black,
  },

  productsub: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 12,
    color: colors.black,
  },

  productsubprice: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.3)',
    marginBottom: 10,
  },

  productsubper: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.3)',
  },

  productquantities: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',  
  },

  productquantity: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  productquantitytext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 12,
    color: colors.black,
  },

  productotaltext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 15,
    color: colors.white,
  },

  productotalsubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.emerald,
  },

  productimage: {
    height: 90,
    width: 100,
    backgroundColor: colors.white,
    justifyContent:'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 12,
  },

  /* Checkout */
  
  cartopayment: {
    alignItems: 'center',
    width: '80%',
    marginBottom: 110,
    flexDirection: 'column',
    gap: 15,
  },

  /* Promo */

  promo: {
    width: '100%',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  promocode: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  promotext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 10,
    color: colors.black,
    marginLeft: 4,
  },

  promoinput: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 12,
    color: colors.black,
  },

  /* Totals and Fees */

  totalsandfees: {
    width: '100%',
    flexDirection: 'column',
    gap: 20,
  },

  subtotals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  subtotal: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 14,
    color: colors.black,
  },

  subtotalprice: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 14,
    color: colors.black,
  },

  fees: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  fee: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 14,
    color: colors.black,
  },

  feeprice: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 14,
    color: colors.black,
  },

  discounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  discount: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  discountext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 14,
    color: colors.black,
  },

  discountsubtext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 10,
    color: colors.dullGrey,
  },

  discountprice: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 14,
    color: colors.black,
  },

  taxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  tax: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  taxtext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 14,
    color: colors.black,
  },

  taxsubtext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 10,
    color: colors.dullGrey,
  },

  taxprice: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 14,
    color: colors.black,
  },
  
  /* Checkout */

  checkouts: {
    backgroundColor: colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    width: '100%',
    marginTop: 10,
  },

  checkoutotals: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 5,
  },

  checkoutotal: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 18,
    color: colors.white,
  },

  /* Pagination */

  pagination: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    top: 200,
    width: '100%',
    marginVertical: 10,
  },

  dot: {
    height: 7,
    width: 7,
    borderRadius: 4,
    margin: 5,
  },

  active: {
    backgroundColor: colors.emerald,
    width: 15,
  },

  inactive: {
    backgroundColor: colors.white,
  },

  /* Add-Ons */

  checkout: {
    flexDirection: 'row',
    gap: 5,
  },

  checkoutext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 18,
    color: colors.white,
  },

  checkoutdisabled: {
    backgroundColor: colors.charcoal,
    opacity: 0.9,
  },

  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  loadingtext: {
    marginTop: 10,
    fontFamily: 'Gilroy-Medium',
    color: colors.gray,
  },

  /* Images, */

  smallimage: {
    height: 80,
    width: 80,
  },

  largeimage: {
    height: '100%',
    width: '100%',
  },

  /* Icons */

  icon: {
    height: 40,
    width: 40,
  },

  smallicon: {
    height: 10,
    width: 10,
  },

  tinyicon: {
    height: 25,
    width: 25,
  },

});

export default Cart;