import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';

/* Import React-Native Content */
import { View, Image, StyleSheet, FlatList, PanResponder, Animated, TouchableOpacity, StatusBar, ScrollView, Text, TextInput, ImageBackground, useColorScheme } from 'react-native';

/* Import Other Supported Content */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as Location from 'expo-location';
 
/* Import Icons, Colors, and Images */
import { icons, images } from '@/constants';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

const user = {  
  id: 0,
  fullname: 'Josiah-John Green',
  membership: 'Premium Member',
  email: 'josiahjohngreen@gmail.com',
  phone: '1-(876)-208-2517',
  image: images.placeholder,
};

const sections = [
  {
    id: 0,
    title: 'Account',
    image: icons.profilefill,
    link: '/editprofile',
  },
  {
    id: 1,
    title: 'Address',
    image: icons.location,
    link: '/address',
  },
  {
    id: 2,
    title: 'Orders',
    image: icons.orderfill,
    link: '/order',
  },
  {
    id: 3,
    title: 'Payments',
    image: icons.payments,
    link: '/payment',
  },
  {
    id: 4,
    title: 'Notifications',
    image: icons.notificationfill,
    link: '/notifications',
  },
  {
    id: 5,
    title: 'Settings',
    image: icons.settings,
    link: '/settings',
  },
  {
    id: 6,
    title: 'Membership',
    image: icons.profilefill,
    link: '/membership',
  },
  {
    id: 7,
    title: 'Logout',
    image: icons.logout,
    action: 'logout',
  },
];

const Profile = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleProfilePhoto = () => {

  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(screens)/(auth)/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const mainsection = sections.slice(0, 2);
  const othersection = sections.slice(2, 7);
  const footersection = sections.slice(7);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewArea}
          scrollEventThrottle={16}
          bounces={true}
        >
          {/* Header section that will scroll */}
          <ImageBackground
            source={images.texture2}
            style={styles.backgroundImage}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.profileheader}>
              <TouchableOpacity 
                style={styles.profileaddon}
                onPress={() => router.replace('/cart')}
              >
                <Image
                  source={icons.bag}
                  style={styles.tinyicon}
                  tintColor={colors.white}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.profilefooter}>
              <TouchableOpacity 
                style={styles.profileimage}
                onPress={handleProfilePhoto}  
              >
                <Image
                  source={user.image}
                  style={styles.largeimage}
                  resizeMode='cover'
                />
              </TouchableOpacity>

              <View style={styles.header}>
                <Text style={styles.headertext}>{user.fullname}</Text>              
                <Text style={styles.headersubtext}>{user.membership}</Text>
              </View>
            </View>
          </ImageBackground>

          {/* Content sections */}
          <View style={styles.container}>
            <View style={styles.profilebody}>
              <View style={[styles.sections, { marginTop: 20 }]}> 
                {mainsection.map((section, idx) => (
                  <React.Fragment key={section.id}>
                    <TouchableOpacity 
                      style={styles.section}
                      onPress={() => router.push(section.link)}
                    >
                      <View style={styles.sectionleft}>
                        <Image
                          source={section.image}
                          style={styles.smallicon}
                          tintColor={colors.black}
                        />
                        
                        <Text style={[styles.sectiontext, {}]}>{section.title}</Text>
                      </View>

                      <Image
                        source={icons.right}
                        style={styles.icon}
                        tintColor={colors.black}               
                      />
                    </TouchableOpacity>
                    
                    {idx < mainsection.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))}
              </View>  

              <View style={[styles.sections, { marginTop: 20 }]}> 
                {othersection.map((section, idx) => (
                  <React.Fragment key={section.id}>
                    <TouchableOpacity 
                      style={styles.section}
                      onPress={() => router.push(section.link)}
                    >
                      <View style={styles.sectionleft}>
                        <Image
                          source={section.image}
                          style={styles.smallicon}
                          tintColor={colors.black}
                        />
                        
                        <Text style={[styles.sectiontext, {}]}>{section.title}</Text>
                      </View>

                      <Image
                        source={icons.right}
                        style={styles.icon}
                        tintColor={colors.black}               
                      />
                    </TouchableOpacity>

                    {idx < othersection.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))}
              </View>  

              <View style={[styles.sections, { marginTop: 20 }]}> 
                {footersection.map((section, idx) => (
                  <React.Fragment key={section.id}>
                    <TouchableOpacity 
                      style={styles.section}
                      onPress={() => {
                        if (section.action === 'logout') {
                          handleLogout();
                        } else {
                          router.push(section.link);
                        }
                      }}
                    >
                      <View style={styles.sectionleft}>
                        <Image
                          source={section.image}
                          style={styles.smallicon}
                          tintColor={colors.red}
                        />
                        
                        <Text style={[styles.sectiontext, {color: colors.red}]}>{section.title}</Text>
                      </View>

                      <Image
                        source={icons.right}
                        style={styles.icon}
                        tintColor={colors.red}               
                      />
                    </TouchableOpacity>
                    {idx < footersection.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))}
              </View>              
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
  },

  scrollViewArea: {
    flexGrow: 1,
  },
  
  backgroundImage: {
    width: '100%',
    minHeight: 350,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  imageStyle: {
    backgroundColor: 'rgba(19, 18, 18, 0.71)',
    opacity: 0.7,
  },
  
  container: {
    alignItems: 'center',
    width: '100%',
    minHeight: 700,
    top: -30,
  },

  /* Header */
  
  header: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headertext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 20,
    color: colors.white,
  },

  headersubtext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 15,
    color: colors.white,
  },

  /* Profile */

  profileheader: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  profilefooter: {
    width: '90%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  profilebody: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 50,
  },

  profileimage: {
    overflow: 'hidden',
    borderRadius: 50,
    width: 100,
    height: 100,
  },

  profileaddon: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderRadius: 20,
  },

  /* Sections */

  sections: {
    backgroundColor: colors.backdrop,
    padding: 20,
    width: '90%',
    borderRadius: 20,
  },

  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },

  sectionleft: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  sectiontext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 17,
    color: colors.black,
  },

  /* Add-Ons */

  divider: {
    height: 1,
    backgroundColor: colors.gallery,
    marginVertical: 4,
    width: '100%',
    alignSelf: 'center',
  },

  /* Icons */

  icon: {
    width: 30,
    height: 30,
  },

  smallicon: {
    width: 20,
    height: 20,
  },

  tinyicon: {
    width: 25,
    height: 25,
  },

  /* Images */

  largeimage: {
    width: '100%',
    height: '100%',
  },
});

export default Profile;