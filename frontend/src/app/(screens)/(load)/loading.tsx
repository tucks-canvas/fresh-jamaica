import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

/* */
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing,
  runOnJS
} from 'react-native-reanimated';

/* */
import { images } from '@/constants';
import colors from '@/constants/colors';

const Loading = () => {
  const router = useRouter();
  
  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);

  const textY = useSharedValue(30);
  const textOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  
  const dotScale = useSharedValue(0.1);
  const dotOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { 
      duration: 1000, 
      easing: Easing.out(Easing.elastic(1)) 
    });

    setTimeout(() => {
      textY.value = withSequence(
        withTiming(-5, { duration: 200 }),
        withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) })
      );
      textOpacity.value = withTiming(1, { duration: 500 });
      subtitleOpacity.value = withTiming(1, { duration: 500 });
      
      setTimeout(() => {
        subtitleOpacity.value = withTiming(0, { duration: 200 }, () => {
          dotOpacity.value = withTiming(1, { duration: 200 });
          dotScale.value = withSequence(
            withTiming(1.5, { duration: 150, easing: Easing.out(Easing.quad) }),
            withTiming(0.8, { duration: 100, easing: Easing.out(Easing.quad) }),
            withTiming(
              100,
              {
                duration: 800,
                easing: Easing.in(Easing.exp),
              },
              () => {
                runOnJS(router.replace)('/reel');
              }
            )
          );
        });
      }, 1000);
    }, 500);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }]
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }]
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
    transform: [{ scale: dotScale.value }],
    top: '50%',
    marginTop: 13,
  }));

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.content}>            
            <View style={styles.textcontainer}>
              <Animated.View style={[styles.texts, textStyle]}>
                <Text style={styles.title}>fresh</Text>
                <Text style={styles.altitle}>ja</Text>
                <Animated.View style={[styles.dot, dotStyle]} />
              </Animated.View>
              
              <Animated.View style={[styles.subtitlecontainer, subtitleStyle]}>
                <Text style={styles.subtitle}>for you</Text>
              </Animated.View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backdrop,
  },
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Content */
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Text */
  
  textcontainer: {
    position: 'relative',
  },
  
  texts: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Title */
  
  title: {
    fontSize: 50,
    color: colors.default,
    fontFamily: 'Gilroy-ExtraBold',
  },
  
  subtitlecontainer: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
  },
  
  subtitle: {
    fontSize: 10,
    color: colors.complementary,
    fontFamily: 'Gilroy-Bold',
    textTransform: 'uppercase',
    letterSpacing: 7,
  },

  altitle: {
    fontSize: 50,
    color: colors.complementary,
    fontFamily: 'Gilroy-ExtraBold',
  },

  /* Dot */

  dot: {
    position: 'absolute',
    right: -15,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.default,
  },

  /* Logo */

  logocontainer: {
    marginRight: 20,
  },

  /* Image and Icons */

  image: {
    width: 130,
    height: 300,
    top: -20,
  },
});

export default Loading;