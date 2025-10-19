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

const settings = [
  {
    id: 0,
    title: 'Push Notifications',
  },
  {
    id: 1,
    title: 'Email Notifications',
  },
  {
    id: 2,
    title: 'Dark Mode',
  },
  {
    id: 3,
    title: 'Location Access',
  },
  {
    id: 4,
    title: 'Language',
  },
  {
    id: 5,
    title: 'Privacy Settings',
  },
  {
    id: 6,
    title: 'Account Security',
  },
];

const Settings = () => {
  const router = useRouter();

  const mainsetting = settings.slice(0, 2);
  const othersetting = settings.slice(2, 7);

  const [selectedSettings, setSelectedNotifications] = useState({});

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
              <Text style={styles.headertext}>Settings</Text>            
            </View>

            <View style={[styles.settings, { marginTop: 20 }]}> 
              {mainsetting.map((setting, idx) => (
                <React.Fragment key={setting.id}>
                  <TouchableOpacity 
                    style={styles.setting}
                    onPress={() => toggleButton(setting.id)}
                  >                  
                    <Text style={styles.settingtext}>{setting.title}</Text>
                    <Image
                      source={selectedSettings[setting.id] ? icons.on : icons.off}
                      style={styles.icon}
                      tintColor={selectedSettings[setting.id] ? colors.fresh : colors.black}               
                    />
                  </TouchableOpacity>
                  {idx < mainsetting.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              ))}
            </View>

            <View style={[styles.settings, { marginTop: 20 }]}> 
              {othersetting.map((setting, idx) => (
                <React.Fragment key={setting.id}>
                  <TouchableOpacity 
                    style={styles.setting}
                    onPress={() => toggleButton(setting.id)}
                  >                  
                    <Text style={styles.settingtext}>{setting.title}</Text>
                    
                    <Image
                      source={selectedSettings[setting.id] ? icons.on : icons.off}
                      style={styles.icon}
                      tintColor={selectedSettings[setting.id] ? colors.fresh : colors.black}               
                    />
                  </TouchableOpacity>
                  {idx < othersetting.length - 1 && (
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

  settings: {
    backgroundColor: colors.backdrop,
    padding: 20,
    width: '100%',
    borderRadius: 20,
  },

  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },

  settingtext: {
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

export default Settings;