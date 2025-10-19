import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar, SafeAreaView, Animated } from 'react-native';
import { images } from '@/constants';
import colors from '@/constants/colors';

const carouselData = [
  { 
    id: 1, 
    image: images.background5,
    title: "Fast delivery of quality produce",
    subtitle: "Order food within 3 days and get a discount"
  },
  { 
    id: 2, 
    image: images.background4,
    title: "Fresh from farm to table",
    subtitle: "Locally sourced ingredients for your meals"
  },
  { 
    id: 3, 
    image: images.background3,
    title: "Healthy meals made easy",
    subtitle: "Nutritious options for every lifestyle"
  },
  { 
    id: 4, 
    image: images.background2,
    title: "Seasonal picks just for you",
    subtitle: "Enjoy the best produce each season brings"
  },
  { 
    id: 5, 
    image: images.background1,
    title: "Sustainable and eco-friendly choices",
    subtitle: "Support local farmers and the environment"
  },
  { 
    id: 6, 
    image: images.background0,
    title: "Convenience at your fingertips",
    subtitle: "Order anytime, anywhere with our easy app"
  },
];

const Reel = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clean up any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setCurrentIndex((prev) => (prev + 1) % carouselData.length);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        }
      });
    }, 3000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const currentItem = carouselData[currentIndex];

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.imageContainer}>
          <Animated.Image
            source={currentItem.image}
            style={[
              styles.absoluteFill,
              { opacity: fadeAnim }
            ]}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headertext}>{currentItem.title}</Text>
            <Text style={styles.headersub}>{currentItem.subtitle}</Text>
          </View>

          <View style={styles.pagination}>
            {carouselData.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex ? styles.active : styles.inactive
                ]}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.replace('/signin')}
          >
            <Text style={styles.buttontext}>Get started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(2, 2, 2, 0.74)',
  },
  
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 50,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },

  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 15, 15, 0.7)',
  },

  header: {
    width: '90%',
    flexDirection: 'column',
    gap: 20,
    marginBottom: 30,
  },

  headertext: {
    fontSize: 35,
    color: colors.white,
    fontFamily: 'Gilroy-SemiBold',
    lineHeight: 45,
  },

  headersub: {
    fontSize: 15,
    color: colors.dullGrey,
    fontFamily: 'Gilroy-Regular',
  },

  button: {
    width: '90%',
    backgroundColor: colors.complementary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
  },

  buttontext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    color: colors.white,
  },

  pagination: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,  
    justifyContent: 'center',
  },
  
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  
  active: {
    width: 30,
    backgroundColor: colors.white,
  },

  inactive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});

export default Reel;