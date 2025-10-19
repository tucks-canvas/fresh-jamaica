// app/(farmers)/(products)/products.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useProducts } from '@/contexts/ProductsContext';

/* Import React-Native Content */
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar, ScrollView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* Import Colors, Icons, and Image */
import colors from '@/constants/colors';
import { icons, images } from '@/constants';

const categories = [
  {
    id: 1,
    title: 'Fruits',
    image: images.apple,
  },
  {
    id: 2,
    title: 'Vegetables',
    image: images.tomato,
  },
  {
    id: 3,
    title: 'Roots & Tubers',
    image: images.potato,
  },
  {
    id: 4,
    title: 'Leafy Greens',
    image: images.cabbage,
  },
  {
    id: 5,
    title: 'Herbs & Spices',
    image: images.ginger,
  },
  {
    id: 6,
    title: 'Provisions',
    image: images.banana,
  },
  {
    id: 7,
    title: 'Seasonal',
    image: images.jackfruit,
  },
  {
    id: 8,
    title: 'Traditional',
    image: images.plantain,
  },
];

const Products = () => {
  const router = useRouter();
  const { products, loading, error, fetchMyProducts, deleteProduct } = useProducts();
  
  const [count, setCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  /* Safe Filtering and Rendering Constants */
  const filteredProducts = selectedCategory === 0
    ? products
    : products.filter((p) => {
        // Safe category comparison - handle both string and number categories
        const productCategory = p.category?.toString() || '';
        const selectedCategoryStr = selectedCategory.toString();
        return productCategory === selectedCategoryStr;
      });

  /* Refresh Control */
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyProducts();
    setRefreshing(false);
  };

  /* Use-Effects */
  useEffect(() => {
    let start = 0;
    const end = products.length;

    if (start === end) return;

    const duration = 200;
    const increment = end > 0 ? Math.max(1, Math.floor(end / 30)) : 1;
    const stepTime = Math.max(10, Math.floor(duration / end));
   
    let current = start;
    setCount(current);

    const timer = setInterval(() => {
      current += increment;

      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setCount(current);
    }, stepTime);

    return () => clearInterval(timer);
  }, [products.length]);

  const handleDeleteProduct = (productId: string, productName: string) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(productId);
              Alert.alert('Success', 'Product deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete product');
            }
          }
        }
      ]
    );
  };

  // Show error alert if there's an error
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  // Debug: Check what's in products
  useEffect(() => {
    console.log('📦 Products data:', products);
    console.log('🔍 First product category:', products[0]?.category, typeof products[0]?.category);
  }, [products]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.jewel} />
        <Text style={styles.loadingText}>Loading your products...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" /> 

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headertext}>My Products</Text>
            </View>

            <View style={styles.count}>
              <Text style={styles.countext}>
                {count.toString().padStart(2, '0')}
              </Text>

              <Text style={styles.countsubtext}>
                You have a total of {'\n'} products
              </Text>
            </View>

            <View style={styles.categories}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryarea}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id.toString()}
                    style={[
                      styles.category,
                      selectedCategory === category.id && { backgroundColor: colors.jewel }
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text style={[
                      styles.categorytext,
                      selectedCategory === category.id && { color: colors.white }
                    ]}>
                      {category.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.views}>
              {products.length > 0 ? (
                <View style={styles.default}>
                  <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.defaultarea}
                  >
                    <View style={styles.productslist}>
                      {filteredProducts.map((item) => (
                        <TouchableOpacity
                          key={item.id?.toString() || Math.random().toString()}
                          style={styles.product}
                          onPress={() => router.push({ 
                            pathname: '/(farmers)/(products)/product', 
                            params: { id: item.id }
                          })}
                        >
                          <View style={styles.productimage}>
                            <Image 
                              source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                              style={styles.largeimage} 
                              resizeMode="cover" 
                              defaultSource={images.placeholder}
                            />
                          </View>

                          <View style={styles.productbody}>
                            <View style={styles.producthead}>
                              <Text style={styles.productext}>{item.title}</Text>
                              <Text style={styles.productsubtext}>
                                JMD {item.price}{' '}
                                {item.discount && item.discount > item.price && (
                                  <Text style={styles.productdiscount}>JMD {item.discount}</Text>
                                )}
                              </Text>
                            </View>

                            <View style={styles.productbot}>
                              <Text style={styles.productgrading}>{item.grading}</Text>
                              <TouchableOpacity 
                                style={styles.deleteButton}
                                onPress={() => handleDeleteProduct(item.id, item.title)}
                              >
                                <Image 
                                  source={icons.delete} 
                                  style={styles.smallicon} 
                                  tintColor={colors.red}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.button} 
                      onPress={() => router.push('/(farmers)/(products)/add-product')}
                    >
                      <Image 
                        source={icons.add} 
                        style={styles.icon}
                        tintColor={colors.black}
                      />
                      <Text style={styles.buttontext}>Add New Product</Text>
                    </TouchableOpacity>      
                  </ScrollView>  
                </View>
              ) : (
                <View style={styles.empty}>
                  <View style={styles.noproduct}>
                    <Text style={styles.emptytext}>No products yet.</Text>
                    <Text style={styles.emptysubtext}>Add your first product to get started!</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.push('/(farmers)/(products)/add-product')}
                  >
                    <Image 
                      source={icons.add} 
                      style={styles.icon} 
                      tintColor={colors.black}
                    />
                    <Text style={styles.buttontext}>Add Your First Product</Text>
                  </TouchableOpacity>
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
    paddingBottom: 80,
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  loadingText: {
    marginTop: 10,
    fontFamily: 'Gilroy-Medium',
    color: colors.jewel,
  },

  /* Header */
  header: {
    width: '80%',
    marginBottom: 30,
    marginTop: 30,
    alignItems: 'center',
  },

  headertext: { 
    fontFamily: 'Gilroy-Bold', 
    fontSize: 25, 
    color: colors.black 
  },

  /* View */
  views: {
    width: '90%',
    height: '100%',
  },

  default: {
    width: '100%',
    height: 550,
  },

  defaultarea: {
    paddingBottom: 80,
  },

  empty: { 
    width: '100%',
  },

  noproduct: {
    width: '100%',
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 30,
    marginBottom: 20,
  },
  
  emptytext: { 
    fontFamily: 'Gilroy-Medium', 
    fontSize: 18, 
    color: colors.dullGrey, 
    marginBottom: 10 
  },

  emptysubtext: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
  },

  /* Products */
  productslist: {
    width: '100%', 
    flexDirection: 'column',
    gap: 20,
  },
  
  product: { 
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.gallery, 
    borderRadius: 20, 
    alignItems: 'center',
    overflow: 'hidden',
    height: 100,
  },

  producthead: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  productbody: {
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },

  productbot: { 
    flexDirection: 'column', 
    alignItems: 'flex-end', 
    justifyContent: 'space-between',
    gap: 8, 
  },
  
  productext: { 
    fontFamily: 'Gilroy-Bold', 
    fontSize: 15, 
    color: colors.black 
  },
  
  productsubtext: { 
    fontFamily: 'Gilroy-Bold', 
    fontSize: 13, 
    color: colors.black 
  },
  
  productdiscount: { 
    fontFamily: 'Gilroy-Medium', 
    fontSize: 12, 
    color: 'rgba(0,0,0,0.3)', 
    textDecorationLine: 'line-through' 
  },
  
  productgrading: { 
    fontFamily: 'Gilroy-SemiBold', 
    fontSize: 25, 
    color: colors.black 
  },

  productimage: {
    overflow: 'hidden',
    width: 100,
  },

  deleteButton: {
    padding: 5,
  },

  /* Categories */
  categories: {
    width: '87%',
    marginBottom: 20,
  },

  category: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.gallery,
  },

  categorytext: {
    fontFamily: 'Gilroy-SemiBold', 
    fontSize: 12, 
    color: colors.black   
  },

  categoryarea: {
    flexDirection: 'row',
    gap: 10,
  },

  /* Add-Ons */
  count: {
    width: '85%',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },

  countext: { 
    fontFamily: 'Gilroy-Bold', 
    fontSize: 80, 
    color: colors.black 
  },

  countsubtext: { 
    fontFamily: 'Gilroy-Medium', 
    fontSize: 14, 
    color: colors.grey, 
    marginLeft: 5,
    lineHeight: 24, 
  },
  
  button: { 
    width: '100%',
    height: 100,
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: colors.gallery, 
    borderRadius: 18, 
    padding: 20, 
    marginTop: 20,
    borderColor: colors.black,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 10,
  },
  
  buttontext: { 
    color: colors.black, 
    fontFamily: 'Gilroy-Bold', 
    fontSize: 12, 
    marginLeft: 5 
  },

  /* Icons */
  smallicon: { 
    width: 15, 
    height: 15 
  },

  icon: { 
    width: 18, 
    height: 18, 
    tintColor: colors.black,
  },

  largeimage: {
    width: '100%',
    height: '100%',
  },
});

export default Products;