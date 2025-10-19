import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

// Import React-Native Content
import { View, Text, TextInput, Image, ImageBackground, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Supported Content
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay, Easing, runOnJS } from 'react-native-reanimated';
import Svg, { Path, Defs, Pattern, Image as SvgImage } from 'react-native-svg';

// Import Icons, Images, and Colors
import { icons, images } from '@/constants';
import colors from '@/constants/colors';
import { apiService } from '@/services/api';

const Forgot = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showRememberMe, setShowRememberMe] = useState(false);

  const [email, setEmail] = useState('');

  const handleBack = () => {
      router.back();
  };

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setLoading(true);
      const result = await apiService.forgotPassword(email);
      Alert.alert('Success', 'Verification code sent to your email');
      router.push(`/code?userId=${result.userId}`);
    } 
    catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send code');
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.waves}>
          <Svg
            height="300"
            width="200%"
            viewBox="0 0 440 165"
            style={[styles.wave, { bottom: 100 }]}
            preserveAspectRatio="none"
          >
            <Defs>
              <Pattern
                id="wavePattern"
                patternUnits="userSpaceOnUse"
                width="440"
                height="600"
              >
                <SvgImage
                  href={images.photo6}
                  width="440"
                  height="200"
                  preserveAspectRatio="xMidYMid slice"
                />
              </Pattern>
            </Defs>
            
            <Path
              fill="url(#wavePattern)"
              d="M 120 0 V 140 C 276 187 257 86 441 151 v -151 Z"
            />
          </Svg>
        </View>

        <View style={styles.container}>
          <View style={styles.backward}>
            <TouchableOpacity 
                style={styles.back}
                onPress={() => router.replace('/signin')}
            >
                <Image
                    source={icons.left}
                    style={styles.icon}
                    tintColor={colors.white}
                />
            </TouchableOpacity>
          </View>    

          <View style={styles.header}>
            <Text style={styles.headertext}>Forgot Password</Text>
            <Text style={styles.headersub}>Did you forget?</Text>        
          </View>

          <View style={styles.texts}>
            <Text style={styles.text}>Please check your email for the code</Text>  
          </View>

          <View style={styles.textfields}>
            <View style={styles.textfield}> 
              <View style={styles.textbody}>
                <Image
                  source={icons.email}
                  tintColor={colors.grey}
                  style={styles.icon}
                />

                <TextInput
                  style={styles.textinput}
                  placeholder="Email"
                  placeholderTextColor={colors.grey}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>
            </View>
          </View>

          <View style={styles.pages}>
            <Text style={styles.pagetext}>Page 1 of </Text>
            <Text style={styles.pagesub}>3</Text>
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttondisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttontext}>Send Code</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  
  container: {
    flexGrow: 1,
    alignItems: 'center',
    zIndex: 1,
    marginTop: 300,
  },

  /* Waves */

  overlay: {
  },

  waves: {
    position: 'absolute',
    height: 200,
    top: 160,
    right: 300,
    width: '100%',
    zIndex: 0,

  },
  
  wave: {
    position: 'absolute',
    elevation: 10,
    shadowColor: colors.black,
  },
  
  /* Header */

  header: {
    width: '80%',
    flexDirection: 'column',
    gap: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },

  headertext: {
    fontSize: 40,
    color: colors.elf,
    fontFamily: 'Gilroy-Bold',
  },

  headersub: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Montserrat-Medium',
  },

  /* Text */

  textfields: {
    width: '80%',
    gap: 10,
    marginBottom: 40,
  },

  textfield: {
    height: 55,
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    elevation: 10,
    shadowColor: colors.dullGrey,
  },

  textbody: {
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  textinput: {
    fontSize: 13,
    color: colors.elf,
    fontFamily: 'Montserrat-Medium',
  },

  /* Text */

  texts: {
    width: '80%',
  },
  
  text: {
    fontSize: 12,
    color: colors.dullGrey,
    fontFamily: 'Montserrat-Medium',
    marginBottom: 10,
  },

  /* Pages */

  pages: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    textAlign: 'right',
    gap: 2,
    zIndex: 2,
  },
  
  pagetext: {
    fontSize: 10,
    color: colors.elf,
    fontFamily: 'Gilroy-Medium',
    top: 3,
  },
    
  pagesub: {
    fontSize: 25,
    color: colors.elf,
    fontFamily: 'Gilroy-SemiBold',
  },

  /* Footer */

  footer: {
    width: '80%',
    flexDirection: 'column',
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  /* Button  */

  button: {
    width: '100%',
    backgroundColor: colors.elf,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    elevation: 10,
    shadowColor: colors.dullGrey,
  },

  buttondisabled: {
    opacity: 0.6,
  },

  buttontext: {
    fontSize: 13,
    color: colors.white,
    fontFamily: 'Gilroy-Bold',    
    letterSpacing: 2,
  },

  /* Sign */

  sign: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    alignItems: 'center',
  },

  signtext: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Montserrat-Medium',
  },

  signsub: {
    fontSize: 12,
    color: colors.elf,
    fontFamily: 'Gilroy-Bold',
  },

  /* Backward */

  backward: {
    width: '80%',
    marginTop: 20,
    zIndex: 2,
    justifyContent: 'flex-start',
  },

  /* Add-Ons */

  back: {
    position: 'absolute',
    borderRadius: 30,
    padding: 20,
    width: 50,
    height: 50,
    bottom: 250,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: colors.grey,
    zIndex: 1,
  },

  floatimage: {
    position: 'absolute',
    bottom: 350,
    right: -30,
    zIndex: 1,
  },

  /* Icons and Images */

  icon: {
    width: 18,
    height: 18,
  },

  image: {
    width: 150,
    height: 150,
  }
});

export default Forgot;