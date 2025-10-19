import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

/* Import eact-Native Content */
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, StatusBar, Modal, FlatList } from 'react-native';

/* Import Supported Content */
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native'; 
import DropDownPicker from 'react-native-dropdown-picker';

/* Import Icons and Images */
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

const dropdownItems = {
  parishes: [
    {label: 'Kingston', value: 'kingston'},
    {label: 'St. Andrew', value: 'standrew'},
    {label: 'St. Thomas', value: 'stthomas'},
    {label: 'Portland', value: 'portland'},
    {label: 'St. Catherine', value: 'stcatherine'},
    {label: 'St. Ann', value: 'stann'},
    {label: 'St. Mary', value: 'stmary'},
    {label: 'St. James', value: 'stjames'},
    {label: 'Trelawny', value: 'trelawny'},
    {label: 'Hanover', value: 'hanover'},
    {label: 'Westmoreland', value: 'westmoreland'},
    {label: 'Clarendon', value: 'clarendon'},
  ],
  countries: [
    {label: 'Jamaica', value: 'jamaica'}
  ]
};

const EditAddress = () => {
  
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [parish, setParish] = useState(null);
  const [country, setCountry] = useState('jamaica');

  const handleAddress = () => {};

  const CustomDropdown = ({ 
    label, 
    value, 
    items, 
    placeholder,
    setValue,
    dropdownKey
  }) => (
    <View style={[
      styles.dropdownWrapper,
      { zIndex: openDropdown === dropdownKey ? 1000 : 1 }
    ]}>
      <Text style={styles.text}>{label}</Text>
      <DropDownPicker
        open={openDropdown === dropdownKey}
        value={value}
        items={items}
        setOpen={(isOpen) => setOpenDropdown(isOpen ? dropdownKey : null)}
        setValue={setValue}
        placeholder={placeholder}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={styles.dropdownText}
        placeholderStyle={styles.placeholderText}
        listItemLabelStyle={styles.dropdownItemText}
        ArrowDownIconComponent={() => (
          <Image source={icons.down} style={styles.dropdownIcon} />
        )}
        ArrowUpIconComponent={() => (
          <Image source={icons.up} style={styles.dropdownIcon} />
        )}
        TickIconComponent={() => (
          <Image source={icons.check} style={styles.dropdownIcon} />
        )}
        onPress={() => setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey)}
      />
    </View>
  );

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
              
              <Text style={styles.headertext}>{isEditing ? 'Add' : 'Edit'} Address</Text>            
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

              <CustomDropdown
                label="State/Parish"
                value={parish}
                items={dropdownItems.parishes}
                placeholder="Select State/Parish"
                setValue={setParish}
                dropdownKey="parish"
              />

              <CustomDropdown
                label="Country"
                value={country}
                items={dropdownItems.countries}
                placeholder="Select Country"
                setValue={setCountry}
                dropdownKey="country"
              />

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

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleAddress}
        >
          <Text style={styles.buttontext}>{isEditing ? 'Add' : 'Edit'} Address</Text>
        </TouchableOpacity>
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

  /* Search */

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

  /* Dropdown */

  dropdownWrapper: {
    marginBottom: 20,
  },
  
  dropdown: {
    backgroundColor: colors.gallery,
    borderWidth: 0,
    borderRadius: 18,
    paddingHorizontal: 15,
    minHeight: 50,
  },
  
  dropdownContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gallery,
    borderRadius: 18,
    marginTop: 5,
  },
  
  dropdownText: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.charcoal,
  },
  
  placeholderText: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.2)',
  },
  
  dropdownItemText: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.charcoal,
  },
  
  dropdownIcon: {
    width: 15,
    height: 15,
    tintColor: 'rgba(0, 0, 0, 0.5)',
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
    width: 15,
    height: 15,
  },

  smallicon: {
    width: 20,
    height: 20,
  },
});

export default EditAddress;