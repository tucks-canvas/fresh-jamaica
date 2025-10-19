import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useProducts } from '@/contexts/ProductsContext';
import { useAuth } from '@/contexts/AuthContext';

/* Import React-Native Content */
import { View, Image, StyleSheet, PanResponder, Animated, TouchableOpacity, StatusBar, ScrollView, Text, TextInput, ImageBackground, ActivityIndicator, Alert } from 'react-native';

/* Import Other Supported Content */
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
 
/* Import Icons, Colors, and Images */
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

const timeCategories = [
  { id: '0', name: 'Today' },
  { id: '1', name: 'Past 3 Days' },
  { id: '2', name: 'Past 7 Days' },
  { id: '3', name: 'Month' },
  { id: '4', name: 'Year' },
];

const Home = ({}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { products, loading, fetchMyProducts } = useProducts();

  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(timeCategories[0].name);
  const [currentSummaryIndex, setCurrentSummaryIndex] = useState(0);

  const [toggleLocation, setToggleLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Deepolie Street, 42');
  const [savedLocations, setSavedLocations] = useState([
    'Deepolie Street, 42',
    '123 Business Ave',
    '456 Residential Rd'
  ]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState('');

  const [showProfileDropdown, setShowProfileDropdown] = useState(true);

  const [pan] = useState(new Animated.Value(0));
  const [filterHeight, setFilterHeight] = useState('60%');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        pan.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          setFilterHeight('100%');
        } 
        else if (gestureState.dy > 50) {
          setFilterHeight('60%');
        }
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  /* Load products on focus */
  useEffect(() => {
    fetchMyProducts();
  }, []);

  /* Calculate real statistics from products */
  const calculateStats = () => {
    const totalProducts = products.length;
    
    // Use soldCount or default to 0
    const totalSold = products.reduce((sum, product) => sum + (product.soldCount || product.sold || 0), 0);
    const totalRevenue = products.reduce((sum, product) => {
      const sold = product.soldCount || product.sold || 0;
      const price = product.price || 0;
      return sum + (sold * price);
    }, 0);

    // Get top selling products
    const topProducts = products
      .filter(p => (p.soldCount || p.sold || 0) > 0)
      .sort((a, b) => (b.soldCount || b.sold || 0) - (a.soldCount || a.sold || 0))
      .slice(0, 4)
      .map(product => ({
        id: product.id,
        name: product.name || product.title,
        sold: product.soldCount || product.sold || 0,
        stock: product.stock || 0,
        price: `JMD ${product.price}`,
        image: product.images?.[0] || product.image || images.placeholder,
      }));

    // Get top revenue products
    const topRevenue = products
      .filter(p => (p.soldCount || p.sold || 0) > 0)
      .map(product => ({
        id: product.id,
        name: product.name || product.title,
        amount: (product.soldCount || product.sold || 0) * (product.price || 0),
        price: `JMD ${product.price}`,
        sold: product.soldCount || product.sold || 0,
        image: product.images?.[0] || product.image || images.placeholder,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);

    return {
      products: {
        period: selectedCategory,
        sold: totalSold,
        total: totalProducts,
        details: topProducts,
      },
      sales: {
        period: selectedCategory,
        amount: totalRevenue,
        details: topRevenue,
      },
    };
  };

  const stats = calculateStats();

  const summaries = [
    {
      key: 'profits',
      image: images.accents5,
      title1: 'Check out the',
      title2: `revenue for this \nmonth`,
      value1: 'JMD',
      value2: `${stats.sales.amount.toLocaleString()}`,
      isProfit: true,
    },
    {
      key: 'sales',
      image: images.accents5,
      title1: 'Check out the',
      title2: 'sales for this \nmonth',
      value1: stats.products.sold.toString(),
      value2: `/ ${stats.products.total} sold`,
      isProfit: false,
    },
  ];

  /* Getters and Handlers Constants */
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let address = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
    
    if (address.length > 0) {
      const firstAddress = address[0];
      const locationString = [
        firstAddress.streetNumber,
        firstAddress.street,
        firstAddress.city,
        firstAddress.region
      ].filter(Boolean).join(', ');
      
      if (locationString) {
        setCurrentLocation(locationString);
      }
    }
  };

  /* Other Constants */
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  const toggleCard = (card: string) => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  const generateStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Image
          key={`full-${i}`}
          source={icons.starfill}
          style={styles.smallicon}
          tintColor={colors.black}
        />
      );
    }

    if (halfStar) {
      stars.push(
        <Image
          key={`half`}
          source={icons.starfill}
          style={styles.smallicon}
          tintColor={colors.black}
        />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Image
          key={`empty-${i}`}
          source={icons.star}
          style={styles.smallicon}
          tintColor={'rgba(0,0,0,0.2)'}
        />
      );
    }
    return stars;
  };

  /* Use-Effects */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSummaryIndex((prev) => (prev + 1) % summaries.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [summaries.length]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.jewel} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ImageBackground
          imageStyle={styles.backgroundOverlay}
          style={styles.backgroundSpace}
          source={images.backdrop3}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollViewContent1}
          >
            <View style={styles.container}>
              <View style={styles.header}>
                <View style={styles.headerleft}>
                  <TouchableOpacity 
                    style={styles.headertop}
                    onPress={() => setToggleLocation(!toggleLocation)}
                  >
                    <Image
                      source={icons.location}
                      style={styles.icon}
                      tintColor={colors.black}
                    />  
                  </TouchableOpacity>

                  <View style={styles.headerbody}>
                    <Text style={styles.headerbodytext}>Pickup Location</Text>
                    <Text style={styles.headerbodysub}>
                      {truncateText(currentLocation, 20)}
                    </Text>
                  </View>
                </View>

                <View style={styles.headerbot}>
                  <TouchableOpacity onPress={() => router.push('/(farmers)/(notifications)')}>
                    <Image
                      source={icons.notification}
                      style={styles.icon}
                      tintColor={colors.black}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.profiles}>
                <View>
                  <ImageBackground 
                    style={styles.profileSpace}
                    imageStyle={styles.profileOverlay}
                    source={images.backdrop3}
                    resizeMode='cover'
                  >
                    <View style={styles.profile}>             
                      <View style={styles.profileinfo}>
                        <View style={styles.profileimage}>
                          <Image
                            source={images.photo4}
                            style={styles.largeimage}
                            resizeMode="cover"
                          />
                        </View> 

                        <View style={styles.profilehead}>
                          <Text style={styles.profiletext}>{user?.fullName || 'Farm Owner'}</Text>
                          <Text style={styles.profilesubtext}>{user?.role === 'farmer' ? 'Your Farm' : 'Business'}</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowProfileDropdown((prev) => !prev)}
                        style={styles.profilebot}
                      >
                        <Image
                          source={showProfileDropdown ? icons.up : icons.down}
                          style={styles.alticon}
                          tintColor={colors.dullGrey}
                        />
                      </TouchableOpacity>
                    </View>

                    {showProfileDropdown && (
                      <View style={styles.profiledropdown}>
                        <View style={styles.profiledropdownrow1}>
                          <Text style={styles.profiledropdownsubtext}>Member since 2024</Text>
                          <Text style={styles.profiledropdowntext}>A+</Text>
                        </View>

                        <View style={styles.profiledropdownrow2}>
                          {generateStars(4.5)}
                          <Text style={styles.profiledropdowntitle}>4.5 stars</Text>
                        </View>
                        
                        <Text style={styles.profiledropdownsubtitle}>
                          Welcome to your farm dashboard! Manage your products, track sales, and grow your business.
                        </Text>

                        <View style={styles.profileproducts}>
                          <Text style={styles.profileproductstitle}>Recent Products</Text>
                          
                          <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                          >
                            {products.slice(0, 3).map((product) => (
                              <View 
                                key={product.id} 
                                style={styles.profileproduct}
                              >
                                <Image 
                                  source={typeof product.images?.[0] === 'string' ? { uri: product.images[0] } : product.images?.[0] || images.placeholder} 
                                  style={styles.profileproductimage} 
                                />
                                <Text style={styles.profileproductext}>{product.name || product.title}</Text>
                              </View>
                            ))}

                            <TouchableOpacity 
                              style={styles.profileproductreel}
                              onPress={() => router.push('/(farmers)/(products)/add-product')}
                            >
                              <View style={styles.profileproducthead}>
                                <Image 
                                  source={icons.add} 
                                  style={styles.profileproductreelimage} 
                                  tintColor={colors.white}
                                />
                              </View>
                              <Text style={styles.profileproductreeltext}>Add New</Text>
                            </TouchableOpacity>
                          </ScrollView>
                        </View>
                      </View>
                    )}
                  </ImageBackground>
                </View>
              </View>

              <View style={styles.ads}>
                <ImageBackground
                  imageStyle={styles.adsOverlay}
                  style={styles.adsSpace}
                  source={summaries[currentSummaryIndex].image}
                  resizeMode="cover"
                >
                  <View style={styles.stat}>
                    <View style={styles.stathead}>
                      <Text style={styles.statsheadtext}>{summaries[currentSummaryIndex].title1}</Text>
                      <Text style={styles.statsheadsub}>{summaries[currentSummaryIndex].title2}</Text>
                    </View>

                    <View style={styles.statbot}>
                      <Text style={styles.statbotext}>{summaries[currentSummaryIndex].value1}</Text>
                      <Text style={styles.statbotsub}>{summaries[currentSummaryIndex].value2}</Text>
                    </View>
                  </View>
                </ImageBackground>
                
                <View style={styles.dots}>
                  {summaries.map((_, idx) => (
                    <View
                      key={idx}
                      style={[styles.dot, {
                        width: currentSummaryIndex === idx ? 25 : 5,
                        backgroundColor: currentSummaryIndex === idx ? colors.jewel : 'rgba(0,0,0,0.1)',
                      }]}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.breakdowns}>
                <View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.breakdowncategories}
                  >
                    {timeCategories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.breakdowncategory,
                          selectedCategory === category.name && styles.selectedcategory,
                        ]}
                        onPress={() => setSelectedCategory(category.name)}
                      >
                        <Text style={[
                          styles.breakdowncategorytext,    
                          selectedCategory === category.name && styles.selectedtext]}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.cards}>
                {/* Products Card */}
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() => toggleCard('products')}
                >
                  <View style={styles.cardheader}>
                    <View>
                      <Text style={styles.cardtext}>Products</Text>
                      <Text style={styles.cardsubtext}>As of {stats.products.period}</Text>
                    </View>

                    <View style={styles.cardend}>
                      <Text style={styles.cardstatext}>{stats.products.sold}</Text>
                      <Text style={styles.cardstatsubext}>of {stats.products.total} sold</Text>
                    </View>
                  </View>

                  {expandedCard === 'products' && stats.products.details.length > 0 && (
                    <Animated.View style={styles.carddetails}>
                      {stats.products.details.map((item) => (
                        <View key={item.id} style={styles.detail}>
                          <View style={styles.detailhead}>
                            <View style={styles.cardimage}>
                              <Image
                                source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                                style={styles.largeimage}
                                resizeMode='cover'
                              />
                            </View>
                            <Text style={styles.detailtext}>{item.name}</Text>
                          </View>
                          <Text style={styles.detailsubtext}>{item.sold} sold</Text>
                        </View>
                      ))}
                    </Animated.View>
                  )}
                </TouchableOpacity>

                {/* Sales Card */}
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() => toggleCard('sales')}
                >
                  <View style={styles.cardheader}>
                    <View>
                      <Text style={styles.cardtext}>Revenue</Text>
                      <Text style={styles.cardsubtext}>As of {stats.sales.period}</Text>
                    </View>

                    <View style={styles.cardend}>
                      <Text style={styles.cardstatext}>JMD {stats.sales.amount.toLocaleString()}</Text>
                      <Text style={styles.cardstatsubext}>earned</Text>
                    </View>
                  </View>

                  {expandedCard === 'sales' && stats.sales.details.length > 0 && (
                    <Animated.View style={styles.carddetails}>
                      {stats.sales.details.map((item) => (
                        <View key={item.id} style={styles.detail}>
                          <View style={styles.detailhead}>
                            <View style={styles.cardimage}>
                              <Image
                                source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                                style={styles.largeimage}
                                resizeMode='cover'
                              />
                            </View>

                            <View style={styles.detailside}>
                              <Text style={styles.detailtext}>{item.name}</Text>
                              <View style={styles.detailfoot}>
                                <Text style={styles.detailfootext}>{item.sold} x</Text>
                                <Text style={styles.detailfootext}>{item.price}</Text>
                              </View>
                            </View>
                          </View>
                          <Text style={styles.detailsubtext}>JMD {item.amount.toLocaleString()}</Text>
                        </View>
                      ))}
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Location Modal - Keep your existing location modal code */}
          {toggleLocation && (
            <>
              <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
              <Animated.View 
                style={[
                  styles.locations,
                  { height: filterHeight },
                  {
                    transform: [{
                      translateY: pan.interpolate({
                        inputRange: [-300, 0, 300],
                        outputRange: [-50, 0, 0],
                        extrapolate: 'clamp',
                      }),
                    }],
                  }
                ]}
              >
                {/* Your existing location modal content */}
              </Animated.View>
            </>
          )}
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    height: '100%',
  },

  scrollViewContent1: {
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
    paddingTop: 20,
  },

  scrollViewContent2: {
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
    bottom: 30,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  backgroundSpace: {

  },

  backgroundOverlay: {
    top: -30,
    opacity: 0.04,
  },

  /* Header */

  header: {
    flexDirection: 'row',
    width: '87%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  headerleft: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },

  headertop: {

  },

  headerbody: {
  },

  headerbodytext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.76)',
  },

  headerbodysub: {
    fontFamily: 'Gilroy-Bold',
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 17,
  },

  headerbot: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerimage: {
    width: 30,
    height: 30,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Profile */

  profiles: {
    backgroundColor: colors.gallery,
    width: '87%',
    height: 'auto',
    borderRadius: 18,
    marginTop: 10,
  },

  profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },

  profileinfo: {
    flexDirection: 'row',
    gap: 10,
  },

  profilehead: {
    justifyContent: 'space-between',
  },

  profilebot: {

  },

  profiletext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 28,
    color: colors.black,
  },

  profilesubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.black,
  },  

  profileSpace: {
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
    height: 'auto',
  },

  profileOverlay: {
    opacity: 0.1,
  },

  profileimage: {
    overflow: 'hidden',
    borderRadius: 15,
    width: 60,
    height: 60,
  },

  profiledropdown: {
    padding: 18, 
    marginTop: -10 
  },

  profiledropdownrow1: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },

  profiledropdownrow2: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8, 
    justifyContent: 'flex-start' 
  },

  profiledropdowntext: { 
    fontFamily: 'Gilroy-Bold', 
    fontSize: 18, 
    color: colors.jewel 
  },

  profiledropdownsubtext: { 
    fontFamily: 'Gilroy-Medium', 
    fontSize: 14,
    color: colors.dullGrey, 
  },

  profiledropdowntitle: { 
    marginLeft: 8, 
    fontFamily: 'Gilroy-Medium', 
    fontSize: 15, 
    color: colors.dullGrey 
  },

  profiledropdownsubtitle: { 
    fontFamily: 'Gilroy-Regular', 
    fontSize: 12, 
    color: colors.charcoal, 
    marginBottom: 10, 
    textAlign: 'left', 
    lineHeight: 22,
  },

  profileproduct: { 
    alignItems: 'center', 
    marginRight: 15, 
  },

  profileproducts: { 
    marginTop: 8, 
    marginBottom: 8,
  },

  profileproductstitle: { 
    fontFamily: 'Gilroy-Bold', 
    fontSize: 18, 
    color: colors.jewel, 
    marginBottom: 5 
  },

  profileproductimage: { 
    width: 80, 
    height: 80, 
    borderRadius: 10, 
    marginBottom: 3,
  },

  profileproductext: { 
    fontFamily: 'Gilroy-Medium', 
    fontSize: 12,
    color: colors.charcoal, 
  },

  profileproductreel: { 

  },

  profileproductreelimage: { 
    width: 24, 
    height: 24, 
    tintColor: colors.white 
  },

  profileproducthead: { 
    width: 80, 
    height: 80, 
    borderRadius: 10, 
    backgroundColor: 'rgba(17, 103, 64, 0.71)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  profileproductreeltext: { 
    fontFamily: 'Gilroy-Medium', 
    fontSize: 12, 
    color: colors.jewel, 
    marginTop: 3,
    textAlign: 'left',
  },

  /* Ads */

  ads: {
    width: '87%', 
    alignItems: 'center', 
    marginTop: 0,
  },

  adsSpace: {
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  adsOverlay: {  

  },

  /* Stats */

  stat: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },

  stathead: {
    flexDirection: 'column',
    gap: 5,
  },

  statsheadtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.white,
  },

  statsheadsub: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 18,
    color: colors.white,
    lineHeight: 23,
  },
  
  statbot: {
    flexDirection: 'row',
    gap: 5,
  },

  statbotext: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 10,
    color: colors.white,
  },

  statbotsub: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 20,
    color: colors.white,
  },

  /* Products */

  product: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },

  producthead: {
    flexDirection: 'column',
    gap: 5,
  },

  productheadtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.white,
  },

  productheadsub: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 15,
    color: colors.white,
  },
  
  productbot: {
    flexDirection: 'row',
    gap: 5,
  },

  productbotext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 30,
    color: colors.white,
  },

  productbotsub: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 10,
    color: colors.white,
  },

  /* Breakdown */

  breakdowns: {
    width: '85%',
    paddingVertical: 25,
  },

  breakdowncategories: {
    flexDirection: 'row',
    gap: 10,
  },

  breakdowncategory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.gallery,
  },  

  breakdowncategorytext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.black,
  },

  /* Cards */

  cards: { 
    width: '85%', 
    marginTop: 10,
  },

  card: {
    backgroundColor: colors.gallery,
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
  },

  cardheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  cardend: {
    alignItems: 'flex-end',
  },

  cardtext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 17,
    color: colors.black,
  },

  cardsubtext: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 12,
    color: colors.grey,
  },

  cardstatext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 20,
    color: colors.black,
  },

  cardstatsubext: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 12,
    color: colors.grey,
  },

  carddetails: {
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 0.5,
    borderTopColor: colors.dullGrey,
  },

  cardimage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },

  /* Details */

  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },

  detailtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.black,
  },

  detailsubtext: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 10,
    color: colors.black,
  },

  detailaltext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.black,
  },

  detailhead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  detailside: {
    flexDirection: 'column',
  },

  detailfoot: {
    flexDirection: 'row',
    marginTop: 5,
    gap: 2,
  },

  detailfootext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 10,
    color: colors.grey,
  },

  /* Location */

  locations: {
    backgroundColor: colors.white,
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  locationdrag: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  location: {
    width: '99%',
    padding: 30,
  },

  locationheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  locationcontent: {
    flexDirection: 'column',
    gap: 10,
  },

  locationtitle: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 20,
    color: colors.black,
  },

  locationsubtitle: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 12,
    color: colors.black,
    width: 300,
    lineHeight: 20,
  },

  locationoptions: {
    marginBottom: 20,
  },

  locationoption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.36)',
  },

  locationoptiontext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
    marginLeft: 10,
  },

  addlocation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },

  addlocationtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
    marginLeft: 10,
    color: colors.black,
  },

  locationinput: {
    backgroundColor: colors.black,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontFamily: 'Gilroy-Medium',
  },

  savelocation: {
    backgroundColor: colors.black,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },

  savelocationtext: {
    color: colors.white,
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
  },

  /* Dots */

  dots: { 
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    marginTop: 20,
    marginBottom: 10, 
  },

  dot: {
    alignItems: 'flex-start',
    height: 4,
    borderRadius: 4,
    margin: 5,
  },

  /* Selected */

  selectedrating: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  
  selectedcategory: {
    backgroundColor: colors.jewel,
    borderWidth: 0,
    borderColor: 'transparent',
  },

  selectedfilter: {
    backgroundColor: colors.emerald,
  },

  selectedtext: {
    color: colors.white,
  },

  /* Add-Ons */

  close: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  loadingtext: {
    marginTop: 10,
    fontFamily: 'Gilroy-Medium',
    color: colors.jewel,
  },

  /* Images */

  image: {
    height: 80,
    width: 80,
  },

  largeimage: {
    height: '100%',
    width: '100%',
  },

  /* Icons */

  icon: {
    height: 25,
    width: 25,
  },
  
  largeicon: {
    margin: 15,
    width: 90,
    height: 40,
  },

  alticon: {
    height: 32,
    width: 32,
  },

  mediumicon: {
    height: 20,
    width: 20,
    margin: 5,
  },

  smallicon: {
    height: 15,
    width: 15,
  },

  tinyicon: {
    height: 5,
    width: 5,
  },

  subicon: {
    height: 10,
    width: 10,
    margin: 12,
  },

});

export default Home;