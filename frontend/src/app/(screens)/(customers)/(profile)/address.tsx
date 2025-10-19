import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

/* Import React-Native Content */
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, StatusBar } from 'react-native';

/* Import Supported Content */
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native'; 

/* Import Icons and Images */
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

const shipping = {
  street: '4 Marvic Close',
  city: 'Red Hills',
  state: 'St. Andrew',
  country: 'Jamaica.',
  type: 'Home 01',
};

const Address = () => {
  const router = useRouter();

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
              
              <Text style={styles.headertext}>Address</Text>            
            </View>

            <View style={styles.addresses}>
              <TouchableOpacity 
                style={styles.address}
                onPress={() => router.push('/editaddress')}
              >
                <View style={styles.addressbody}>
                  <View style={styles.addresscontent}>
                    <Image 
                      source={icons.location}
                      tintColor={colors.black}
                      style={styles.smallicon}
                    />
                    
                    <Text style={styles.addresscontentext}>{shipping.type}</Text>
                  </View>

                  <Text style={styles.addressline}>{shipping.street}, {shipping.city}, {shipping.state},{"\n"}{shipping.country}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>    
        </ScrollView>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/editaddress')}
        >
          <Text style={styles.buttontext}>Add Address</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollViewArea: {

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

  /* Address */
  
  addresses: {
    width: '100%',
  },

  address: {
    backgroundColor: colors.gallery,
    padding: 30,
    borderRadius: 20,
    flexDirection: 'column',
    gap: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
  },

  addressheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: colors.charcoal,
    paddingBottom: 10,
    marginTop: 10,
  },
  
  addresstext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 18,
    marginBottom: 10,
  },

  addressubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    marginBottom: 10,
    color: colors.dullGrey,
  },

  addressline: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    marginBottom: 10,
    color: colors.grey,
    lineHeight: 25,
  },
  
  addressbody: {
    flexDirection: 'column',
    gap: 20,
  },

  addresscontent: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  addresscontentext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 18,
    color: colors.charcoal,
  },

  /* Add-Ons */
  
  back: {
    backgroundColor: colors.gallery,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },

  button: {
    width: '90%',
    backgroundColor: colors.black,
    padding: 15,
    borderRadius: 15,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttontext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 15,
    color: colors.white,
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
});

export default Address;