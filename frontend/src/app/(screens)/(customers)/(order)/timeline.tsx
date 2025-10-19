import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

/* Import React-Native Content */
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* Import Colors, Icons, and Images */
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

const orderstages = [
  { 
    id: 1, 
    status: 'Order Placed', 
    text: 'Your order has been placed and is being processed. We will notify you once it moves to the next stage.' 
  },
  { 
    id: 2, 
    status: 'Pending', 
    text: 'Your order is pending confirmation. Please wait while we verify your details and payment.' 
  },
  { 
    id: 3, 
    status: 'Confirmed', 
    text: 'Your order has been confirmed. Our team is preparing everything for fulfillment.' 
  },
  { 
    id: 4, 
    status: 'Processing', 
    text: 'Your order is being prepared. We are carefully packing your items for delivery.' 
  },
  { 
    id: 5, 
    status: 'In-Transit', 
    text: 'Your order is on the way. Track your delivery as it makes its way to you.' 
  },
  { 
    id: 6, 
    status: 'Delivered', 
    text: 'Your order has been delivered. We hope you enjoy your purchase and shop again soon.'
  },
];

const Timeline = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const currentStatus = params.status || 'Confirmed';
  const placedDate = params.date ? new Date(params.date) : new Date();

  const currentIdx = orderstages.findIndex(s => s.status === currentStatus) >= 0
    ? orderstages.findIndex(s => s.status === currentStatus)
    : 0;

  const getStageTime = idx => {
    if (idx === 0) return placedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (idx <= currentIdx) return placedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return '';
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.back}
              onPress={() => router.push('/order')}
            >
              <Image
                source={icons.left}
                style={styles.icon}
              />
            </TouchableOpacity>
            
            <Text style={styles.headertext}>Order Details</Text>            
          </View>
          
          <View style={styles.timelines}>
            {orderstages.map((stage, idx) => {
              const reached = idx <= currentIdx;
              const isCurrent = idx === currentIdx;
              const isLast = idx === orderstages.length - 1;
              
              return (
                <View 
                  key={stage.id} 
                  style={styles.timeline}
                >
                  <View style={styles.dotcolumn}>

                    <View style={[
                      styles.dot,
                      reached && styles.dotreached,
                      isCurrent && styles.dotcurrent,
                      isCurrent && styles.glow
                    ]} />
                    
                    {!isLast && <View style={[
                      styles.stick,
                      reached && styles.stickReached
                    ]} />}
                  </View>
                  
                  <View style={styles.stagecolumn}>
                    <View style={styles.stageheader}>
                      <Text style={[
                        styles.stagetext,
                        reached && styles.stagetextReached,
                        isCurrent && styles.stagetextCurrent
                      ]}>
                        {stage.status}
                      </Text>
                  
                      {reached && (
                        <Text style={styles.timetext}>{getStageTime(idx)}</Text>
                      )}
                    </View>
                  
                    <Text style={styles.stagesubtext}>{stage.text}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.buttons}>            
            <View style={styles.buttonorders}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => router.replace('/track')}
              >
                <Text style={styles.buttontext}>Track Order</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, {backgroundColor: colors.red}]}
                onPress={() => router.replace('')}
              >
                <Text style={styles.buttontext}>Cancel Order</Text>
              </TouchableOpacity>              
            </View>

            <TouchableOpacity 
              style={[styles.button, {backgroundColor: colors.fresh}]}
              onPress={() => router.replace('/home')}
            >
              <Text style={styles.buttontext}>Go Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    paddingTop: 30,
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
    color: colors.black,
  },

  /* Timeline */
  
  timelines: {
    flexDirection: 'column',
    width: '100%',
    gap: 4,
    marginTop: 20,
    marginBottom: 20,
  },
  
  timeline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 70,
  },

  /* Dot */
  
  dotcolumn: {
    position: 'relative',
    alignItems: 'center',
    width: 40,
    top: 8,
  },
  
  dot: {
    backgroundColor: 'transparent',
    width: 10,
    height: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.dullGrey,
    marginTop: 2,
    zIndex: 2,
  },
  
  dotreached: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  
  dotcurrent: {
    backgroundColor: colors.black,
    borderColor: colors.black,
    borderWidth: 0.5,
  },
  
  glow: {
    shadowColor: colors.black,
    shadowOffset: { 
      width: 0, 
      height: 0 
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  
  stick: {
    width: 2,
    flex: 1,
    backgroundColor: colors.lightGrey,
    marginTop: 0,
    marginBottom: -5,
    alignSelf: 'center',
    zIndex: 1,
  },

  stickReached: {
    backgroundColor: colors.black,
  },
  
  /* Stages */

  stagecolumn: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 18,
    paddingTop: 2,
  },
  
  stageheader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  
  stagetext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 18,
    color: colors.dullGrey,
  },
  
  stagetextReached: {
    color: colors.black,
    fontFamily: 'Gilroy-Medium',
  },
  
  stagetextCurrent: {
    color: colors.black,
    fontFamily: 'Gilroy-Medium',
  },
  
  timetext: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 13,
    color: colors.dullGrey,
  },

  stagesubtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 13,
    color: colors.dullGrey,
    lineHeight: 20,
    marginTop: 2,
  },

  /* Add-Ons */

  back: {
    backgroundColor: colors.gallery,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },

  buttons: {
    width: '100%',
    flexDirection : 'column',
    gap: 10,
  },

  buttonorders: {
    width: '49%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },

  button: {
    width: '100%',
    backgroundColor: colors.black,
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttontext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 10,
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

export default Timeline;
