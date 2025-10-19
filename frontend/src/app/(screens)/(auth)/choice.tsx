import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

/* Import Supported Contents */
import { View, Text, TextInput, Image, ImageBackground, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay, Easing, runOnJS } from 'react-native-reanimated';
import Svg, { Path, Defs, Pattern, Image as SvgImage } from 'react-native-svg';

/* Import Icons, Images, and Colors */
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

const Choice = () => {

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showRememberMe, setShowRememberMe] = useState(false);

  const [selectedRole, setSelectedRole] = useState<'farmer' | 'customer' | null>(null);

  const handleNext = () => {
    if (selectedRole === 'farmer') {
      router.push('/(screens)/(auth)/farmer');
    } 
    else if (selectedRole === 'customer') {
      router.push('/(screens)/(auth)/customer');
    } 
    else {
      Alert.alert('Please select an option');
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>           
          <View style={styles.header}>
            <View style={styles.headercontent}>
              <Text style={styles.headertext}>I am a</Text>
              <Text style={styles.headersub}>Select the one that applies to you</Text>  
            </View>     
    
            <TouchableOpacity 
              style={styles.back}
              onPress={() => router.push('/(screens)/(auth)/signin')}
            >
              <Image
                source={icons.left}
                style={styles.icon}
                tintColor={colors.grey}
              />
            </TouchableOpacity>  
          </View>

          <View style={styles.choices}>
            <ImageBackground
              imageStyle={styles.imageOverlay}
              style={styles.imageSpace}
              source={images.texture2}
            >
              <TouchableOpacity 
                style={[
                  styles.choice,
                  selectedRole === 'farmer' && styles.selectedchoice
                ]}
                onPress={() => setSelectedRole('farmer')}
              >
                <View style={styles.choicecontent}>
                  <Text style={styles.choicetext}>Producer</Text>
                  <Text style={styles.choicesub}>Sell produce</Text>
                </View>
                <Image
                  source={images.photo1}
                  style={styles.image1}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </ImageBackground>

            <ImageBackground
              imageStyle={styles.imageOverlay}
              style={styles.imageSpace}
              source={images.texture2}
            >
              <TouchableOpacity 
                style={[
                  styles.choice,
                  selectedRole === 'customer' && styles.selectedchoice
                ]}
                onPress={() => setSelectedRole('customer')}
              >
                <View style={styles.choicecontent}>
                  <Text style={styles.choicetext}>Customer</Text>
                  <Text style={styles.choicesub}>Buy produce</Text>
                </View>
                <Image
                  source={images.photo2}
                  style={styles.image2}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={styles.forward}>
            <TouchableOpacity 
              style={styles.next}
              onPress={handleNext}
              disabled={!selectedRole}
            >
              <Text style={styles.nextext}>Next</Text>
              
              <Image
                source={icons.right}
                style={styles.bigicon}
                tintColor={colors.grey}
              />
            </TouchableOpacity> 
          </View>

          <View style={styles.register}>
            <Text style={styles.registertext}>Register</Text>
            <Text style={styles.registersub}>Create your account</Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    height: '100%',
    width: '100%',
    backgroundColor: colors.white,
  },

  imageOverlay: {
    width: '100%',
    height: '100%',
    opacity: 1,
  },

  imageSpace: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
  },
  
  container: {
    flexGrow: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  
  /* Header */

  header: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 80,
    marginTop: 50,
    zIndex: 1,
  },

  headercontent: {
    flexDirection: 'column',
    gap: 5,
  },

  headertext: {
    fontSize: 30,
    color: colors.yellow,
    fontFamily: 'Gilroy-Bold',
  },

  headersub: {
    fontSize: 13,
    color: colors.grey,
    fontFamily: 'Gilroy-Medium',
  },

  /* Choice */

  choices: {
    width: '80%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 15,
    zIndex: 1,
    marginBottom: 40,
  },

  choice: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    height: 250,
    width: '100%',
  },

  choicecontent: {
    flexDirection: 'column',
    gap: 2,
  },

  choicetext: {
    fontSize: 35,
    color: colors.white,
    fontFamily: 'Gilroy-Bold',    
  },

  choicesub: {
    fontSize: 10,
    color: colors.white,
    fontFamily: 'Gilroy-Medium',    
  },

  /* Footer */

  footer: {
    width: '80%',
    flexDirection: 'column',
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  /* Button */

  button: {
    width: '100%',
    backgroundColor: colors.darkgreen,
    borderRadius: 30,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  buttontext: {
    fontSize: 10,
    color: colors.white,
    fontFamily: 'Gilroy-Medium',    
    letterSpacing: 2,
  },

  /* Sign */

  sign: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },

  signtext: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Gilroy-Medium',
  },

  signsub: {
    fontSize: 12,
    color: colors.fresh,
    fontFamily: 'Gilroy-Regular',
    textDecorationLine: 'underline',
  },

  /* Register */

  register: {
    position: 'absolute',
    flexDirection: 'column',
    gap: 5,
    bottom: 205,
    left: -90,
    transform: [
      { rotate: '-90deg' },
      { translateX: -100 }
    ],
    opacity: 0.05,
    zIndex: 0,
  },

  registertext: {
    fontSize: 85,
    color: colors.yellow,
    fontFamily: 'Gilroy-Bold',
  },

  registersub: {
    fontSize: 25,
    color: colors.grey,
    fontFamily: 'Gilroy-Regular',
  },

  /* Next */

  selectedchoice: {
    borderWidth: 2,
    borderColor: colors.white, 
    backgroundColor: 'rgba(46, 204, 113, 0.1)', 
    elevation: 200,
    zIndex: 102,
  },
  
  next: {
    opacity: 1,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  disablednext: {
    opacity: 0.5,
  },

  nextext: {
    fontSize: 25,
    color: colors.grey,
    fontFamily: 'Gilroy-Regular',
  },

  /* Add-Ons  */

  back: {
    padding: 20,
    borderRadius: 15,
    width: 45,
    height: 45,
    backgroundColor: colors.gallery,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    cursor: 'pointer',
  },

  forward: {
    width: '80%',
    alignItems: 'flex-end',
    cursor: 'pointer',
  },

  /* Icons and Images */

  icon: {
    width: 18,
    height: 18,
  },

  bigicon: {
    width: 30,
    height: 30,
  },

  image1: {
    position: 'absolute',
    width: 400,
    height: 330,
    top: -40,
    right: -120,    
  },

  image2: {
    position: 'absolute',
    width: 350,
    height: 350,
    top: -55,
    right: -85,
        
  }
});

export default Choice;