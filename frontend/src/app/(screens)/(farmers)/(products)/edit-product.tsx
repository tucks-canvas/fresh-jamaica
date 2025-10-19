// app/(farmers)/(products)/edit-product.tsx
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProducts } from '@/contexts/ProductsContext';

/* Import React-Native Content */
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* Import Other Supported Content */
import * as ImagePicker from 'expo-image-picker';

/* Import Icons, Images, and Colors */
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

const categories = [
  { id: 1, title: 'Fruits' },
  { id: 2, title: 'Vegetables' },
  { id: 3, title: 'Roots & Tubers' },
  { id: 4, title: 'Leafy Greens' },
  { id: 5, title: 'Herbs & Spices' },
  { id: 6, title: 'Provisions' },
  { id: 7, title: 'Seasonal' },
  { id: 8, title: 'Traditional' },
];

const EditProduct = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { products, updateProduct, loading } = useProducts();

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    seller: '',
    description: '',
    about: '',
    nutrition: '',
    fact: '',
    category: 0,
    grading: 'A+',
    topic: '',
    price: '',
    discount: '',
    calories: '',
    carbs: '',
    protein: '',
    fat: '',
    fiber: '',
    vitamin: '',
    potassium: '',
  });

  const [images, setImages] = useState({
    main: null as any,
    image1: null as any,
    image2: null as any,
  });

  const [saving, setSaving] = useState(false);
  const [productData, setProductData] = useState(null);

  // Load product data when component mounts
  useEffect(() => {
    if (id && products.length > 0) {
      const found = products.find((p) => p.id.toString() === id.toString());
      if (found) {
        setProductData(found);
        // Populate form with existing data
        setFormData({
          title: found.title || '',
          name: found.name || '',
          seller: found.seller || '',
          description: found.description || '',
          about: found.about || '',
          nutrition: found.nutrition || '',
          fact: found.fact || '',
          category: found.category || 0,
          grading: found.grading || 'A+',
          topic: found.topic || '',
          price: found.price?.toString() || '',
          discount: found.discount?.toString() || '',
          calories: found.calories?.toString() || '',
          carbs: found.carbs?.toString() || '',
          protein: found.protein?.toString() || '',
          fat: found.fat?.toString() || '',
          fiber: found.fiber?.toString() || '',
          vitamin: found.vitamin?.toString() || '',
          potassium: found.potassium?.toString() || '',
        });

        // Set existing images
        setImages({
          main: found.image || null,
          image1: found.image1 || null,
          image2: found.image2 || null,
        });
      }
    }
  }, [id, products]);

  const pickImage = async (imageType: string) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Gallery permission is needed to select photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages(prev => ({
          ...prev,
          [imageType]: result.assets[0]
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.name || !formData.price || formData.category === 0) {
      Alert.alert('Error', 'Please fill in all required fields (Title, Name, Price, and Category)');
      return;
    }

    if (!images.main) {
      Alert.alert('Error', 'Please add a main product image');
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        calories: formData.calories ? parseInt(formData.calories) : 0,
        carbs: formData.carbs ? parseFloat(formData.carbs) : 0,
        protein: formData.protein ? parseFloat(formData.protein) : 0,
        fat: formData.fat ? parseFloat(formData.fat) : 0,
        fiber: formData.fiber ? parseFloat(formData.fiber) : 0,
        vitamin: formData.vitamin ? parseInt(formData.vitamin) : 0,
        potassium: formData.potassium ? parseInt(formData.potassium) : 0,
      };

      // Add image URIs if they were updated
      if (images.main && images.main.uri) {
        updateData.image = images.main.uri;
      } else if (typeof images.main === 'string') {
        updateData.image = images.main;
      }
      
      if (images.image1 && images.image1.uri) {
        updateData.image1 = images.image1.uri;
      } else if (typeof images.image1 === 'string') {
        updateData.image1 = images.image1;
      }
      
      if (images.image2 && images.image2.uri) {
        updateData.image2 = images.image2.uri;
      } else if (typeof images.image2 === 'string') {
        updateData.image2 = images.image2;
      }

      await updateProduct(id as string, updateData);
      Alert.alert('Success', 'Product updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const getImageSource = (image: any) => {
    if (!image) return images.placeholder;
    if (typeof image === 'string') {
      return { uri: image };
    }
    if (image.uri) {
      return { uri: image.uri };
    }
    return image;
  };

  if (loading && !productData) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.jewel} />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollArea}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Image
                  source={icons.left}
                  style={styles.icon}
                  tintColor={colors.black}
                />
              </TouchableOpacity>
              
              <Text style={styles.headertext}>Edit Product</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Image Upload Section */}
            <View style={styles.imageSection}>
              <Text style={styles.sectionTitle}>Product Images *</Text>
              <Text style={styles.sectionSubtitle}>Update product images</Text>
              
              <View style={styles.imageRow}>
                <TouchableOpacity 
                  style={styles.imageUpload}
                  onPress={() => pickImage('main')}
                >
                  {images.main ? (
                    <View style={styles.uploadedImageContainer}>
                      <Image 
                        source={getImageSource(images.main)} 
                        style={styles.uploadedImage} 
                      />
                      <View style={styles.imageOverlay}>
                        <Text style={styles.imageOverlayText}>Change</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Image source={icons.camera} style={styles.uploadIcon} />
                      <Text style={styles.uploadText}>Main Image *</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.imageUpload}
                  onPress={() => pickImage('image1')}
                >
                  {images.image1 ? (
                    <View style={styles.uploadedImageContainer}>
                      <Image 
                        source={getImageSource(images.image1)} 
                        style={styles.uploadedImage} 
                      />
                      <View style={styles.imageOverlay}>
                        <Text style={styles.imageOverlayText}>Change</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Image source={icons.add} style={styles.uploadIcon} />
                      <Text style={styles.uploadText}>Image 2</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.imageUpload}
                  onPress={() => pickImage('image2')}
                >
                  {images.image2 ? (
                    <View style={styles.uploadedImageContainer}>
                      <Image 
                        source={getImageSource(images.image2)} 
                        style={styles.uploadedImage} 
                      />
                      <View style={styles.imageOverlay}>
                        <Text style={styles.imageOverlayText}>Change</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Image source={icons.add} style={styles.uploadIcon} />
                      <Text style={styles.uploadText}>Image 3</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Product Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Fresh Carrots"
                  value={formData.title}
                  onChangeText={(text) => updateFormData('title', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Product Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Carrots"
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Seller Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your farm/business name"
                  value={formData.seller}
                  onChangeText={(text) => updateFormData('seller', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category *</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoryScroll}
                >
                  <View style={styles.categoriesRow}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryButton,
                          formData.category === category.id && styles.selectedCategory
                        ]}
                        onPress={() => updateFormData('category', category.id.toString())}
                      >
                        <Text style={[
                          styles.categoryText,
                          formData.category === category.id && styles.selectedCategoryText
                        ]}>
                          {category.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Topic/Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Vegetables, Fruits, etc."
                  value={formData.topic}
                  onChangeText={(text) => updateFormData('topic', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Grading</Text>
                <TextInput
                  style={styles.input}
                  placeholder="A+"
                  value={formData.grading}
                  onChangeText={(text) => updateFormData('grading', text)}
                />
              </View>
            </View>

            {/* Pricing */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pricing</Text>
              
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Price (JMD) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="200"
                    keyboardType="numeric"
                    value={formData.price}
                    onChangeText={(text) => updateFormData('price', text)}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Discount Price (JMD)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="400"
                    keyboardType="numeric"
                    value={formData.discount}
                    onChangeText={(text) => updateFormData('discount', text)}
                  />
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Product Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your product..."
                  multiline
                  numberOfLines={4}
                  value={formData.description}
                  onChangeText={(text) => updateFormData('description', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>About the Seller/Farm</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell customers about your farm..."
                  multiline
                  numberOfLines={4}
                  value={formData.about}
                  onChangeText={(text) => updateFormData('about', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nutrition Information</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Nutritional benefits..."
                  multiline
                  numberOfLines={4}
                  value={formData.nutrition}
                  onChangeText={(text) => updateFormData('nutrition', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fun Fact</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Interesting fact about the product..."
                  multiline
                  numberOfLines={3}
                  value={formData.fact}
                  onChangeText={(text) => updateFormData('fact', text)}
                />
              </View>
            </View>

            {/* Nutritional Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutritional Details (per 100g)</Text>
              
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Calories</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="41"
                    keyboardType="numeric"
                    value={formData.calories}
                    onChangeText={(text) => updateFormData('calories', text)}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Carbs (g)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="9.58"
                    keyboardType="numeric"
                    value={formData.carbs}
                    onChangeText={(text) => updateFormData('carbs', text)}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Protein (g)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.93"
                    keyboardType="numeric"
                    value={formData.protein}
                    onChangeText={(text) => updateFormData('protein', text)}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Fat (g)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.24"
                    keyboardType="numeric"
                    value={formData.fat}
                    onChangeText={(text) => updateFormData('fat', text)}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Fiber (g)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="2.8"
                    keyboardType="numeric"
                    value={formData.fiber}
                    onChangeText={(text) => updateFormData('fiber', text)}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Vitamin A (IU)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="835"
                    keyboardType="numeric"
                    value={formData.vitamin}
                    onChangeText={(text) => updateFormData('vitamin', text)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Potassium (mg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="310"
                  keyboardType="numeric"
                  value={formData.potassium}
                  onChangeText={(text) => updateFormData('potassium', text)}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, (saving || loading) && styles.submitButtonDisabled]}
              onPress={handleSave}
              disabled={saving || loading}
            >
              {saving ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

// Use the same styles as AddProduct
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  
  scrollArea: {
    paddingBottom: 40,
  },

  container: {
    flex: 1,
    padding: 20,
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },

  backButton: {
    padding: 10,
  },

  headertext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 24,
    color: colors.black,
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 18,
    color: colors.black,
    marginBottom: 5,
  },

  sectionSubtitle: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.dullGrey,
    marginBottom: 15,
  },

  imageSection: {
    marginBottom: 30,
  },

  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  imageUpload: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gallery,
  },

  uploadedImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },

  uploadedImage: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 5,
    alignItems: 'center',
  },

  imageOverlayText: {
    color: colors.white,
    fontFamily: 'Gilroy-Medium',
    fontSize: 10,
  },

  uploadPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dullGrey,
    borderStyle: 'dashed',
    borderRadius: 12,
  },

  uploadIcon: {
    width: 24,
    height: 24,
    tintColor: colors.dullGrey,
    marginBottom: 5,
  },

  uploadText: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.dullGrey,
    textAlign: 'center',
  },

  inputGroup: {
    marginBottom: 15,
  },

  label: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    color: colors.black,
    marginBottom: 5,
  },

  input: {
    backgroundColor: colors.gallery,
    borderRadius: 10,
    padding: 15,
    fontFamily: 'Gilroy-Regular',
    fontSize: 14,
    color: colors.black,
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  row: {
    flexDirection: 'row',
  },

  categoryScroll: {
    marginHorizontal: -5,
  },

  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },

  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gallery,
    marginRight: 10,
  },

  selectedCategory: {
    backgroundColor: colors.jewel,
  },

  categoryText: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.black,
  },

  selectedCategoryText: {
    color: colors.white,
  },

  submitButton: {
    backgroundColor: colors.jewel,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },

  submitButtonDisabled: {
    opacity: 0.6,
  },

  submitButtonText: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
    color: colors.white,
  },

  icon: {
    width: 20,
    height: 20,
  },
});

export default EditProduct;