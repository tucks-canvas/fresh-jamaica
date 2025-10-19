import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

// Import React-Native Content
import { View, Image, StyleSheet, PanResponder, RefreshControl, Animated, ActivityIndicator, TouchableOpacity, StatusBar, ScrollView, Text, TextInput, ImageBackground, Alert } from 'react-native';

// Import View-Related Content
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

// Import Other Supported Content
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as Location from 'expo-location';
 
// Import Icons, Colors, and Images
import { icons, images } from '@/constants';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

// Import Services
import { userService } from '@/services/userService';
import { cartService } from '@/services/cartService';
import { likeService } from '@/services/likeService';
import { productService } from '@/services/productService';

/* Interfaces */

type ImageSource = any;

// Update the Product interface in home.tsx to match backend structure:
interface Product {
  _id: string; // Backend uses _id
  id?: string; // Fallback
  name: string;
  title?: string;
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
  percentage?: string;
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  fiber?: number;
  vitamin?: number;
  potassium?: number;
  images: string[]; // Backend uses array of strings
  image?: any; // Fallback
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

interface Category {
  id: number | string;
  name?: string;
  title?: string;
  image?: any;
  description?: string;
  [key: string]: any;
}

interface Banner {
  id: number | string;
  title: string;
  subtitle?: string;
  text?: string;
  image?: any;
  link?: string;
  [key: string]: any;
}

/* Sample Data */

const companies = [
  { id: 1, name: 'R & B Farms Ltd' },
  { id: 2, name: 'Tropical Fruits Ltd' },
  { id: 3, name: 'Green Acres Farm' },
  { id: 4, name: 'Urban Greenhouse Co.' },
  { id: 5, name: 'Spice Masters Ltd' },
  { id: 6, name: 'Island Pride Farms' }
];

/* Local storage keys */

const CART_STORAGE_KEY = 'freshja_cart';
const LIKES_STORAGE_KEY = 'freshja_likes';

const MAX_LIKE_ATTEMPTS = 2;

const FOOD_GRADES = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];

const STAR_RATINGS = [5, 4, 3, 2, 1];

/* Back-ups */

const localCategories = [
  {
    id: 0,
    title: 'All',
    image: images.all,
    description: 'Showcase of all the products we have to offer YOU - the customer.',
  },
  {
    id: 1,
    title: 'Fruits',
    image: images.apple,
    description: 'Locally grown and imported fresh fruits like mangoes, bananas, and apples.',
  },
  {
    id: 2,
    title: 'Vegetables',
    image: images.tomato,
    description: 'Fresh vegetables including callaloo, cabbage, and sweet peppers.',
  },
  {
    id: 3,
    title: 'Roots & Tubers',
    image: images.potato,
    description: 'Staples like yam, cassava, sweet potatoes, and dasheen.',
  },
  {
    id: 4,
    title: 'Leafy Greens',
    image: images.cabbage,
    description: 'Nutritious greens such as callaloo, spinach, lettuce, and pak choi.',
  },
  {
    id: 5,
    title: 'Herbs & Spices',
    image: images.ginger,
    description: 'Flavorful seasonings like thyme, scallion, pimento, ginger, and turmeric.',
  },
  {
    id: 6,
    title: 'Provisions',
    image: images.banana,
    description: 'Essential items like green bananas, plantains, and breadfruit.',
  },
  {
    id: 7,
    title: 'Seasonal',
    image: images.jackfruit,
    description: 'Fruits and crops available by season like otaheite apples, guineps, and naseberries.',
  },
  {
    id: 8,
    title: 'Traditional',
    image: images.plantain,
    description: 'Jamaican favorites like ackee, plantains, and green bananas.',
  },
];

const localBanners = [
  {
    id: 1,
    title: 'Level 1 in June',
    subtitle: '8% off on your favourite product',
    text: '500 credits',
    image: images.background3,
    link: '',
  },
  {
    id: 2,
    title: 'Level 2 in August',
    subtitle: '12% off on your favourite product',
    text: '1,000 credits',
    image: images.background4,
    link: '',
  },
  {
    id: 3,
    title: 'Level 3 in September',
    subtitle: '20% on your favourite product',
    text: '1,500 credits',
    image: images.background5,
    link: '',
  },
];

/* Helper Constants */

const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const Home = ({}) => {

  const router = useRouter();
  const hasLoadedData = useRef(false);
  const { isAuthenticated } = useAuth();

  const [likeLoadAttempts, setLikeLoadAttempts] = useState(0);

  const [initialLoad, setInitialLoad] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [authentication, setAuthentication] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const [toggleFilter, setToggleFilter] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const [toggleLocation, setToggleLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Deepolie Street, 42');
  const [savedLocations, setSavedLocations] = useState([
    'Deepolie Street, 42',
    '123 Business Ave',
    '456 Residential Rd'
  ]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState('');

  const [cart, setCart] = useState<any[]>([]);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [pan] = useState(new Animated.Value(0));
  const [filterHeight, setFilterHeight] = useState<'60%' | '100%'>('60%');
  const [searchAnim] = useState(new Animated.Value(0));

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

  /* Getter Functions */

  const getCartService = () => {
    return {
      ...cartService,
      isAuthenticated // Pass auth state
    };
  };

  /* Data Loading Functions */

  const loadHomeData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadProducts(),
        loadCategories(),
        loadBanners(),
        loadLikes(),
        loadCart()
      ]);
      setInitialLoad(false);
    } 
    catch (error) {
      console.error('Error loading home data:', error);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  const loadProducts = async () => {
    try {
      console.log('🔄 Loading products from userService...');
      
      // Use userService (which calls /user endpoint)
      const response = await userService.getHomeData({
        category: selectedCategory === 'all' ? null : selectedCategory,
        search: searchQuery
      });
      
      console.log('📦 userService response structure:', response);
      
      // Handle the response structure from /user endpoint
      let productsData = [];
      
      if (response?.success && response?.data?.products) {
        // Structure: { success: true, data: { products: [...] } }
        productsData = response.data.products;
        console.log(`✅ Found ${productsData.length} products in response.data.products`);
      } else if (response?.products) {
        // Structure: { products: [...] } 
        productsData = response.products;
        console.log(`✅ Found ${productsData.length} products in response.products`);
      } else if (Array.isArray(response)) {
        // Structure: [...]
        productsData = response;
        console.log(`✅ Found ${productsData.length} products in array response`);
      } else {
        console.log('❌ Unexpected response structure:', response);
      }
      
      if (productsData.length > 0) {
        console.log(`📦 Setting ${productsData.length} products to state`);
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Log first product for debugging
        if (productsData[0]) {
          console.log('📦 First product sample:', {
            id: productsData[0]._id,
            name: productsData[0].name,
            price: productsData[0].price,
            images: productsData[0].images,
            category: productsData[0].category
          });
        }
      } else {
        console.log('📦 No products found, using fallback');
      }
    } catch (error) {
      console.error('❌ Error loading products from userService:', error);
    }
  };

  const loadLikes = async () => {
    try {
      const data = await likeService.getLikedProducts();
      setLikedProducts(data.map((product: any) => product.id));
    } catch (error) {
      console.error('Error loading likes:', error);
      setLikedProducts([]);
    }
  };

  const loadCart = async () => {
    try {
      const data = await cartService.getCart(isAuthenticated);
      console.log('🛒 Cart loaded:', data);
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setCart(data);
      } else if (data && data.items) {
        setCart(data.items);
      } else if (data && Array.isArray(data.products)) {
        setCart(data.products);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    }
  };

  const loadCategories = async () => {
    try {
      setCategories(localCategories);
    } 
    catch (error) {
      console.error('Error loading categories:', error);
      setCategories(localCategories);
    }
  };

  const loadBanners = async () => {
    try {
      setBanners(localBanners);
    } 
    catch (error) {
      console.error('Error loading banners:', error);
      setBanners(localBanners);
    }
  };

  const getCurrentLocation = async () => {
    try {
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
          firstAddress.region,
          firstAddress.postalCode
        ].filter(Boolean).join(', ');
        
        if (locationString) {
          setCurrentLocation(locationString);
          
          if (!savedLocations.includes(locationString)) {
            setSavedLocations(prev => [...prev, locationString]);
          }
          
          setToggleLocation(false);
          console.log('Location set to:', locationString);
        } 
        else {
          Alert.alert('Error', 'Could not determine address from location');
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Error getting current location');
    }
  };

  /* Product Functions */

  const updateCartQuantity = async (productId: string, newQuantity: number) => {
    try {
      const updatedCart = await cartService.updateLocalCartQuantity(productId, newQuantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const toggleLike = async (product: any) => {
    try {
      // Use _id from backend as product ID
      const productId = product._id || product.id;
      
      if (!productId) {
        console.error('No product ID found for like toggle');
        return;
      }
      
      console.log(`Toggling like for product: ${productId}, currently liked: ${likedProducts.includes(productId)}`);
      
      // Update UI immediately for better UX
      if (likedProducts.includes(productId)) {
        setLikedProducts(prev => prev.filter(id => id !== productId));
      } else {
        setLikedProducts(prev => [...prev, productId]);
      }
      
      // Update backend
      await likeService.toggleLike(productId);
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert UI change on error
      const productId = product._id || product.id;
      if (productId) {
        setLikedProducts(prev => 
          prev.includes(productId) 
            ? prev.filter(id => id !== productId)
            : [...prev, productId]
        );
      }
    }
  };

  /* Sync Functions */

  const syncCartWithServer = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await cartService.syncCartWithServer();
        await loadCart(); // Reload cart after sync
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  }, [isAuthenticated]);

  const syncLikesWithServer = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await likeService.syncLikesWithServer();
        await loadLikes();
      }
    } catch (error) {
      console.error('Error syncing likes:', error);
    }
  }, [isAuthenticated]);

  /* Handler Functions */

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredProducts(products);
      return;
    }
    
    try {
      console.log('🔍 Searching with userService:', text);
      
      const response = await userService.searchProducts(text, selectedCategory);
      
      let searchResults = [];
      if (response?.data?.products) {
        searchResults = response.data.products;
      } else if (response?.products) {
        searchResults = response.products;
      } else if (Array.isArray(response)) {
        searchResults = response;
      }
      
      console.log(`🔍 Found ${searchResults.length} search results`);
      setFilteredProducts(searchResults);
    } catch (error) {
      console.error('❌ Error searching with userService:', error);
      
      console.log('🔄 Falling back to client-side search');
      const filtered = products.filter(product => {
        const productName = product.name || product.title || '';
        const productDescription = product.description || '';
        const productSeller = product.seller || '';
        
        return (
          productName.toLowerCase().includes(text.toLowerCase()) ||
          productDescription.toLowerCase().includes(text.toLowerCase()) ||
          productSeller.toLowerCase().includes(text.toLowerCase())
        );
      });
      
      setFilteredProducts(filtered);
    }
  };

  const handleCompanyChange = (company: string | null) => {
    setSelectedCompany(company);
  };

  const handleRatingChange = (rating: number | null) => {
    setSelectedRating(rating);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handleCategoryPress = async (categoryId: string) => {
    const newCategory = categoryId === 'all' ? null : categoryId;
    setSelectedCategory(newCategory);
    
    try {
      console.log('📂 Loading category products:', newCategory);
      
      if (newCategory) {
        const response = await userService.getProductsByCategory(newCategory);
        
        let categoryProducts = [];
        if (response?.data?.products) {
          categoryProducts = response.data.products;
        } else if (response?.products) {
          categoryProducts = response.products;
        } else if (Array.isArray(response)) {
          categoryProducts = response;
        }
        
        console.log(`📂 Found ${categoryProducts.length} products in category`);
        setFilteredProducts(categoryProducts);
      } 
      else {
        await loadProducts();
      }
    } catch (error) {
      console.error('❌ Error loading category products:', error);
      
      console.log('🔄 Falling back to client-side category filter');
      if (newCategory) {
        const filtered = products.filter(product => {
          const productCategory = product.category?.toString() || '';
          return productCategory === newCategory.toString();
        });
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products);
      }
    }
  };

  /* Product Item Component */

  const ProductItem = ({ product }: { product: Product }) => {
    if (!product) {
      return null;
    }

    // Use _id from backend as product ID
    const productId = product._id || product.id;
    
    // Fix quantity calculation for backend data structure
    const quantity = Array.isArray(cart) 
      ? cart.find(item => {
          const itemId = item?.id || item?.product?._id || item?.product?.id || item?.productId;
          return itemId === productId;
        })?.quantity || 0
      : 0;

    // Update the increment function in ProductItem
    const handleIncrement = async () => {
      try {
        const productId = product._id || product.id;
        if (!productId) return;

        console.log('➕ Incrementing product:', productId);
        
        // Use the unified cart service method
        await cartService.addToCart(
          productId, 
          1, 
          product, 
          isAuthenticated
        );
        
        // Reload cart to get updated data
        await loadCart();
        
        console.log('✅ Cart updated');
      } catch (error) {
        console.error('❌ Error incrementing quantity:', error);
      }
    };

    // Update the decrement function in ProductItem
    const handleDecrement = async () => {
      try {
        const productId = product._id || product.id;
        if (!productId) return;

        console.log('➖ Decrementing product:', productId);
        
        const currentQuantity = quantity;
        if (currentQuantity <= 0) return;

        const newQuantity = currentQuantity - 1;
        
        if (newQuantity === 0) {
          // Remove item if quantity reaches 0
          await cartService.removeFromCart(productId, isAuthenticated);
        } else {
          // Update quantity
          await cartService.updateCartItem(productId, newQuantity, isAuthenticated);
        }
        
        // Reload cart to get updated data
        await loadCart();
        
        console.log('✅ Cart updated, new quantity:', newQuantity);
      } catch (error) {
        console.error('❌ Error decrementing quantity:', error);
      }
    };

    const isLiked = productId && likedProducts.includes(productId.toString());
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const getImageSource = () => {
      if (imageError) {
        return images.noimage; // Use noimage as fallback
      }
      
      // Handle backend images array
      if (product.images && product.images.length > 0) {
        const firstImage = product.images[0];
        
        if (typeof firstImage === 'string') {
          // If it's a string (image key from database)
          if (firstImage.startsWith('http')) {
            // Handle URLs
            return { uri: firstImage };
          } else {
            // Handle local image keys - map to images constant
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
            
            return imageMap[firstImage] || images.noimage;
          }
        } else if (typeof firstImage === 'number') {
          // Direct image reference
          return firstImage;
        }
      }
      
      // Handle single image field as fallback
      if (product.image) {
        if (typeof product.image === 'string') {
          if (product.image.startsWith('http')) {
            return { uri: product.image };
          } else {
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
            
            return imageMap[product.image] || images.noimage;
          }
        } else if (typeof product.image === 'number') {
          return product.image;
        }
      }
      
      return images.noimage; // Final fallback
    };

    const displayPrice = product.discountPrice || product.price;
    const unit = product.unit || 'kg';
    const productName = product.name || product.title;
    const productGrading = product.grading || 'A';


    return (
      <View style={styles.catelogue}>
        <TouchableOpacity 
          style={styles.product}
          onPress={() => {
            router.push({ 
              pathname: '/product', 
              params: { product: JSON.stringify(product) }
            });
          }}
        >
          <View>
            <Image
              source={getImageSource()}
              style={[styles.productimage, !imageLoaded && styles.hidden]}
              resizeMode="cover"
              onError={() => {
                console.log('❌ Image failed to load for product:', productName);
                setImageError(true);
              }}
              defaultSource={images.noimage} // Use noimage as default
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Show quantity overlay */}
            {quantity > 0 && (
              <View style={styles.productoverlay}>
                <Text style={styles.productoverlaytext}>{quantity}</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.productlike}
              onPress={(e) => {
                e.stopPropagation();
                console.log(`❤️ Toggling like for product: ${productId}`);
                toggleLike(product);
              }}
            >
              <Image
                source={isLiked ? icons.likefill : icons.like}
                style={styles.mediumicon}
                tintColor={isLiked ? colors.red : colors.white}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.productbody}>
            <View style={styles.productbodyhead}>
              {/* Product Name - Truncated using your function */}
              <Text style={styles.productext} numberOfLines={1}>
                {truncateText(productName, 15)}
              </Text>
              
              <Text style={styles.productsubtext}>
                <Text style={styles.productsubprice}>JMD </Text>
                {displayPrice}
                <Text style={styles.productsubper}> /{unit}</Text>
              </Text>
              
              {product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (
                <Text style={styles.productdiscount}>
                  JMD {product.price}
                </Text>
              )}
            </View>     

            <View style={styles.productbodybot}>
              <Image
                source={icons.starfill}
                tintColor={colors.yellow}
                style={styles.smallicon}
              />
              <Text style={styles.productgrading}>{productGrading}</Text>
            </View>   
          </View>
          
          <View style={styles.productbot}>
            <TouchableOpacity 
              onPress={handleDecrement} 
              disabled={quantity === 0}
            >
              <Image
                source={icons.subtract}
                tintColor={quantity === 0 ? colors.gray : colors.white}
                style={styles.mediumicon}
              />
            </TouchableOpacity>

            <Text style={styles.productcount}>
              JMD {(quantity * displayPrice).toFixed(2)}
            </Text>

            <TouchableOpacity onPress={handleIncrement}>
              <Image
                source={icons.add}
                tintColor={colors.white}
                style={styles.mediumicon}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  /* Other Components */

  const areEqual = (prevProps: { product: Product }, nextProps: { product: Product }) => {
    return prevProps.product.id === nextProps.product.id;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  /* Use Focus-Effects or Effects */

  useFocusEffect(
    useCallback(() => {
    }, [])
  );

  useEffect(() => {
    console.log('🏠 Home component mounted');
    loadProducts();
  }, []);

  useEffect(() => {
    console.log('🏠 Home component mounted');
    loadProducts();
    loadCategories();
    loadBanners();
    setInitialLoad(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log('🔄 Category changed to:', selectedCategory);
    loadProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const checkAuthStatus = async () => {
    };
    
    checkAuthStatus();
  }, []);

  useEffect(() => {
    setLikeLoadAttempts(0);
  }, [isAuthenticated]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: showSearch ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showSearch]);

  useEffect(() => {
    console.log('Current location changed:', currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    console.log('=== 🏠 HOME DEBUG INFO ===');
    console.log('Products count:', products.length);
    console.log('Filtered products count:', filteredProducts.length);
    console.log('Selected category:', selectedCategory);
    console.log('Search query:', searchQuery);
    console.log('Loading state:', loading);
    
    if (products.length > 0) {
      console.log('First product details:', {
        id: products[0]._id,
        name: products[0].name,
        price: products[0].price,
        images: products[0].images,
        hasImage: !!(products[0].images && products[0].images.length > 0)
      });
    }
    
    console.log('All product IDs:', products.map(p => p._id));
    console.log('========================');
  }, [products, filteredProducts, selectedCategory, searchQuery, loading]);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        syncCartWithServer();
        syncLikesWithServer();
      }
    }, [isAuthenticated, syncCartWithServer, syncLikesWithServer])
  );

  /* Loading Components */

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.fresh} />
          <Text style={styles.loadingtext}>Loading fresh products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (authentication) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.fresh} />
          <Text style={styles.loadingtext}>Checking authentication...</Text>
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
          contentContainerStyle={styles.scrollViewContent1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}

          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headertop}
              onPress={() => setToggleLocation(!toggleLocation)}
            >
              <Image source={icons.location} style={styles.icon} tintColor={colors.black} />  
            </TouchableOpacity>

            <View style={styles.headerbody}>
              <Text style={styles.headerbodytext}>Express delivery</Text>

              <Text style={styles.headerbodysub}>
                {truncateText(currentLocation, 20)} {/* This should use currentLocation */}
              </Text>
            </View>

            <View style={styles.headerbot}>
              <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
                <Image 
                  source={icons.search} 
                  style={styles.icon} 
                  tintColor={colors.black} 
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/notifications')}>
                <Image 
                  source={icons.notification} 
                  style={styles.icon} 
                  tintColor={colors.black} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}

          {showSearch && (
            <Animated.View 
              style={[
                styles.search,
                {
                  opacity: searchAnim,
                  transform: [{
                    translateY: searchAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  }],
                },
              ]}
            >
              <TouchableOpacity onPress={() => setShowSearch(false)}>
                <Image 
                  source={icons.close} 
                  style={styles.subicon}
                  tintColor='rgba(0, 0, 0, 0.2)' 
                />
              </TouchableOpacity>

              <TextInput
                placeholder="Search for your items"
                placeholderTextColor='rgba(0, 0, 0, 0.2)'
                value={searchQuery}
                onChangeText={handleSearch}
                style={styles.searchtext}
                autoFocus={true}
              />

              <TouchableOpacity onPress={() => setToggleFilter(!toggleFilter)}>
                <Image 
                  source={icons.filter} 
                  style={styles.mediumicon} 
                  tintColor='rgba(0, 0, 0, 0.2)' 
                />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Promotional Banners */}

          {banners.length > 0 && (
            <View style={styles.promos}>
              <ImageBackground
                style={styles.promoImage}
                imageStyle={styles.promoOverlay}
                source={banners[currentAdIndex]?.image}
              >
                <View style={styles.promotop}>
                  <Text style={styles.promotoptext}>{banners[currentAdIndex]?.title}</Text>
                  <Text style={styles.promotopsub}>{banners[currentAdIndex]?.subtitle}</Text>
                </View>

                <View style={styles.promobot}>
                  <TouchableOpacity style={styles.promobutton1}>
                    <Text style={styles.promobotext}>{banners[currentAdIndex]?.text}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.promobutton2}>
                    <Image source={icons.right} style={styles.mediumicon} tintColor={colors.charcoal} />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          )}

          {/* Banner Pagination */}

          {banners.length > 1 && (
            <View style={styles.pagination}>
              {banners.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentAdIndex === index ? styles.active : styles.inactive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Products Section */}

          <View style={styles.offers}>
            {searchQuery ? (
              <View>
                <View style={styles.offer}>
                  <Text style={styles.offertext}>
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Result' : 'Results'} Found
                  </Text>
                </View>
                
                {filteredProducts.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.productsarea}>
                      {filteredProducts.map((item) => (
                        <ProductItem 
                          key={item?.id?.toString() || `product-${Math.random()}`}
                          product={item}
                        />
                      ))}
                    </View>
                  </ScrollView>
                ) : (
                  <Text style={styles.noresults}>No products found</Text>
                )}
              </View>
            ) : (
              <View>
                <View style={styles.offer}>
                  <Text style={styles.offertext}>Novelties of the week</Text>
                  <TouchableOpacity onPress={() => router.push('/products')}>
                    <Text style={styles.offersub}>See More</Text>
                  </TouchableOpacity>
                </View>

                {products && filteredProducts.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.productsarea}>
                      {filteredProducts.map((item) => (
                        <ProductItem 
                          key={item._id || item.id} // Use _id from backend
                          product={item}
                        />
                      ))}
                    </View>
                  </ScrollView>
                ) : (
                  <Text style={styles.noresults}>
                    {searchQuery ? 'No products found' : 'No products available'}
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Categories Section */}

          <View style={styles.categories}>
            <View>
              <ScrollView 
                horizontal
                contentContainerStyle={styles.categorysort}
                showsHorizontalScrollIndicator={false}
              >
                {categories.map((category) => (
                  <TouchableOpacity 
                    key={category.id}
                    style={[
                      styles.categoryitem,
                      selectedCategory === category.id && styles.selectedcategory
                    ]}
                    onPress={() => handleCategoryPress(category.id)}
                  >
                    <View style={styles.categorybody}>
                      <Text style={styles.categorytext}>{category.title}</Text>

                      <View style={styles.categoryimage}>
                        <Image
                          source={category.image}
                          style={styles.largeimage}
                          resizeMode='cover'
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>

        {toggleFilter && (
          <>
            <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />

            <Animated.View 
              style={[
                styles.filters,
                { height: filterHeight as `${number}%` },
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
              <View 
                style={styles.filterdrag}
                {...panResponder.panHandlers}
              >
                <Image
                  source={icons.drag}
                  style={styles.largeicon}
                  tintColor={colors.dullGrey}
                />
              </View>

              <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollViewContent2}
              >
                <View style={styles.filter}>
                  <View style={styles.filterheader}>
                    <Text style={styles.filtertitle}>Filter</Text>

                    <TouchableOpacity 
                      style={styles.close}
                      onPress={() => setToggleFilter(!toggleFilter)}
                    >
                      <Image
                        source={icons.close}
                        style={styles.tinyicon}
                        tintColor={colors.white}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.filtersection}>
                    <View style={styles.filtertop}>
                      <Text style={styles.filtertext}>Category</Text>
                      <Text style={styles.filtersubtext}>e.g: Fruits, Veggies, etc.</Text>
                    </View>

                    <ScrollView 
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.filteroptions}
                    >
                      {categories.map(category => (
                        <TouchableOpacity
                          key={category.id}
                          style={[
                            styles.filteroption,
                            selectedCategory === category.id && styles.selectedfilter
                          ]}
                          onPress={() => setSelectedCategory(
                            selectedCategory === category.id ? null : category.id
                          )}
                        >
                          <Text style={styles.filteroptiontext}>{category.name || category.title}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.filtersection}>
                    <View style={styles.filtertop}>
                      <Text style={styles.filtertext}>Company</Text>
                      <Text style={styles.filtersubtext}>Select producer/seller</Text>
                    </View>

                    <ScrollView 
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.filteroptions}
                    >
                      {companies.map(company => (
                        <TouchableOpacity
                          key={company.id}
                          style={[
                            styles.filteroption,
                            selectedCompany === company.name && styles.selectedfilter
                          ]}
                          onPress={() => setSelectedCompany(
                            selectedCompany === company.name ? null : company.name
                          )}
                        >
                          <Text style={styles.filteroptiontext}>{company.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.filtersection}>
                    <View style={styles.filtertop}>
                      <Text style={styles.filtertext}>Food Grade</Text>
                      <Text style={styles.filtersubtext}>Quality rating</Text>
                    </View>

                    <ScrollView 
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.filteroptions}
                    >
                      {FOOD_GRADES.map(grade => (
                        <TouchableOpacity
                          key={grade}
                          style={[
                            styles.filteroption,
                            selectedGrade === grade && styles.selectedfilter
                          ]}
                          onPress={() => setSelectedGrade(
                            selectedGrade === grade ? null : grade
                          )}
                        >
                          <Text style={styles.filteroptiontext}>{grade}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.filtersection}>
                    <View style={styles.filtertop}>
                      <Text style={styles.filtertext}>Star Rating</Text>
                      <Text style={styles.filtersubtext}>Customer reviews</Text>
                    </View>

                    <View style={styles.filteratings}>
                      {STAR_RATINGS.map(rating => (
                        <TouchableOpacity
                          key={rating}
                          style={[
                            styles.filterating,
                            selectedRating === rating && styles.selectedrating
                          ]}
                          onPress={() => setSelectedRating(
                            selectedRating === rating ? null : rating
                          )}
                        >
                          <View style={styles.filteratingoptions}>
                            {[...Array(rating)].map((_, i) => (
                              <Image
                                key={i}
                                source={icons.starfill}
                                style={styles.filteratingoption}
                                tintColor={
                                  selectedRating === rating ? colors.emerald : colors.grey
                                }
                              />
                            ))}
                          </View>

                          <Text style={styles.filteratingtext}>{rating}+</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.filterprice}>
                    <View style={styles.filtertop}>
                      <Text style={styles.filtertext}>Price Range</Text>
                      <Text style={styles.filtersubtext}>JMD {priceRange[0]} - JMD {priceRange[1]}</Text>
                    </View>

                    <View style={styles.filterpriceinputs}>
                      <View style={styles.filterpriceinput}>
                        <Text style={styles.filterpricelabel}>Min:</Text>
                                                          
                        <TextInput
                          style={styles.filterpricetext}
                          keyboardType="numeric"
                          value={priceRange[0].toString()}
                          onChangeText={(text) => {
                            if (text === '') {
                              setPriceRange([0, priceRange[1]]);
                            } 
                            else {
                              const num = parseInt(text) || 0;
                              
                              if (num >= 0 && num <= priceRange[1]) {
                                setPriceRange([num, priceRange[1]]);
                              }
                            }
                          }}
                        />
                      </View>
                      
                      <View style={styles.filterpriceinput}>
                        <Text style={styles.filterpricelabel}>Max:</Text>

                        <TextInput
                          style={styles.filterpricetext}
                          keyboardType="numeric"
                          value={priceRange[1].toString()}
                          onChangeText={(text) => {
                            if (text === '') {
                              setPriceRange([priceRange[0], 2000]);
                            } else {
                              const num = parseInt(text) || 0;
                              if (num >= priceRange[0] && num <= 2000) {
                                setPriceRange([priceRange[0], num]);
                              }
                            }
                          }}
                        />
                      </View>
                    </View>

                    <View style={styles.filterpriceslider}>
                      <MultiSlider
                        values={priceRange}
                        onValuesChange={setPriceRange}
                        min={0}
                        max={2000}
                        step={10}
                        sliderLength={330}
                        allowOverlap={false}
                        snapped={true}
                        markerStyle={{ height: 10, width: 10, backgroundColor: colors.fresh }}
                        selectedStyle={{ backgroundColor: colors.fresh }}
                        unselectedStyle={{ backgroundColor: colors.charcoal }}
                      />
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={styles.filterbutton}
                    onPress={() => setToggleFilter(!toggleFilter)}
                  >
                    <Text style={styles.filterbuttontext}>Apply Changes</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </Animated.View>
          </>
        )}

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
              <View 
                style={styles.locationdrag}
                {...panResponder.panHandlers}
              >
                <Image
                  source={icons.drag}
                  style={styles.largeicon}
                  tintColor={colors.dullGrey}
                />
              </View>
              
              <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollViewContent2}
              >
                <View style={styles.location}>
                  {showAddLocation ? (
                    <View>
                      <View style={styles.locationheader}>
                        <TouchableOpacity onPress={() => setShowAddLocation(false)}>
                          <Image
                            source={icons.back}
                            style={styles.mediumicon}
                            tintColor={colors.black}
                          />
                        </TouchableOpacity>
                        
                        <Text style={styles.locationtitle}>Add New Location</Text>
                        
                        <View style={{width: 24}} />
                      </View>

                      <TextInput
                        placeholder="Enter full address"
                        value={newLocation}
                        onChangeText={setNewLocation}
                        style={styles.locationinput}
                      />

                      <TouchableOpacity 
                        style={styles.savelocation}
                        onPress={() => {
                          if (newLocation.trim()) {
                            setSavedLocations([...savedLocations, newLocation]);
                            setCurrentLocation(newLocation);
                            setNewLocation('');
                            setShowAddLocation(false);
                            setToggleLocation(false);
                          }
                        }}
                      >
                        <Text style={styles.savelocationtext}>Save Location</Text>
                      </TouchableOpacity>
                    </View>

                  ) : (
                    <>
                      <View style={styles.locationheader}>
                        <View style={styles.locationcontent}>
                          <Text style={styles.locationtitle}>Select Location</Text>
                          <Text style={styles.locationsubtitle}>Delivery options and speeds may vary for different locations</Text>        
                        </View>

                        <TouchableOpacity 
                          style={[styles.close, {backgroundColor: colors.black}]}
                          onPress={() => setToggleLocation(false)}
                        >
                          <Image
                            source={icons.close}
                            style={styles.tinyicon}
                            tintColor={colors.white}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.locationoptions}>
                        <TouchableOpacity 
                          style={styles.locationoption}
                          onPress={getCurrentLocation}
                        >
                          <Image
                            source={icons.gps}
                            style={styles.mediumicon}
                            tintColor={colors.charcoal}
                          />

                          <Text style={styles.locationoptiontext}>Use Current Location</Text>
                        </TouchableOpacity>

                        {savedLocations.map((location, index) => (
                          <TouchableOpacity 
                            key={index}
                            style={styles.locationoption}
                            onPress={() => {
                              setCurrentLocation(location);
                              setToggleLocation(false);
                            }}
                          >
                            <Image
                              source={icons.location}
                              style={styles.mediumicon}
                              tintColor={colors.charcoal}
                            />
                            
                            <Text style={styles.locationoptiontext}>{location}</Text>
                          </TouchableOpacity>
                        ))}

                        <TouchableOpacity 
                          style={styles.addlocation}
                          onPress={() => setShowAddLocation(true)}
                        >
                          <Image
                            source={icons.add}
                            style={[styles.mediumicon, {}]}
                            tintColor={colors.charcoal}
                          />

                          <Text style={styles.addlocationtext}>Add New Location</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </ScrollView>
            </Animated.View>
          </>
        )}
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

  /* Header */

  header: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  headertop: {
    paddingRight: 10,
  },

  headerbody: {
    marginRight: 80,
  },

  headerbodytext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.5)',
  },

  headerbodysub: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 17,
  },

  headerbot: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Search */

  search: {
    width: '90%',
    backgroundColor: colors.gallery,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',   
    marginVertical: 20, 
    borderRadius: 18,
    padding: 5,
  },

  searchtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.charcoal,
    marginRight: 120,
  },

  /* Promos */

  promos: {
    width: '90%',
    overflow: 'hidden',
    borderRadius: 20,
    marginTop: 5,
  },

  promoImage: {
    padding: 20,
    flexDirection: 'column',
    gap: 25,
  },

  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 19, 19, 0.67)',
    zIndex: 0,
  },

  promotop: {
    flexDirection: 'column',
    gap: 10,
  },
  
  promotoptext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 20,
    color: colors.white,
  },
  
  promotopsub: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.white,
  },

  promobot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },

  promobotext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 15,
    color: colors.charcoal,
    padding: 5,
  },

  promobutton1: {
    backgroundColor: colors.white,
    height: 30,
    width: 140,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  promobutton2: {
    backgroundColor: colors.white,
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Offers */

  offers: {
    width: '90%',
    marginVertical: 20,
  },

  offer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20, 
    alignItems: 'flex-end',
  },

  offertext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 25,
    color: colors.black,
  },

  offersub: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.3)',
  },

  /* Products */

  catelogue: {
  },

  products: {
    width: '100%',
    justifyContent: 'space-between',
  },

  product: {
    backgroundColor: colors.white,
    flexDirection: 'column',
    gap: 10,
    borderRadius: 20,
    width: 150,
    height: 320,
  },

  productsarea: {
    flexDirection: 'row',
    gap: 50,
    paddingHorizontal: 10,
  },

  productbody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 10,
  },

  productbodybot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  productbodyhead: {
    flexDirection: 'column',
    gap: 8,
  },

  productext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 15,
    color: colors.black,
  },

  productsubtext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 13,
    color: colors.black,
  },

  productsubprice: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.3)',
  },

  productsubper: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.3)',
  },

  productdiscount: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.3)',
    textDecorationLine: 'line-through',
  },

  productlike: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: 45,
    height: 45,
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    right: -20,
    margin: 10,
  },

  productimage: {
    width: 170,
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
  },

  productbot: {
    padding: 10,
    backgroundColor: colors.black,
    borderRadius: 15,
    width: 170,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productcount: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.white,
  },

  productgrading: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 15,
    color: colors.black,
  },

  productoverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  
  productoverlaytext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 30,
    color: colors.white,
  },

  productprice: {
    flexDirection: 'column',
    gap: 2,
  },
  
  productbadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.fresh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  productbadgetext: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Gilroy-Bold',
  },
  
  productrating: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.black,
    marginLeft: 4,
  },

  /* Category */

  categories: {
    width: '90%',
    marginVertical: 20,
  },

  categorybody: {
    backgroundColor: colors.lightGrey,
    padding: 15,
    borderRadius: 15,
    width: 150,
    height: 100,
    overflow: 'hidden',
  },

  categorytext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 15,
    color: colors.black,
  },

  categorysort: {
    gap: 20,
  },

  categoryitem: {
    flexDirection: 'column',
    gap: 20,
  },

  categoryimage: {
    width: 150,
    height: 150,
    left: 30,
    bottom: 30,
  },

  /* Filter */

  filters: {
    backgroundColor: colors.white,
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  filterdrag: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  filter: {
    width: '99%',
    padding: 30,
  },

  filterheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginBottom: 20,
    alignItems: 'center',
  },

  filtertop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
  },

  filtertitle: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 20,
    color: colors.black,
    marginRight: 220,
  },

  filtersubtitle: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 13,
    color: colors.black,
  },

  filtertext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.4)',
  },

  filtersubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  
  filtersection: {
    marginBottom: 25,
  },

  filteroptions: {
    gap: 10,
    paddingVertical: 10,
  },
  
  filteroption: {
    backgroundColor: colors.gallery,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },

  filteroptiontext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
  },

  filterprice: {
    width: '100%',
  },

  filterpriceinputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  filterpriceinput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gallery,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '45%',
  },

  filterpricelabel: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    color: colors.black,
    marginRight: 5,
  },
  
  filterpricetext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 16,
    color: colors.black,
    flex: 1,
  },

  filterpriceslider: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  filteratings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 5,
  },
  
  filterating: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.gallery,
  },
  
  filteratingoptions: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  
  filteratingoption: {
    width: 15,
    height: 15,
    marginHorizontal: 1,
  },
  
  filteratingtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
  },

  filterbutton: {
    padding: 20,
    width: '100%',
    backgroundColor: colors.green,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterbuttontext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.white
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
    borderBottomWidth: 1,
    borderBottomColor: colors.gallery,
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

  /* Saved Location */
  
  locationinput: {
    backgroundColor: colors.gallery,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontFamily: 'Gilroy-Medium',
  },

  savelocation: {
    backgroundColor: colors.emerald,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },

  savelocationtext: {
    color: colors.white,
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
  },

  /* Selected */

  selectedrating: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  
  selectedcategory: {
    backgroundColor: colors.yellow,
  },

  selectedfilter: {
    backgroundColor: colors.emerald,
  },

  /* Pagination */

  pagination: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },

  dot: {
    height: 5,
    width: 5,
    borderRadius: 4,
    margin: 5,
  },

  active: {
    backgroundColor: colors.fresh,
    width: 30,
  },

  inactive: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  /* Add-Ons */

  close: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: colors.dullGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noresults: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginVertical: 20,
  },

  hidden: {
    opacity: 0,
  },

  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  loadingtext: {
    marginTop: 10,
    fontFamily: 'Gilroy-Medium',
    color: colors.green,
  },

  loadingsubtext: {
    marginTop: 5,
    fontFamily: 'Gilroy-Medium',
    color: colors.grey,
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