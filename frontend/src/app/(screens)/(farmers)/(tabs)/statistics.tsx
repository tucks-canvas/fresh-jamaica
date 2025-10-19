import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Text, ImageBackground, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

/* Import Icons, Colors, and Images */
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

const categories = [
  { 
    id: '0', 
    name: 'Today',
  },
  { 
    id: '1', 
    name: 'Past 3 Days', 
  },
  { 
    id: '2', 
    name: 'Past 7 Days', 
  },
  { 
    id: '3', 
    name: 'Month', 
  },
  { 
    id: '4', 
    name: 'Year', 
  },
];

const Statistics = () => {
  const router = useRouter();

  const [count, setCount] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('sales');
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  /* Other Constants */

  const company = {
    name: 'R & B Farms',
    owner: 'Johns Gaunt',
    established: 1950,
    grading: 'A+',
    companyRating: 4.5,
    productRating: 4.2,
    description: 'Family-owned and operated since 1950, R & B Farms specializes in high-quality, nutrient-rich produce grown with sustainable practices in St. Elizabeth.',
  };

  const products = [
    { 
      id: 1, 
      name: 'Fresh Carrots', 
      image: images.freshcarrots,
      sold: 1200,
      stock: 800,
      price: '$500 JMD',
      totalRevenue: 600000,
      rating: 4.7,
      reviews: 156,
      category: 'Vegetables',
      grading: 'A+',
      details: 'Fresh, organic carrots harvested daily. Rich in vitamin A and antioxidants.'
    },
    { 
      id: 2, 
      name: 'Sweet Peppers', 
      image: images.freshpeppers,
      sold: 850,
      stock: 450,
      price: '$400 JMD',
      totalRevenue: 340000,
      rating: 4.3,
      reviews: 98,
      category: 'Vegetables',
      grading: 'A',
      details: 'Colorful sweet peppers with crisp texture and sweet flavor.'
    },
    { 
      id: 3, 
      name: 'Fresh Ginger', 
      image: images.freshginger,
      sold: 650,
      stock: 350,
      price: '$600 JMD',
      totalRevenue: 390000,
      rating: 4.8,
      reviews: 124,
      category: 'Spices',
      grading: 'A+',
      details: 'Organic ginger with strong aroma and flavor. Perfect for teas and cooking.'
    },
    { 
      id: 4, 
      name: 'Fresh Ackee', 
      image: images.freshackee,
      sold: 500,
      stock: 200,
      price: '$800 JMD',
      totalRevenue: 400000,
      rating: 4.5,
      reviews: 87,
      category: 'Fruits',
      grading: 'A',
      details: 'Jamaican ackee, carefully harvested at the perfect ripeness.'
    },
  ];

  const sales = {
    labels: products.map(p => p.name),
    datasets: [
      {
        data: products.map(p => p.sold),
      },
    ],
  };

  const revenues = {
    labels: products.map(p => p.name),
    datasets: [
      {
        data: products.map(p => p.totalRevenue / 1000),
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.black,
    labelColor: (opacity = 1) => colors.black,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.black,
    },
  };

  /* Generating Functions */

  const generateStars = (rating) => {
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
          source={icons.halfstar || icons.starfill}
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
          tintColor={colors.dullGrey}
        />
      );
    }
    return stars;
  };

  /* Rendering Functions */

  const renderSales = () => (
    <View style={styles.tabcontent}>
      <View style={[styles.chartbox, { backgroundColor: colors.gallery, marginBottom: 16 }]}>
        <Text style={styles.chartboxtitle}>Products Sold</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <LineChart
            data={sales}
            width={Math.max(Dimensions.get('window').width - 60, products.length * 100)}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: 'transparent',
              backgroundGradientTo: 'transparent',
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              color: (opacity = 1) => `rgba(134, 211, 198, ${opacity})`,
              labelColor: (opacity = 1) => colors.charcoal || `rgba(60, 60, 60, ${opacity})`,
              strokeWidth: 3,
              useShadowColorFromDataset: false,
              decimalPlaces: 0,
              propsForLabels: { 
                fontSize: 11, 
                fontFamily: 'Gilroy-Medium',
                fill: colors.charcoal || '#3c3c3c'
              },
              propsForDots: {
                r: "3",
                strokeWidth: "2",
                stroke: colors.gallery || "#f5f5f5",
                fill: "rgba(134, 211, 198, 1)"
              },
              fillShadowGradient: 'rgba(134, 211, 198, 0.2)',
              fillShadowGradientOpacity: 0.2,
            }}
            bezier
            verticalLabelRotation={0}
            fromZero={true}
            style={{ 
              backgroundColor: 'transparent',
              borderRadius: 16,
            }}
            withInnerLines={false}
            withOuterLines={false}
            withHorizontalLabels={true}
            withVerticalLabels={true}
          />
        </ScrollView>
      </View>

      {/* Revenue Chart Box */}
      <View style={[styles.chartbox, { backgroundColor: colors.gallery, marginBottom: 16 }]}>
        <Text style={styles.chartboxtitle}>Revenue (JMD '000)</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <LineChart
            data={sales}
            width={Dimensions.get('window').width - 60}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: 'transparent',
              backgroundGradientTo: 'transparent',
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              color: (opacity = 1) => `rgba(134, 211, 198, ${opacity})`,
              labelColor: (opacity = 1) => colors.charcoal || `rgba(60, 60, 60, ${opacity})`,
              strokeWidth: 3,
              useShadowColorFromDataset: false,
              decimalPlaces: 0,
              propsForLabels: { 
                fontSize: 11, 
                fontFamily: 'Gilroy-Medium',
                fill: colors.charcoal || '#3c3c3c'
              },
              propsForDots: {
                r: "3",
                strokeWidth: "2",
                stroke: colors.gallery || "#f5f5f5",
                fill: "rgba(134, 211, 198, 1)"
              },
              fillShadowGradient: 'rgba(134, 211, 198, 0.2)',
              fillShadowGradientOpacity: 0.2,
            }}
            bezier
            verticalLabelRotation={0}
            fromZero={true}
            style={{ 
              backgroundColor: 'transparent',
              borderRadius: 16,
            }}
            withInnerLines={false}
            withOuterLines={false}
            withHorizontalLabels={true}
            withVerticalLabels={true}
          />
        </ScrollView>
      </View>

      {/* Sales Summary Box */}
      <View style={styles.chartbox}>
        <Text style={styles.chartboxtitle}>Sales Summary</Text>

        <View style={styles.summary}>
          <View style={styles.summaryrow}>
            <Text style={styles.summarylabel}>Total Products Sold:</Text>
            <Text style={styles.summaryvalue}>{products.reduce((sum, p) => sum + p.sold, 0)}</Text>
          </View>

          <View style={styles.summaryrow}>
            <Text style={styles.summarylabel}>Total Revenue:</Text>
            <Text style={styles.summaryvalue}>
              ${products.reduce((sum, p) => sum + p.totalRevenue, 0).toLocaleString()} JMD
            </Text>
          </View>

          <View style={styles.summaryrow}>
            <Text style={styles.summarylabel}>Average Price:</Text>
            <Text style={styles.summaryvalue}>
              ${Math.round(products.reduce((sum, p) => sum + p.totalRevenue, 0) / products.reduce((sum, p) => sum + p.sold, 0))} JMD
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderProducts = () => (
    <View style={styles.tabcontent}>
      <View style={styles.products}>
        {products.map(product => (
          <TouchableOpacity 
            key={product.id} 
            style={styles.productcard}
            onPress={() => setSelectedProduct(product)}
          >
            <Image 
              source={product.image} 
              style={styles.productimage} 
            />

            <View style={styles.productbody}>
              <Text style={styles.productname}>{product.name}</Text>

              <View style={styles.productstats}>
                <Text style={styles.productstat}>Sold: {product.sold}</Text>
                <Text style={styles.productstat}>Stock: {product.stock}</Text>
              </View>

              <View style={styles.ratings}>
                {generateStars(product.rating)}

                <Text style={styles.ratingtext}>({product.reviews})</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedProduct && (
        <View style={styles.productdetails}>
          <View style={styles.productdetail}>
            <TouchableOpacity 
              style={styles.close}
              onPress={() => setSelectedProduct(null)}
            >
              <Image 
                source={icons.close} 
                style={styles.mediumicon} 
                tintColor={colors.black} 
              />
            </TouchableOpacity>
            
            <Image 
              source={selectedProduct.image} 
              style={styles.detailproductimage} 
            />

            <Text style={styles.detailproductname}>{selectedProduct.name}</Text>
            
            <View style={styles.detailrow}>
              <Text style={styles.detailabel}>Category:</Text>
              <Text style={styles.detailvalue}>{selectedProduct.category}</Text>
            </View>
            
            <View style={styles.detailrow}>
              <Text style={styles.detailabel}>Grading:</Text>
              <Text style={styles.detailvalue}>{selectedProduct.grading}</Text>
            </View>
            
            <View style={styles.detailrow}>
              <Text style={styles.detailabel}>Price:</Text>
              <Text style={styles.detailvalue}>{selectedProduct.price}</Text>
            </View>
            
            <View style={styles.detailrow}>
              <Text style={styles.detailabel}>Sold:</Text>
              <Text style={styles.detailvalue}>{selectedProduct.sold} units</Text>
            </View>
            
            <View style={styles.detailrow}>
              <Text style={styles.detailabel}>In Stock:</Text>
              <Text style={styles.detailvalue}>{selectedProduct.stock} units</Text>
            </View>
            
            <View style={styles.detailrow}>
              <Text style={styles.detailabel}>Total Revenue:</Text>
              <Text style={styles.detailvalue}>${selectedProduct.totalRevenue.toLocaleString()} JMD</Text>
            </View>
            
            <View style={styles.ratings}>
              {generateStars(selectedProduct.rating)}
              <Text style={styles.ratingtext}>({selectedProduct.reviews} reviews)</Text>
            </View>
            
            <Text style={styles.productdescription}>{selectedProduct.details}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabcontent}>
      <View style={styles.overallratings}>
        <View style={styles.ratingoverview}>
          <Text style={styles.overallrating}>{company.productRating}</Text>

          <Text style={styles.ratingsubtext}>Your rating is {'\n'} in total </Text>

          <View style={styles.stars}>
            <View style={styles.totalstars}>
              {generateStars(company.productRating)}
            </View>
            
            <Text style={styles.totalreviews}>({products.reduce((sum, p) => sum + p.reviews, 0)} reviews)</Text>
          </View>
        </View>
      </View>

      <View style={styles.productratings}>
        <Text style={styles.productitle}>Product Ratings</Text>

        {products.map(product => (
          <View 
            key={product.id} 
            style={styles.ratingitem}
          >
            <Image 
              source={product.image} 
              style={styles.ratingproductimage} 
            />

            <View style={styles.ratinginfo}>
              <Text style={styles.ratingproductname}>{product.name}</Text>

              <Text style={styles.reviewcount}>{product.reviews} reviews</Text>
            </View>

            <View style={styles.ratingrow}>
              {generateStars(product.rating)}
              <Text style={styles.ratingvalue}>{product.rating}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  /* Use-Effects */

  useEffect(() => {
    const end = products.reduce((sum, p) => sum + p.reviews, 0);
    let start = 0;

    if (start === end) return;

    const duration = 200; // ms
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
  }, [products]);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ImageBackground
          imageStyle={styles.backgroundoverlay}
          style={styles.backgroundspace}
          source={images.backdrop3}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.headertitle}>My Statistics</Text>
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
                          <Text style={styles.profiletext}>{company.owner}</Text>
                          <Text style={styles.profilesubtext}>{company.name}</Text>
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
                          <Text style={styles.profiledropdownsubtext}>Est. {company.established}</Text>
                          <Text style={styles.profiledropdowntext}>{company.grading}</Text>
                        </View>

                        <View style={styles.profiledropdownrow2}>
                          {generateStars(company.companyRating)}

                          <Text style={styles.profiledropdowntitle}>{company.companyRating} stars</Text>
                        </View>
                        
                        <Text style={styles.profiledropdownsubtitle}>{company.description}</Text>
                      </View>
                    )}
                  </ImageBackground>
                </View>
              </View>

              <View style={styles.breakdowns}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.breakdowncategories}
                >
                  {categories.map((category) => (
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

              <View style={styles.tabs}>
                <TouchableOpacity 
                  style={[styles.tab, activeTab === 'sales' && styles.activetab]}
                  onPress={() => setActiveTab('sales')}
                >
                  <Text style={[
                    styles.tabtext, 
                    activeTab === 'sales' && styles.activetabtext]}
                  >
                    Sales
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.tab, 
                    activeTab === 'products' && styles.activetab
                  ]}
                  onPress={() => setActiveTab('products')}
                >
                  <Text style={[styles.tabtext, activeTab === 'products' && styles.activetabtext]}>
                    Products
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.tab, activeTab === 'reviews' && styles.activetab]}
                  onPress={() => setActiveTab('reviews')}
                >
                  <Text style={[styles.tabtext, activeTab === 'reviews' && styles.activetabtext]}>
                    Reviews
                  </Text>
                </TouchableOpacity>
              </View>

              {activeTab === 'sales' && renderSales()}
              {activeTab === 'products' && renderProducts()}
              {activeTab === 'reviews' && renderReviews()}
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  scrollViewContent: {
    paddingBottom: 80,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },

  backgroundspace: {

  },

  backgroundoverlay: {
    top: -30,
    opacity: 0,
  },

  /* Header */

  header: {
    flexDirection: 'row',
    width: '87%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },

  headertitle: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 25,
    color: colors.black,
  },

  /* Profiles */

  profiles: {
    backgroundColor: colors.gallery,
    width: '87%',
    height: 'auto',
    borderRadius: 18,
    marginTop: 10,
    marginBottom: 20,
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
    color: colors.black 
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
    color: colors.black, 
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
    color: colors.black, 
    marginTop: 3,
    textAlign: 'left',
  },

  /* Breakdowns */

  breakdowns: {
    width: '87%',
    marginBottom: 20,
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
  
  /* Tabs */

  tabs: {
    flexDirection: 'row',
    width: '87%',
    marginBottom: 20,
    backgroundColor: 'transparent',
    borderRadius: 10,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },

  tabcontent: {
    width: '87%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activetab: {
    backgroundColor: colors.gallery,
  },

  tabtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    color: colors.dullGrey,
  },

  activetabtext: {
    color: colors.black,
    fontFamily: 'Gilroy-Bold',
  },

  /* Charts */

  charts: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },

  chartbox: {
    backgroundColor: colors.gallery,
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  chartboxtitle: {
    fontSize: 16,
    fontFamily: 'Gilroy-SemiBold',
    color: colors.charcoal || '#3c3c3c',
    marginBottom: 16,
  },

  /* Summary */

  summary: {
    backgroundColor: 'transparent',
    width: '100%',
    padding: 20,
  },

  summaryrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(60, 60, 60, 0.1)',
  },

  summarylabel: {
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    color: colors.charcoal || '#3c3c3c',
    opacity: 0.7,
  },

  summaryvalue: {
    fontSize: 14,
    fontFamily: 'Gilroy-SemiBold',
    color: colors.charcoal || '#3c3c3c',
  },

  /* Products */

  products: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  productcard: {
    width: '48%',
    backgroundColor: colors.gallery,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    overflow: 'hidden',
  },

  productimage: {
    overflow: 'hidden',
    width: '100%',
    height: 80,
    marginBottom: 10,
  },

  productbody: {
    padding: 20,
  },

  productname: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
    color: colors.black,
  },

  productstats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },

  productstat: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.dullGrey,
  },

  productdetails: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  productdetail: {
    backgroundColor: colors.white,
    width: '90%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },

  productdescription: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 14,
    color: colors.charcoal,
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 20,
  },

  productratings: {
    width: '100%',
    backgroundColor: colors.gallery,
    borderRadius: 15,
    padding: 25,
  },

  /* Ratings */

  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  ratingtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    marginLeft: 5,
    color: colors.dullGrey,
  },

  ratingtitle: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 18,
    marginBottom: 15,
    color: colors.black,
  },

  ratingoverview: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  ratingitem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },

  ratingproductimage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },

  ratinginfo: {
    flex: 1,
  },

  ratingproductname: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 14,
    marginBottom: 5,
    color: colors.black,
  },

  ratingrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },

  ratingvalue: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 14,
    marginLeft: 8,
    color: colors.black,
  },

  ratingsubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    color: colors.dullGrey,
    lineHeight: 20,
  },

  /* Details */

  detailproductimage: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginBottom: 15,
  },

  detailproductname: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 20,
    marginBottom: 15,
    color: colors.black,
  },

  detailrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },

  detailabel: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    color: colors.dullGrey,
  },

  detailvalue: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 14,
    color: colors.black,
  },

  /* Overlays */

  overallratings: {
    backgroundColor: colors.gallery,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },

  overallrating: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 70,
    color: colors.black,
    marginBottom: 10,
  },

  productitle: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 25,
    marginBottom: 15,
    color: colors.black,
  },

  /* Review */

  totalreviews: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    marginLeft: 10,
    color: colors.dullGrey,
  },

  reviewcount: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: colors.dullGrey,
  },

  /* Selected */

  selectedcategory: {
    backgroundColor: colors.black,
  },

  selectedtext: {
    color: colors.white,
  },

  /* Add-Ons */

  back: {
    padding: 5,
  },

  close: {
    alignSelf: 'flex-end',
    padding: 5,
  },

  stars: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
  },

  totalstars: {
    flexDirection: 'row',
    gap: 1,
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

  smallicon: {
    height: 15,
    width: 15,
    marginRight: 2,
  },

  mediumicon: {
    height: 20,
    width: 20,
  },

  alticon: {
    height: 32,
    width: 32,
  },
});

export default Statistics;