import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

// Import Supported Content
import { 
  View, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  ScrollView, 
  Text, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';

// Import View and Storage
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
// Import Icons, Colors, and Images
import { icons, images } from '@/constants';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

// Import Services
import { likeService } from '@/services/likeService';

/* Interface */

interface LikedProduct {
  id: string;
  title: string;
  name?: string;
  seller: string;
  price: number;
  image: any;
  images?: any[];
  grading?: string;
}

const Like: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 2;
  
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Like Constants */

  const loadLikedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the new likeService
      const data = await likeService.getLikedProducts();

      setLikedProducts(data || []);
      setLoadAttempts(0);
    } 
    catch (error) {
      console.error('Error loading liked products:', error);
      setError('Failed to load liked products');
      setLoadAttempts(prev => prev + 1);
    } 
    finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const removeLike = useCallback(async (productId: string) => {
    try {
      await likeService.toggleLike(productId);
      setLikedProducts(prev => prev.filter(item => item.id !== productId));
    } 
    catch (error) {
      console.error('Error removing like:', error);
    }
  }, [isAuthenticated]);

  /* Getters and Handlers */

  const getImageSource = useCallback((product: LikedProduct) => {
    try {
      if (product.images && product.images.length > 0) {
        const firstImage = product.images[0];

        if (typeof firstImage === 'string' && firstImage.startsWith('http')) {
          return { uri: firstImage };
        }

        if (images[firstImage as keyof typeof images]) {
          return images[firstImage as keyof typeof images];
        }
      }
      
      if (product.image) {
        if (typeof product.image === 'string' && product.image.startsWith('http')) {
          return { uri: product.image };
        }

        if (images[product.image as keyof typeof images]) {
          return images[product.image as keyof typeof images];
        }
      }
      
      return images.placeholder || images.apple;
    } 
    catch (error) {
      console.warn('Error getting image source:', error);
      return images.placeholder || images.apple;
    }
  }, []);

  const handleProductPress = useCallback((product: LikedProduct) => {
    try {
      router.push({ 
        pathname: '/product', 
        params: { 
          product: JSON.stringify(product)
        }
      });
    } catch (error) {
      console.error('Error navigating to product:', error);
    }
  }, [router]);

  /* Other Constants */

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLikedProducts();
    setRefreshing(false);
  }, [loadLikedProducts]);

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token && token.length > 10;
    } catch (error) {
      return false;
    }
  };

  /* Use-Focus Effect */

  useFocusEffect(
    useCallback(() => {
      console.log('Like screen focused, loading data...');
      setLoading(true);
      loadLikedProducts();
    }, [loadLikedProducts])
  );

  /* Loading Constants */

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.fresh} />
          
          <Text style={styles.loadingText}>Loading your liked products...</Text>
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
              <Text style={styles.headertext}>My Liked Products</Text>
            </View>

            <View style={styles.body}>
              {likedProducts.length > 0 ? (
                <View style={styles.likeview}>
                  {likedProducts.map((item) => (
                    <TouchableOpacity 
                      style={styles.product} 
                      key={item.id}
                      onPress={() => handleProductPress(item)}
                    >
                      <View style={styles.productimage}>
                        <Image
                          source={getImageSource(item)}
                          style={styles.lrgimage}
                          resizeMode="cover"
                        />
                      </View>

                      <View style={styles.productdetail}>
                        <Text style={styles.productext}>{item.title}</Text>
                        <Text style={styles.productsml}>by {item.seller}</Text>
                      </View>

                      <View style={styles.productprice}>
                        <Text style={styles.productsub}>
                          <Text style={styles.productbig}>JMD </Text> 
                          {item.price}
                          <Text style={styles.productsml}> /kg</Text>
                        </Text>
                      </View>

                      {/* ADD REMOVE BUTTON */}
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removeLike(item.id)}
                      >
                        <Image
                          source={icons.close}
                          style={styles.smlicon}
                          tintColor={colors.grey}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.defaultview}>
                  <Text style={styles.productbig}>You have no liked products</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },

  scrollViewContent: {
    flexGrow: 1,
    width: '100%',
    paddingBottom: 80,
    paddingTop: 20,
    alignItems: 'center',
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

  /* Header */

  header: {
    width: '90%',
    paddingVertical: 20,
    marginBottom: 5,
  },

  headertext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 28,
    color: colors.black,
    marginBottom: 5,
  },

  headersubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
    color: colors.grey,
  },

  /* Body */

  body: {
    width: '90%',
    flex: 1,
  },

  /* Error State */

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  errorText: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
    color: colors.red,
    marginBottom: 20,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: colors.fresh,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryButtonText: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
    color: colors.white,
  },

  /* Auth Prompt */

  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  authPromptText: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 18,
    color: colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },

  loginButton: {
    backgroundColor: colors.fresh,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },

  loginButtonText: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
    color: colors.white,
  },

  /* Empty State */

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },

  emptyTitle: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 24,
    color: colors.black,
    marginBottom: 10,
  },

  emptySubtitle: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
    color: colors.grey,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },

  browseButton: {
    backgroundColor: colors.fresh,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },

  browseButtonText: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
    color: colors.white,
  },

  /* Product List */

  likeview: {
    flexDirection: 'column',
    width: '100%',
    gap: 20,
  },

  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  product: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },

  productdetail: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },

  productimage: {
    backgroundColor: colors.white,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    height: 70,
    width: 70,
    borderRadius: 12,
    elevation: 5,
  },

  productext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 18,
    color: colors.black,
    marginBottom: 4,
  },

  productsub: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
    color: colors.black,
  },

  productbig: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    color: colors.grey,
  },

  productsml: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    color: colors.grey,
    marginBottom: 4,
  },

  productprice: {
    alignItems: 'flex-end',
  },

  /* Add-Ons */

  originalPrice: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.grey,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },

  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  starIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
  },

  gradeText: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.black,
  },

  removeButton: {
    padding: 8,
    marginLeft: 10,
  },

  /* Icons & Images */

  smlicon: {
    width: 16,
    height: 16,
  },

  lrgimage: {
    height: '100%',
    width: '100%',
  },
});

export default Like;