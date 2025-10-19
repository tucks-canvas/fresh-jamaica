// app/(farmers)/(products)/product.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProducts } from '@/contexts/ProductsContext';

/* Import React-Native Content */
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

/* Import Icons, Colors, and Images */
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

const Product = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getProductById, products } = useProducts();

  const [productData, setProductData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const productImages = [
    productData?.image,
    productData?.image1, 
    productData?.image2,
  ].filter(Boolean);

  /* Use-Effects */
  useEffect(() => {
    if (id && products.length > 0) {
      const product = getProductById(id as string);
      if (product) {
        setProductData(product);
      }
      setLoading(false);
    }
  }, [id, products]);

  useEffect(() => {
    if (productImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImages.length);
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [productImages.length]);

  const getImageSource = (image: any) => {
    if (!image) return images.placeholder;
    if (typeof image === 'string') {
      return { uri: image };
    }
    return image;
  };

  const navigateToEdit = () => {
    if (productData?.id) {
      router.push(`/(farmers)/(products)/edit-product?id=${productData.id}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.jewel} />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!productData) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header Buttons */}
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
          onPress={navigateToEdit}
        >
          <Image
            source={icons.edit}
            tintColor={colors.white}
            style={styles.smallicon}          
          />
        </TouchableOpacity>
      </View>

      {/* Main Image */}
      <View style={styles.adimage}>
        <Image
          source={getImageSource(productImages[currentImageIndex])}
          style={styles.largeimage}
          resizeMode='cover'
          defaultSource={images.placeholder}
        />

        <LinearGradient
          colors={['rgba(0, 0, 0, 0.3)', 'transparent']} 
          style={styles.overlay}
        />
      </View>

      {/* Thumbnail Images */}
      {productImages.length > 1 && (
        <View style={styles.ads}>
          {productImages.slice(1).map((image, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => setCurrentImageIndex(index + 1)}
            >
              <View style={[
                styles.ad,
                currentImageIndex === index + 1 && styles.activeAd
              ]}>
                <Image
                  source={getImageSource(image)}
                  style={styles.largeimage}
                  resizeMode='cover'
                  defaultSource={images.placeholder}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Pagination Dots */}
      {productImages.length > 1 && (
        <View style={styles.pagination}>
          {productImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentImageIndex === index ? styles.active : styles.inactive,
              ]}
            />
          ))}
        </View>
      )}

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollArea}
        >
          <View style={styles.container}>
            <View style={styles.product}>
              <View style={styles.productheader}>
                <View style={styles.productdetails}>
                  <Text style={styles.productseller}>{productData.seller || 'Your Business'}</Text>
                  <Text style={styles.productext}>{productData.title}</Text>
                  <Text style={styles.productsubtext}>
                    <Text style={styles.productsubtitle}>JMD </Text>
                    {productData.price || '0'}
                    <Text style={styles.productsubper}> /kg  </Text>
                    {productData.discount && productData.discount > productData.price && (
                      <Text style={styles.productsubdiscount}> JMD {productData.discount}</Text>
                    )}
                  </Text>
                  <View style={styles.productcategory}>
                    <Text style={styles.productitle}>{productData.topic || 'Product'}</Text>
                  </View>
                </View>
                <Text style={styles.productgrading}>{productData.grading || 'A+'}</Text>
              </View>

              <View style={styles.productbody}>
                <Text style={styles.productbodytitle}>About Seller</Text>
                <Text style={styles.productbodytext}>
                  <Text style={styles.productbodysubtext}>{productData.seller || 'We'} </Text>
                  {productData.about || 'Information about the seller...'}
                </Text>      
              </View>

              <Text style={[styles.productbodytext, {marginTop: 20}]}>
                {productData.description || 'Product description...'}
              </Text>

              {/* Nutritional Information */}
              {(productData.calories || productData.carbs || productData.protein) && (
                <View style={styles.nutritionSection}>
                  <Text style={styles.productbodytitle}>Nutritional Information</Text>
                  <View style={styles.nutritionGrid}>
                    {productData.calories && (
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Calories</Text>
                        <Text style={styles.nutritionValue}>{productData.calories}</Text>
                      </View>
                    )}
                    {productData.carbs && (
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Carbs</Text>
                        <Text style={styles.nutritionValue}>{productData.carbs}g</Text>
                      </View>
                    )}
                    {productData.protein && (
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Protein</Text>
                        <Text style={styles.nutritionValue}>{productData.protein}g</Text>
                      </View>
                    )}
                    {productData.fat && (
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Fat</Text>
                        <Text style={styles.nutritionValue}>{productData.fat}g</Text>
                      </View>
                    )}
                    {productData.fiber && (
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Fiber</Text>
                        <Text style={styles.nutritionValue}>{productData.fiber}g</Text>
                      </View>
                    )}
                    {productData.vitamin && (
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Vitamin A</Text>
                        <Text style={styles.nutritionValue}>{productData.vitamin} IU</Text>
                      </View>
                    )}
                    {productData.potassium && (
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Potassium</Text>
                        <Text style={styles.nutritionValue}>{productData.potassium}mg</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Fun Fact */}
              {productData.fact && (
                <View style={styles.funFactSection}>
                  <Text style={styles.productbodytitle}>Did You Know?</Text>
                  <Text style={styles.funFactText}>{productData.fact}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Edit Button */}
        <View style={styles.productquantity}>
          <TouchableOpacity 
            style={styles.add}
            onPress={navigateToEdit}
          >
            <Image
              source={icons.edit}
              style={styles.mediumicon}
              tintColor={colors.white}
            />
            <Text style={styles.addtext}>Edit Product</Text>
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
    paddingBottom: 80,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
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

  errorText: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
    color: colors.red,
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: colors.jewel,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  backButtonText: {
    color: colors.white,
    fontFamily: 'Gilroy-Bold',
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
    opacity: 0.7,
  },

  activeAd: {
    opacity: 1,
    borderWidth: 2,
    borderColor: colors.fresh,
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
    color: colors.fresh, 
    textAlign: 'right'
  },

  productseller: {
    color: colors.fresh, 
    fontSize: 13, 
    marginBottom: 10,
    fontFamily: 'Gilroy-Medium',
  },

  /* Nutrition Section */
  nutritionSection: {
    marginTop: 20,
  },

  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  nutritionItem: {
    width: '48%',
    backgroundColor: colors.gallery,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },

  nutritionLabel: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.charcoal,
  },

  nutritionValue: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
    color: colors.black,
    marginTop: 5,
  },

  /* Fun Fact Section */
  funFactSection: {
    marginTop: 20,
    backgroundColor: colors.lightGreen,
    padding: 15,
    borderRadius: 10,
  },

  funFactText: {
    fontFamily: 'Gilroy-Italic',
    fontSize: 14,
    color: colors.charcoal,
    lineHeight: 20,
  },

  productquantity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '97%',
    height: '10%',
    padding: 20,
    marginBottom: 20,
    marginTop: 20,
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
    height: 55,
    width: 200,
    padding: 15,
    borderRadius: 15,
    justifyContent:'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },

  addtext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 18,
    color: colors.white,
  },

  buttons: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 770,
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

  /* Images */
  largeimage: {
    height: '100%',
    width: '100%',
  },

  /* Icons */
  smallicon: {
    height: 20,
    width: 20,
  },

  mediumicon: {
    height: 25,
    width: 25,
  },
});

export default Product;