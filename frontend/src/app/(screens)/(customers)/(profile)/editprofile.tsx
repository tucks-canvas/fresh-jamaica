import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

// Import eact-Native Content
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, StatusBar } from 'react-native';

// Import Supported Content
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native'; 

// Import Icons and Images
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

const EditProfile = () => {
  
  const router = useRouter();

  const handleProfilePhoto = () => {
    
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewArea}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.back}
                onPress={() => router.back()}
              >
                <Image
                  source={icons.left}
                  style={styles.icon}
                />
              </TouchableOpacity>
              
              <Text style={styles.headertext}>Edit Profile</Text>            
            </View>

            <View style={styles.profiles}>
              <TouchableOpacity 
                onPress={handleProfilePhoto}
                style={styles.profile}
              > 
                <Image
                  source={images.background1}
                  style={styles.largeimage}
                />
              </TouchableOpacity>

              <Text style={styles.profiletext}>Josiah-John Green</Text>
              <Text style={styles.profilesubtext}>Premium Member</Text>
            </View>

            <View style={styles.textbody}>              
              <View style={styles.textinputs}>
                <Text style={styles.text}>Address Line 1</Text>

                <View style={styles.textinput}>
                  <Image
                    source={icons.text}
                    style={styles.icon}
                    tintColor='rgba(0, 0, 0, 0.2)'
                  />

                  <TextInput
                    placeholder="Address Line 1"
                    placeholderTextColor='rgba(0, 0, 0, 0.2)'
                    style={styles.subtext}
                    autoFocus={true}
                  />
                </View>
              </View>

              <View style={styles.textinputs}>
                <Text style={styles.text}>Address Line 2</Text>

                <View style={styles.textinput}>
                  <Image
                    source={icons.text}
                    style={styles.icon}
                    tintColor='rgba(0, 0, 0, 0.2)'
                  />

                  <TextInput
                    placeholder="Street Name"
                    placeholderTextColor='rgba(0, 0, 0, 0.2)'
                    style={styles.subtext}
                    autoFocus={true}
                  />
                </View>
              </View>

              <View style={styles.textinputs}>
                <Text style={styles.text}>Postal Code</Text>

                <View style={styles.textinput}>
                  <Image
                    source={icons.text}
                    style={styles.icon}
                    tintColor='rgba(0, 0, 0, 0.2)'
                  />

                  <TextInput
                    placeholder="Postal Code"
                    placeholderTextColor='rgba(0, 0, 0, 0.2)'
                    style={styles.subtext}
                    autoFocus={true}
                  />
                </View>
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

  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },

  scrollViewArea: {

  },

  /* Image */

  profiles: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  profile: {
    height: 200,
    width: 200,
    borderRadius: '100%',
    overflow: 'hidden',
  },

  profiletext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 25,
    color: colors.charcoal,
    marginTop: 20,
  },

  profilesubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 10,
    color: colors.charcoal,
    marginTop: 10,
    marginBottom: 30,
  },

  /* Header */

  header: {
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',    
  },
  
  headertext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 25,
  },

  /* Text */

  textbody: {
    flexDirection: 'column',
  },

  textinputs: {
    flexDirection: 'column',
  },

  textinput: {
    width: '100%',
    backgroundColor: colors.gallery,
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',   
    marginVertical: 20, 
    borderRadius: 18,
    padding: 10,
  },

  text: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.charcoal,
    marginRight: 120,
  },

  subtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.charcoal,
    marginRight: 120,
  },


  /* Add-Ons */
  
  back: {
    backgroundColor: colors.gallery,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },

  /* Selected */

  selectedcard: {
    backgroundColor: '#f1f9f5',
    borderColor: colors.black,
  },

  /* Button */

  button: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginTop: 10 
  },

  /* Icons */

  icon: {
    width: 24,
    height: 24,
  },

  smallicon: {
    width: 20,
    height: 20,
  },

  /* Images */

  largeimage: {
    width: '100%',
    height: '100%',
  }
});

export default EditProfile;