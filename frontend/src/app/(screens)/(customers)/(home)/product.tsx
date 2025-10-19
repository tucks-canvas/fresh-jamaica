import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';

// Import Supported Content
import { View, Image, StyleSheet, FlatList, Alert, TouchableOpacity, StatusBar, ScrollView, Animated, Text, TextInput, ImageBackground, useColorScheme } from 'react-native';

// Import Addition Content
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { LinearGradient } from 'expo-linear-gradient';

// Import View and Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
 
// Import icons, colors, and images
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

/* Headers */

const headers = [
  {
    id: 1,
    title: 'Description',
  },
  {
    id: 2,
    title: 'Nutrition Facts'
  },
  {
    id: 3,
    title: 'Reviews'
  },
];

interface ProductData {
  _id: string;
  id?: string;
  name: string;
  title: string;
  seller: string;
  description?: string;
  about?: string;
  nutrition?: string;
  fact?: string;
  category: string;
  grading: string;
  topic?: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  percentage?: string;
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  fiber?: number;
  vitamin?: number;
  potassium?: number;
  images: string[];
  image?: any;
  is_organic?: boolean;
  rating?: number;
  status?: string;
  stock?: number;
  unit?: string;
  sellerId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const Product = ({}) => {
  const router = useRouter();
  const route = useLocalSearchParams();

  const { product: productDataStr } = route;
  
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const headerWidth = 60;

  const [selectedHeader, setSelectedHeader] = useState(null);
  const [selectedLike, setSelectedLike] = useState(false);
  const [count, setCount] = useState(0);
  const [currentAdIndex, setcurrentAdIndex] = useState(0);

  const increment = () => setCount(prevCount => prevCount + 1);
  const decrement = () => setCount(prevCount => Math.max(0, prevCount - 1));

  // Image mapping function
  const mapBackendImage = (imageName: string) => {
    const imageMap: { [key: string]: any } = {
      'tomato.jpg': images.tomato,
      'banana.jpg': images.banana,
      'callaloo.jpg': images.cabbage,
      'pepper.jpg': images.freshpeppers,
      'ackee.jpg': images.freshackee,
      'ginger.jpg': images.ginger,
      'apple.jpg': images.apple,
      'potato.jpg': images.potato,
      'jackfruit.jpg': images.jackfruit,
      'plantain.jpg': images.plantain,
    };
    
    return imageMap[imageName] || images.placeholder;
  };

  // Nutrition facts - NOW INSIDE COMPONENT
  const nutritionfacts = [
    { 
      id: 1, 
      icon: icons.vitamin, 
      value: productData?.calories || 0, 
      unit: "kcal", 
      label: "Calories" 
    },
    { 
      id: 2, 
      icon: icons.carbs, 
      value: productData?.carbs || 0,  
      unit: "g", 
      label: "Carbs" 
    },
    { 
      id: 3, 
      icon: icons.protein, 
      value: productData?.protein || 0, 
      unit: "g", 
      label: "Protein" 
    },
    { 
      id: 4, 
      icon: icons.fat, 
      value: productData?.fat || 0, 
      unit: "g", 
      label: "Fat" 
    },
    { 
      id: 5, 
      icon: icons.vitamin, 
      value: productData?.fiber || 0,  
      unit: "g", 
      label: "Fiber" 
    },
    { 
      id: 6, 
      icon: icons.vitamin, 
      value: productData?.vitamin || 0, 
      unit: "μg (93% DV)", 
      label: "Vitamin A" 
    },
    { 
      id: 7, 
      icon: icons.potassium, 
      value: productData?.potassium || 0,  
      unit: "mg", 
      label: "Potassium" 
    },
  ];

  // Ads array - NOW INSIDE COMPONENT
  const getProductImages = () => {
    if (!productData) return [images.placeholder];
    
    if (productData.images && productData.images.length > 0) {
      return productData.images.map((img: string) => {
        if (typeof img === 'string') {
          return mapBackendImage(img);
        }
        return images.placeholder;
      });
    }
    
    if (productData.image) {
      return [productData.image];
    }
    
    return [images.placeholder];
  };

  const productImages = getProductImages();

  const ads = [
    {
      id: 1,
      image: productImages[0] || images.placeholder,
    },
    {
      id: 2,
      image: productImages[1] || images.placeholder,
    },
    {
      id: 3,
      image: productImages[2] || images.placeholder,
    },
  ].filter(ad => ad.image);


  const handleHeaderPress = (header_id, index) => {
    setSelectedHeader(header_id);
    console.log('Selected Header:', header_id);
  };  

  const generateStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
  
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
  
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Image
          key={`empty-${i}`}
          source={icons.star}
          style={styles.smallicon}
          tintColor='rgba(0, 0, 0, 0.3)'
        />
      );
    }
  
    return stars;
  };  

  const addToCart = async () => {
    try {
      const cartitem = {
        id: productData._id || productData.id, // Use _id from backend
        title: productData.title || productData.name,
        image: productData.images?.[0] || productData.image,
        price: productData.price,
        quantity: count,
      };

      const exitstingcart = await AsyncStorage.getItem('cart');
      let cart = exitstingcart ? JSON.parse(exitstingcart) : [];

      const itemindex = cart.findIndex((item) => item.id === cartitem.id);

      if (itemindex !== -1) {
        cart[itemindex].quantity += count;
      } else {
        cart.push(cartitem);
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      router.push('/cart');
    } 
    catch (error) 
    {
      console.error('Error saving cart data:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setcurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []); 
  
  useEffect(() => {
    console.log('I made it to product!', productData);
  }, []);  

  useEffect(() => {
    if (productDataStr) {
      try {
        console.log('📦 Parsing product data...');
        const parsedData = JSON.parse(productDataStr);
        console.log('✅ Product data parsed:', {
          id: parsedData._id,
          name: parsedData.name,
          images: parsedData.images,
          hasNutrition: !!(parsedData.calories || parsedData.carbs)
        });
        setProductData(parsedData);
      } catch (error) {
        console.error('❌ Error parsing product data:', error);
        console.log('❌ Raw product data string:', productDataStr);
      }
    } else {
      console.log('❌ No product data string provided');
    }
    setLoading(false);
  }, [productDataStr]);

  useEffect(() => {
    if (productData) {
      console.log('📦 Product data loaded:', {
        id: productData._id,
        name: productData.name,
        title: productData.title,
        images: productData.images,
        price: productData.price,
        hasCalories: !!productData.calories,
        hasCarbs: !!productData.carbs
      });
    }
  }, [productData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <Text style={styles.loadingtext}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!productData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <Text style={styles.loadingtext}>Product not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loadingtext}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content"  />

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
        >
          <Image
            source={icons.left}
            tintColor={colors.white}
            style={styles.smallicon}          
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectedLike(!selectedLike)}
        >
          <Image
            source={selectedLike ? icons.likefill : icons.like}
            tintColor={selectedLike ? colors.red : colors.white}
            style={styles.smallicon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.adimage}>
        <Image
          source={ads[currentAdIndex]?.image || images.placeholder}
          style={styles.largeimage}
          resizeMode='cover'
          onError={() => {
            console.log('❌ Product image failed to load');
            setImageError(true);
          }}
          defaultSource={images.placeholder}
        />
          
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.3)', 'transparent']} 
          style={styles.overlay}
        />
      </View>

      <View style={styles.ads}>
        <View style={styles.ad}>
          <Image
              source={ads[(currentAdIndex + 1) % ads.length].image} 
              style={styles.largeimage}
              resizeMode='cover'
          />
        </View>

        <View style={styles.ad}>
          <Image
              source={ads[(currentAdIndex + 2) % ads.length].image} 
              style={styles.largeimage}
              resizeMode='cover'
          />
        </View>
      </View>

      <View style={styles.pagination}>
        {ads.map((_, index) => (
            <View
                key={index}
                style={[
                    styles.dot,
                    currentAdIndex === index ? styles.active : styles.inactive,
                ]}
            />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollArea}
        >
          <View style={styles.container}>
            <View style={styles.product}>
              <View style={styles.productheader}>
                <View style={styles.productdetails}>
                  <Text style={[styles.productseller]}>{productData.seller}</Text>

                  <Text style={styles.productext}>{productData.title || productData.name}</Text>

                  <Text style={styles.productsubtext}>
                    <Text style={styles.productsubtitle}>JMD </Text>{productData.price}
                    <Text style={styles.productsubper}> /{productData.unit || 'kg'}  </Text>
                    {productData.discountPrice && productData.discountPrice > 0 && (
                      <Text style={styles.productsubdiscount}> JMD {productData.discountPrice}</Text>
                    )}
                  </Text>

                  <View style={styles.productcategory}>
                    <Text style={styles.productitle}>{productData.topic || productData.category}</Text>
                  </View>
                </View>

                <Text style={styles.productgrading}>{productData.grading}</Text>
              </View>

              <View style={styles.productbody}>
                <Text style={styles.productbodytitle}>About Seller</Text>

                <Text style={styles.productbodytext}>
                  <Text style={styles.productbodysubtext}>{productData.seller} </Text>
                  {productData.about}
                </Text>      
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.productquantity}>
          <View style={styles.quantities}>
            <TouchableOpacity onPress={decrement}>
              <Image
                  source={icons.subtract}
                  style={styles.midicon}
                  tintColor={colors.charcoal}
              />
            </TouchableOpacity>

            <View style={styles.quantity}>
                <Text style={styles.quantitytext}>{count}</Text>
            </View>

            <TouchableOpacity onPress={increment}>
              <Image
                  source={icons.add}
                  style={styles.midicon}
                  tintColor={colors.charcoal}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.add}
            onPress={addToCart}
          >
            <Text style={styles.addtext}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backdrop,
    height: '100%',
    width: '100%',
    marginTop: 300,
    alignItems: 'center',
  },

  scrollArea: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 50,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  /* Ads */

  adimage: {
    position: 'absolute',
    overflow: 'visible',
    height: '50%',
    width: '100%',
  },

  ads: {
    position: 'absolute',
    flexDirection: 'column',
    justifyContent:'center',
    alignItems: 'flex-end',
    top: 150,
    right: 25,
    width: '100%',
    gap: 20,
    zIndex: 10,
  },

  ad: {
    backgroundColor: colors.white,
    height: 80,
    width: 80,
    elevation: 10,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent:'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  /* Product */

  product: {
    width: '90%',
    height: '100%',    
  },

  productheader: {
    flexDirection: 'row',
    width: '85%',
    gap: 5,
    justifyContent: 'space-between',
  },

  productdetails: {
    flexDirection: 'column',
    width: '100%',
    gap: 5,
  },

  productext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 25,
    color: colors.black,
  },

  productsubtext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 20,
    color: colors.black,
  },

  productitle: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 10,
    color: colors.white,
  },

  productsubtitle: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 20,
    color: colors.charcoal,
    marginBottom: 10,
  },

  productsubper: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.3)',
  },

  productsubdiscount: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.3)',
    textDecorationLine: 'line-through',
  },

  productbody: {
    flexDirection: 'column',
  },

  productbodytitle: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 20,
    color: colors.charcoal,
    marginBottom: 10,
    marginTop: 20,
  },

  productbodytext: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    lineHeight: 21,
    marginBottom: 15,
  },

  productbodysubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    color: colors.black,
    lineHeight: 21,
    marginBottom: 10,
  },

  productcategory: {
    backgroundColor: colors.black,
    paddingHorizontal: 10,
    paddingVertical: 5, 
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginVertical: 10,
  },  

  productgrading: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 50,
    color: colors.fresh, textAlign: 'right'
  },

  productseller: {
    color: colors.fresh, 
    fontSize: 13, 
    marginBottom: 10,
    fontFamily: 'Gilroy-Medium',
  },


  productquantity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '97%',
    height: '10%',
    padding: 20,
    marginBottom: 20,
    marginTop: 20,
  },

  /* Quantities */

  quantities: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },

  quantity: {
    backgroundColor: colors.black,
    height: 50,
    width: 50,
    padding: 15,
    borderRadius: 15,
    justifyContent:'center',
    alignItems: 'center',
  },

  quantitytext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.white,
  },

  /* Pagination */

  pagination: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    top: 250,
    width: '100%',
    marginVertical: 10,
  },

  dot: {
    height: 5,
    width: 5,
    borderRadius: 4,
    margin: 5,
  },

  active: {
    backgroundColor: colors.fresh,
    width: 35,
  },

  inactive: {
    backgroundColor: colors.white,
  },

  /* Add-Ons */

  add: {
    backgroundColor: colors.black,
    right: 10,
    height: 55,
    width: 150,
    padding: 15,
    borderRadius: 15,
    justifyContent:'center',
    alignItems: 'center',
  },

  addtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 18,
    color: colors.white,
  },

  buttons: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 680,
    left: 30,
    zIndex: 10,
    flexDirection: 'column',
    gap: 15,
  },

  button: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  loadingtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
    color: colors.charcoal,
  },

  /* Images */

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
    height: 20,
    width: 20,
  },

  midicon: {
    height: 25,
    width: 25,
    margin: 5,
  },

});

export default Product;