import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

// Import React-Native Content
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, StatusBar, Alert } from 'react-native';

// Import Supported Content
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native'; 

// Import Icons and Images
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

// Import Services
import { cartService } from '@/services/cartService';
import { orderService } from '@/services/orderService';
import { useAuth } from '@/contexts/AuthContext';

// Define types
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  images?: string[];
}

interface Order {
  id: string;
  items: CartItem[];
  date: string;
  total: string;
  status: string;
  shippingAddress: any;
  paymentMethod: string;
  estimatedDelivery?: string;
}

const shipping = {
  street: '4 Marvic Close',
  city: 'Red Hills',
  state: 'St. Andrew',
  country: 'Jamaica',
  type: 'Home 01',
};

const cards = [
  {
    id: 1,
    type: 'mastercard',
    number: '1234 5678 9012 3456',
    cardholder: 'John Doe',
    expiry: '12/25',
  },
  {
    id: 2,
    type: 'visa',
    number: '1234 5678 9012 3456',
    cardholder: 'Jane Smith',
    expiry: '11/29',
  },
];

const timeslots = [
  {
    id: 1,
    title: '8 AM - 11 AM',
  },
  {
    id: 2,
    title: '11 AM - 12 PM',
  },
  {
    id: 3,
    title: '12 PM - 2 PM',
  },
  { 
    id: 4,
    title: '2 PM - 4 PM',
  },
  {
    id: 5,
    title: '4 PM - 6 PM',
  },
  {
    id: 6,
    title: '6 PM - 8 PM',
  },
];

const Checkout = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingInfo, setShippingInfo] = useState({
    phone: '',
    email: '',
  });
  
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11 AM - 12 PM');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  
  /* Setters, Getters and Handlers */

  const handleDateChange = (event: any, deliverydate?: Date) => {
    const currentDate = deliverydate || tempDate;
    
    setShowDatePicker(Platform.OS === 'ios');
    setTempDate(currentDate);

    if (Platform.OS === 'android' && event.type === 'set') {
      setDate(currentDate);
    }
  };

  const handleDateSelection = () => {
    setDate(tempDate);
    setShowDatePicker(false);
  };

  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);
      
      if (cart.length === 0) {
        Alert.alert('Error', 'Your cart is empty');
        return;
      }

      if (!selectedCard) {
        Alert.alert('Error', 'Please select a payment method');
        return;
      }

      // Prepare order data
      const orderData = {
        items: cart,
        date: new Date().toISOString(),
        total: (
          calculateSubsummarytotal() +
          calculateSubsummarytotal() * 0.15 -
          calculateSubsummarytotal() * 0.3 +
          500
        ).toFixed(2),
        status: 'Confirmed', // Start with confirmed status
        shippingAddress: shipping,
        paymentMethod: selectedCard?.type || 'card',
        estimatedDelivery: `${date.toLocaleDateString()} ${selectedTimeSlot}`,
        customer: user?.name || 'Guest User',
        subtotal: calculateSubsummarytotal(),
        tax: calculateSubsummarytotal() * 0.15,
        discount: calculateSubsummarytotal() * 0.3,
        delivery: 500
      };

      // Use orderService to create order
      const result = await orderService.createOrder(orderData, isAuthenticated);
      
      if (result.success) {
        // Clear cart after successful order
        await cartService.clearLocalCart();
        
        // Navigate to success page with order details
        router.push({
          pathname: '/paymentsuccess',
          params: { 
            orderId: result.order?.id || 'new',
            total: orderData.total 
          }
        });
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  /* Rendering and Loading Constants */

  const renderCards = () => {
    return (
      <View style={styles.cards}>
        {cards.map(card => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, selectedCard?.id === card.id && styles.selectedcard]}
            onPress={() => setSelectedCard(card)}
          >
            <View style={styles.cardinfos}>
              <View style={styles.cardinfo}>
                <Image 
                  source={card.type === 'mastercard' ? icons.mastercard : icons.visa}
                  style={styles.cardtype}
                  tintColor={''}
                />
                <Text style={styles.cardtext}>{card.type}</Text>
              </View>
              <Text style={styles.cardsubtext}>**** **** **** {card.number?.slice(-4)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderItems = () => {
    if (cart.length === 0) {
      return (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.shopButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.itembody}>
        {cart.map((item) => (
          <View key={item.id} style={styles.item}>
            <Image
              source={item.image || item.images?.[0] ? { uri: item.image || item.images?.[0] } : images.noimage}
              style={styles.itemimage}
              resizeMode="cover"
              defaultSource={images.noimage}
            />
            <View style={styles.itemdetails}>
              <Text style={styles.itemtitle}>{item.name}</Text>
              <Text style={styles.itemprice}>
                JMD {item.price} × {item.quantity}
              </Text>
            </View>
            <Text style={styles.itemsummarytotal}>
              JMD {(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const loadCart = async () => {
    try {
      const cartData = await cartService.getCart(isAuthenticated);
      console.log('🛒 Loaded cart items:', cartData);
      
      // Handle different response structures
      let cartItems: CartItem[] = [];
      
      if (Array.isArray(cartData)) {
        cartItems = cartData;
      } else if (cartData && Array.isArray(cartData.items)) {
        cartItems = cartData.items;
      } else if (cartData && Array.isArray(cartData.data)) {
        cartItems = cartData.data;
      }
      
      setCart(cartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    }
  };

  /* Calculation Constants */

  const calculateSubsummarytotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  /* Use-Effects */

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewArea1}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.back}
                onPress={() => router.back()}
              >
                <Image
                  source={icons.left}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <Text style={styles.headertext}>Checkout</Text>            
            </View>
            
            <View style={styles.items}>
              <Text style={styles.itemtext}>Your Items</Text>
              {renderItems()}
            </View>

            <View style={styles.address}>
              <View style={styles.addressheader}>
                <Text style={styles.addresstext}>Address</Text>
                <TouchableOpacity>
                  <Text style={styles.addressubtext}>Add Address</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.addressbody}>
                <View style={styles.addresscontent}>
                  <Image 
                    source={icons.location}
                    tintColor={colors.black}
                    style={styles.smallicon}
                  />
                  <Text style={styles.addresscontentext}>{shipping.type}</Text>
                </View>
                <Text style={styles.addressline}>{shipping.street}, {shipping.city}, {shipping.state},{"\n"}{shipping.country}</Text>
              </View>
            </View>

            <View style={styles.delivery}>
              <View style={styles.deliveryheader}>
                <Text style={styles.deliverytext}>Date & Time</Text>      
                <Text style={styles.deliverysubtext}>e.g. August 14th 2025/8AM - 11AM</Text>                      
              </View>
              <TouchableOpacity
                style={styles.deliverydates}
                onPress={() => setShowDatePicker(true)}
              >
                <Image 
                  source={icons.calendar} 
                  style={styles.icon} 
                  tintColor={colors.black}
                />
                <Text style={styles.deliverydate}>
                  {date.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>

              <View style={styles.times}>
                <ScrollView 
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollViewArea2}
                >
                  {timeslots.map((time) => (
                    <TouchableOpacity 
                      key={time.id} 
                      style={[
                        styles.time,
                        selectedTimeSlot === time.title && styles.selectedTime
                      ]}
                      onPress={() => setSelectedTimeSlot(time.title)}
                    >
                      <Text style={[
                        styles.timetext,
                        selectedTimeSlot === time.title && styles.selectedTimeText
                      ]}>{time.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>          
            </View>

            <View style={styles.payments}>
              <View style={styles.paymentheader}>
                <Text style={styles.paymentext}>Payment</Text>
                <TouchableOpacity>
                  <Text style={styles.paymentsubtext}>Add New</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.payment}>
                {renderCards()}
              </View>
            </View>

            <View style={styles.summaries}>
              <View style={styles.summary}>
                <Text style={styles.summarysubtext}>Sub-total</Text>
                <Text style={styles.summarytext}>JMD {calculateSubsummarytotal().toFixed(2)}</Text>
              </View>
              <View style={styles.summary}>
                <View style={styles.summarytexts}>
                  <Text style={styles.summarysubtext}>Tax (+15%)</Text>
                  <Text style={styles.summarysubtitle}>This applies to all products in every purchase</Text>
                </View>
                <Text style={styles.summarytext}>
                  +JMD {(calculateSubsummarytotal() * 0.15).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summary}>
                <View style={styles.summarytexts}>
                  <Text style={styles.summarysubtext}>Discount (-30%)</Text>
                  <Text style={styles.summarysubtitle}>This discount only applies for the 1st order</Text>
                </View>
                <Text style={styles.summarytext}>
                  -JMD {(calculateSubsummarytotal() * 0.3).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summary}>
                <Text style={styles.summarysubtext}>Delivery</Text>
                <Text style={styles.summarytext}>JMD 500.00 </Text>
              </View>
              <View style={[styles.summary, styles.summarytotal]}>
                <Text style={styles.summarytotaltext}>Total</Text>
                <Text style={styles.summarytotalsubtext}>
                  JMD {(
                    calculateSubsummarytotal() + // sub-total
                    calculateSubsummarytotal() * 0.15 - // tax
                    calculateSubsummarytotal() * 0.3 + // discount
                    500 // delivery
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>    
        </ScrollView>

        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={tempDate}
              mode="date"
              onChange={handleDateChange}
              minimumDate={new Date()}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              textColor={colors.black}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity style={styles.dateConfirmButton} onPress={handleDateSelection}>
                <Text style={styles.dateConfirmText}>Confirm Date</Text>
              </TouchableOpacity>
            )}
          </View>
        )}  
        
        <TouchableOpacity 
          style={[styles.pay, isPlacingOrder && styles.payDisabled]} 
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder || cart.length === 0}
        >
          <Text style={styles.paytext}>
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },

  scrollViewArea1: {
    paddingBottom: 100,
  },

  scrollViewArea2: {
    gap: 6,  
  },

  /* Header */
  header: {
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',    
  },
  
  headertext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 25,
  },

  /* Empty Cart */
  emptyCart: {
    alignItems: 'center',
    padding: 20,
  },

  emptyCartText: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
    color: colors.grey,
    marginBottom: 15,
  },

  shopButton: {
    backgroundColor: colors.fresh,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  shopButtonText: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 14,
    color: colors.white,
  },

  /* Address */
  address: {
    backgroundColor: colors.gallery,
    padding: 30,
    borderRadius: 20,
    flexDirection: 'column',
    gap: 20,
    borderWidth: 1,
  },

  addressheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: colors.charcoal,
    paddingBottom: 10,
    marginTop: 10,
  },
  
  addresstext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 18,
    marginBottom: 10,
  },

  addressubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    marginBottom: 10,
    color: colors.dullGrey,
  },

  addressline: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    marginBottom: 10,
    color: colors.grey,
    lineHeight: 25,
  },
  
  addressbody: {
    flexDirection: 'column',
    gap: 20,
  },

  addresscontent: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  addresscontentext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 18,
    color: colors.charcoal,
  },

  /* Cart */
  items: {
    width: '100%',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 20,
    flexDirection: 'column',
    gap: 20,
  },
  
  itembody: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  itemtext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 24,
    color: colors.dullGrey,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  
  itemdetails: {
    flex: 1,
    marginLeft: 15,
  },
  
  itemtitle: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 16,
  },
  
  itemprice: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  
  itemsummarytotal: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
  },

  itemimage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },

  /* Delivery */
  delivery: {
    backgroundColor: colors.gallery,
    padding: 30,
    borderRadius: 20,
    flexDirection: 'column',
    gap: 20,
    borderWidth: 1,
  },

  deliveryheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: colors.charcoal,
    paddingBottom: 10,
    marginTop: 10,
  },
  
  deliverytext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 18,
    marginBottom: 10,
  },

  deliverysubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 10,
    marginBottom: 10,
    color: colors.dullGrey,
  },

  /* Dates */
  deliverydates: {
    flexDirection: 'row',
    backgroundColor: colors.gallery,
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    gap: 10,
  },

  deliverydate: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 13,
    color: colors.black,
  },

  /* Times */
  times: {
    width: '100%',
  },

  time: {
    backgroundColor: colors.gallery,
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    marginRight: 10,
  },

  selectedTime: {
    backgroundColor: colors.black,
  },

  timetext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.black,
  },

  selectedTimeText: {
    color: colors.white,
  },

  /* Payments */
  payment: {
    width: '100%',
  },

  payments: {
    backgroundColor: colors.gallery,
    padding: 30,
    borderRadius: 20,
    flexDirection: 'column',
    gap: 20,
    borderWidth: 1,
  },

  paymentheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: colors.charcoal,
    paddingBottom: 10,
    marginTop: 10,
  },
  
  paymentext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 18,
    marginBottom: 10,
  },

  paymentsubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    marginBottom: 10,
    color: colors.dullGrey,
  },

  /* Cards */
  cards: {
    flexDirection: 'column',
    marginTop: 15,
    gap: 30,
  },
  
  card: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  
  selectedcard: {
    backgroundColor: '#f1f9f5',
    borderColor: colors.black,
  },

  cardinfos: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 10,
  },

  cardinfo: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  cardtext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 15,
    color: colors.black,
    textTransform: 'capitalize',
  },

  cardtype: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  
  cardsubtext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 12,
    letterSpacing: 9,
  },

  /* Summaries */
  summaries: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    marginVertical: 20,
    padding: 15,
    borderRadius: 15,
    gap: 10,
  },
  
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  summarytexts: {
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
  },

  summarytext: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 14,
    color: colors.black,
  },

  summarytitle: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 10,
    color: colors.black,
  },

  summarysubtitle: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 10,
    color: colors.black,
  },
  
  summarysubtext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 15,
  },
  
  summarytotal: {
    borderTopWidth: 1,
    borderTopColor: colors.gallery,
    paddingTop: 10,
    marginTop: 10,
  },
  
  summarytotaltext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 18,
  },

  summarytotalsubtext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 18,
    color: colors.black,
  },

  /* Add-Ons */
  back: {
    backgroundColor: colors.gallery,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  
  pay: {
    backgroundColor: colors.black,
    padding: 15,
    borderRadius: 15,
    margin: 20,
    alignItems: 'center',
  },

  payDisabled: {
    backgroundColor: colors.dullGrey,
    opacity: 0.6,
  },
  
  paytext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 15,
    color: colors.white,
  },

  /* Date Picker */
  datePickerContainer: {
    backgroundColor: colors.white,
    padding: 20,
  },

  dateConfirmButton: {
    backgroundColor: colors.black,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  dateConfirmText: {
    color: colors.white,
    fontFamily: 'Gilroy-Bold',
    fontSize: 14,
  },

  /* Icons */
  icon: {
    width: 24,
    height: 24,
  },

  smallicon: {
    width: 20,
    height: 20,
  },
});

export default Checkout;