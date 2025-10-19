import React from 'react';
import { useRouter } from 'expo-router';

// Import Supported Content
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons and Images
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

const PaymentSuccess = () => {
  const router = useRouter();

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ImageBackground
          imageStyle={styles.imageStyle}
          style={styles.imageSpace}
          source={images.texture6}
        >
          <View style={styles.container}>
            <Image 
              source={icons.checkmark} 
              style={styles.image} 
              tintColor={colors.black}
            />

            <Text style={styles.header}>Payment Successful!</Text>
            <Text style={styles.message}>Thank you for your purchase. Your order will be processed soon.</Text>
            
            <View style={styles.buttons}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => router.push('/track')}
              >
                <Text style={styles.buttontext}>Track My Order</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, {backgroundColor: colors.fresh}]} 
                onPress={() => router.push('/home')}
              >
                <Text style={styles.buttontext}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          </View>  
        </ImageBackground> 
      </SafeAreaView> 
    </>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    top: -40
  },

  imageStyle: {
    height: '100%',
    width: '100%',
    opacity: 0,
  },

  imageSpace: {
    height: '120%',
    width: '100%',
    top: -25,
  },

  /* Header */
  
  header: {
    fontSize: 24,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 20,
    color: colors.black,
  },

  /* Message */
  
  message: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Gilroy-Regular',
    marginBottom: 30,
    lineHeight: 25,
    width: '70%',
    color: colors.black,
  },

  /* Button */

  buttons: {
    flexDirection: 'column',
    gap: 10,
  },
  
  button: {
    backgroundColor: colors.black,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  
  buttontext: {
    color: colors.white,
    fontSize: 13,
    fontFamily: 'Gilroy-SemiBold',
  },

  /* Images */

  image: {
    width: 80, 
    height: 80, 
    marginBottom: 20,
  },
});

export default PaymentSuccess;
