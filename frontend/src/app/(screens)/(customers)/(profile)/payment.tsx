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

const payments = [
  {
    id: 1,
    type: 'mastercard',
    number: '1234 5678 9012 3456',
    cardholder: 'John Doe',
    expiry: '12/25',
  },
  {
    id: 2,
    type: 'visa',
    number: '1234 5678 9012 3456',
    cardholder: 'Jane Smith',
    expiry: '11/29',
  },
];

const Address = () => {
  const router = useRouter();

  const [selectedPayment, setSelectedPayment] = useState(null);

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
              
              <Text style={styles.headertext}>Payment</Text>            
            </View>

            <View style={styles.payments}>
              {payments.map(payment => (
                <TouchableOpacity
                  key={payment.id}
                  style={[styles.payment, selectedPayment?.id === payment.id && styles.selectedpayment]}
                  onPress={() => setSelectedPayment(payment)}
                >
                  <View style={styles.paymentinfos}>
                    <View style={styles.paymentinfo}>
                      <Image 
                        source={payment.type === 'mastercard' ? icons.mastercard : icons.visa}
                        style={styles.paymentype}
                        tintColor={''}
                      />

                      <Text style={styles.paymentext}>{payment.type}</Text>
                    </View>

                    <Text style={styles.paymentsubtext}>**** **** **** {payment.number?.slice(-4)}</Text>
                  </View>
                </TouchableOpacity>
              ))}            
            </View>
          </View>    
        </ScrollView>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/editpayment')}
        >
          <Text style={styles.buttontext}>Add Payment</Text>
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

  /* Payments */

  payments: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
  },
  
  payment: {
    backgroundColor: colors.gallery,
    padding: 30,
    borderRadius: 20,
    flexDirection: 'column',
    gap: 20,
    borderWidth: 1,
  },
  
  paymentinfos: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 10,
  },

  paymentinfo: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  paymentext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 15,
    color: colors.black,
    textTransform: 'capitalize',
  },
  
  paymentsubtext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 12,
    letterSpacing: 9,
  },

  paymentype: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
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