import React, { useState } from 'react';
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

const notifications = [
  {
    id: 0,
    title: 'Order Updates',
  },
  {
    id: 1,
    title: 'Promotions & Discounts',
  },
  {
    id: 2,
    title: 'System Notifications',
  },
  {
    id: 3,
    title: 'New Product Arrivals',
  },
  {
    id: 4,
    title: 'Farmer Messages',
  },
  {
    id: 5,
    title: 'Delivery Reminders',
  },
  {
    id: 6,
    title: 'Out of Stock Alerts',
  },
  {
    id: 7,
    title: 'Review Requests',
  },
];


const Notifications = () => {
  const router = useRouter();

  const mainotifications = notifications.slice(0, 3);
  const othernotifications = notifications.slice(3);

  const [selectedNotifications, setSelectedNotifications] = useState({});

  const toggleButton = (id) => {
    setSelectedNotifications((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
              
              <Text style={styles.headertext}>Notification</Text>            
            </View>

            <View style={[styles.notifications, { marginTop: 20 }]}> 
              {mainotifications.map((notification, idx) => (
                <React.Fragment key={notification.id}>
                  <TouchableOpacity 
                    style={styles.notification}
                    onPress={() => toggleButton(notification.id)}
                  >                  
                    <Text style={styles.notificationtext}>{notification.title}</Text>
                    <Image
                      source={selectedNotifications[notification.id] ? icons.on : icons.off}
                      style={styles.icon}
                      tintColor={selectedNotifications[notification.id] ? colors.fresh : colors.black}               
                    />
                  </TouchableOpacity>
                  {idx < mainotifications.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              ))}
            </View>

            <View style={[styles.notifications, { marginTop: 20 }]}> 
              {othernotifications.map((notification, idx) => (
                <React.Fragment key={notification.id}>
                  <TouchableOpacity 
                    style={styles.notification}
                    onPress={() => toggleButton(notification.id)}
                  >                  
                    <Text style={styles.notificationtext}>{notification.title}</Text>
                    <Image
                      source={selectedNotifications[notification.id] ? icons.on : icons.off}
                      style={styles.icon}
                      tintColor={selectedNotifications[notification.id] ? colors.fresh : colors.black}               
                    />
                  </TouchableOpacity>
                  {idx < othernotifications.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              ))}
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

  /* Notifications */

  notifications: {
    backgroundColor: colors.backdrop,
    padding: 20,
    width: '100%',
    borderRadius: 20,
  },

  notification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },

  notificationtext: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 17,
    color: colors.black,
  },

  /* Add-Ons */
  
  back: {
    backgroundColor: colors.gallery,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: colors.gallery,
    marginVertical: 4,
    width: '100%',
    alignSelf: 'center',
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

export default Notifications;