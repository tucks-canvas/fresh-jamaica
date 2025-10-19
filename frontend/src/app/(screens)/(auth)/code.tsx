import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

// Import Supported Contents
import { View, Text, TextInput, Image, ImageBackground, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Defs, Pattern, Image as SvgImage } from 'react-native-svg';

// Import Animations
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay, Easing, runOnJS } from 'react-native-reanimated';

// Import Icons, Images, and Colors
import { icons, images } from '@/constants';
import colors from '@/constants/colors';
import { apiService } from '@/services/api';

const Code = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Get userId from query params
  const { userId } = router.params || {};
  
  const [codes, setCodes] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, 4);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers and limit to 1 character
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 1);
    
    const newCodes = [...codes];
    newCodes[index] = numericText;
    setCodes(newCodes);

    // Auto-focus next input
    if (numericText && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all fields are filled
    if (newCodes.every(code => code !== '') && index === 3) {
      handleVerify();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to focus previous input
    if (e.nativeEvent.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = codes.join('');
    
    if (code.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit code');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'Invalid verification session');
      return;
    }

    try {
      setLoading(true);
      await apiService.verifyResetCode(userId, code);
      
      Alert.alert('Success', 'Code verified successfully!');
      router.push({
        pathname: '/new',
        params: { userId, code }
      });
    } 
    catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid or expired code');
      // Clear all inputs on error
      setCodes(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } 
    finally {
      setLoading(false);
    }
  };

  const isFormValid = codes.every(code => code !== '');

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
                onPress={() => router.replace('/forgot')}
            >
                <Image
                    source={icons.left}
                    style={styles.icon}
                    tintColor={colors.white}
                />
            </TouchableOpacity>
          </View> 
          
          <View style={styles.header}>
            <Text style={styles.headertext}>Verification Code</Text>
            <Text style={styles.headersub}>Let's get your code</Text>        
          </View>

          <View style={styles.texts}>
            <Text style={styles.text}>Please check your email for the code</Text>  
          </View>

          <View style={styles.textfields}>
            {[0, 1, 2, 3].map((index) => (
              <View key={index} style={styles.textfield}>
                <View style={styles.textbody}>
                  <TextInput
                    ref={(ref) => inputRefs.current[index] = ref}
                    style={styles.textinput}
                    placeholder="•"
                    placeholderTextColor={colors.grey}
                    value={codes[index]}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                    editable={!loading}
                  />
                </View>
              </View>
            ))}
          </View>
          
          <View style={styles.pages}>
            <Text style={styles.pagetext}>Page 2 of </Text>
            <Text style={styles.pagesub}>3</Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.button, 
                (!isFormValid || loading) && styles.buttondisabled
              ]}
              onPress={handleVerify}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttontext}>
                  {isFormValid ? 'Verify Code' : 'Enter Code'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.resend}
              onPress={() => {
                Alert.alert('Info', 'Resend code functionality to be implemented');
              }}
            >
              <Text style={styles.resendtext}>
                Didn't receive code? <Text style={styles.resendsubtext}>Resend</Text>
              </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  textfield: {
    height: 55,
    width: 55,
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

  buttondisabled:{
    opacity: 0.6,
  },

  buttontext: {
    fontSize: 13,
    color: colors.white,
    fontFamily: 'Gilroy-Bold',    
    letterSpacing: 2,
  },

  /* Resend */

  resend: {
    marginTop: 10,
  },

  resendtext: {
    fontSize: 12,
    color: colors.dullGrey,
    fontFamily: 'Montserrat-Medium',
  },

  resendsubtext: {
    color: colors.elf,
    fontFamily: 'Gilroy-Bold',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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

export default Code;