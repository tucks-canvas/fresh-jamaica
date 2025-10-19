import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

// Import eact-Native Content
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, StatusBar, Modal, FlatList } from 'react-native';

// Import Supported Content
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native'; 
import DropDownPicker from 'react-native-dropdown-picker';

// Import Icons and Images
import { icons, images } from '@/constants';
import colors from '@/constants/colors';


const EditPayment = () => {
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [bank, setBank] = useState(null);
  const [branch, setBranch] = useState(null);
  const [availableBranches, setAvailableBranches] = useState([]);

  /* Other Constants */

  const dropdownItems = {
    banks: [
      {label: 'National Commercial Bank (NCB)', value: 'ncb'},
      {label: 'Scotiabank Jamaica', value: 'scotiabank'},
      {label: 'CIBC FirstCaribbean', value: 'firstcaribbean'},
      {label: 'JN Bank', value: 'jnbank'},
      {label: 'Sagicor Bank', value: 'sagicor'},
      {label: 'First Global Bank', value: 'firstglobal'}
    ],
    accountTypes: [
      {label: 'Savings', value: 'savings'},
      {label: 'Checkings', value: 'checkings'}
    ]
  };

  const bankBranches = {
    ncb: [
      { label: 'NCB Kingston Main Branch (32-36 Harbour Street)', value: 'ncb-harbour' },
      { label: 'NCB Half Way Tree (30-32 HWT Road)', value: 'ncb-hwt' },
      { label: 'NCB New Kingston (1-3 Knutsford Blvd)', value: 'ncb-newkingston' },
      { label: 'NCB Montego Bay (44 Fort Street)', value: 'ncb-mobay' },
      { label: 'NCB Mandeville (18 Caledonia Road)', value: 'ncb-mandeville' },
      { label: 'NCB Ocho Rios (9 Milford Road)', value: 'ncb-ocho' },
      { label: 'NCB Portmore (Portmore Mall)', value: 'ncb-portmore' },
      { label: 'NCB Spanish Town (1 Brunswick Avenue)', value: 'ncb-spanishtown' },
      { label: 'NCB May Pen (44 Main Street)', value: 'ncb-maypen' },
      { label: 'NCB Savanna-la-Mar (Great George Street)', value: 'ncb-sav' },
      { label: 'NCB Trafalgar Road (Headquarters)', value: 'ncb-hq' }
    ],
    scotiabank: [
      { label: 'Scotiabank Browns Town (Main Street)', value: 'scotia-browntown' },
      { label: 'Scotiabank Christiana (Main Street)', value: 'scotia-christiana' },
      { label: 'Scotiabank Constant Spring Road', value: 'scotia-constantspring' },
      { label: 'Scotiabank Fairview Financial Centre', value: 'scotia-fairview' },
      { label: 'Scotiabank Ironshore', value: 'scotia-ironshore' },
      { label: 'Scotiabank Half Way Tree', value: 'scotia-hwt' },
      { label: 'Scotiabank Hagley Park Road', value: 'scotia-hagley' },
      { label: 'Scotiabank Junction', value: 'scotia-junction' },
      { label: 'Scotiabank Liguanea', value: 'scotia-liguanea' },
      { label: 'Scotiabank Linstead', value: 'scotia-linstead' },
      { label: 'Scotiabank Mandeville', value: 'scotia-mandeville' },
      { label: 'Scotiabank May Pen', value: 'scotia-maypen' },
      { label: 'Scotiabank Montego Bay (Sam Sharpe Square)', value: 'scotia-mobay' },
      { label: 'Scotiabank Morant Bay', value: 'scotia-morantbay' },
      { label: 'Scotiabank Negril', value: 'scotia-negril' },
      { label: 'Scotiabank New Kingston', value: 'scotia-newkingston' },
      { label: 'Scotiabank Oxford Road', value: 'scotia-oxford' },
      { label: 'Scotiabank Port Antonio', value: 'scotia-portantonio' },
      { label: 'Scotiabank Port Maria', value: 'scotia-portmaria' },
      { label: 'Scotiabank Portmore', value: 'scotia-portmore' },
      { label: 'Scotiabank Santa Cruz', value: 'scotia-santacruz' },
      { label: 'Scotiabank Savannah-la-Mar', value: 'scotia-savlamar' },
      { label: 'Scotiabank Centre (Main Branch)', value: 'scotia-main' },
      { label: 'Scotiabank Spanish Town', value: 'scotia-spanishtown' },
      { label: 'Scotiabank St. Ann\'s Bay', value: 'scotia-stannsbay' },
      { label: 'Scotiabank Trelawny', value: 'scotia-trelawny' },
      { label: 'Scotiabank UWI Mona Campus', value: 'scotia-uwi' }
    ],
    firstcaribbean: [
      { label: 'CIBC New Kingston Branch', value: 'cibc-newkingston' },
      { label: 'CIBC Half Way Tree Branch', value: 'cibc-hwt' },
      { label: 'CIBC King Street Branch', value: 'cibc-kingst' },
      { label: 'CIBC Liguanea Branch', value: 'cibc-liguanea' },
      { label: 'CIBC Mandeville Branch', value: 'cibc-mandeville' },
      { label: 'CIBC Manor Park Branch', value: 'cibc-manorpark' },
      { label: 'CIBC Maypen Branch', value: 'cibc-maypen' },
      { label: 'CIBC Fairview Branch (Montego Bay)', value: 'cibc-fairview' },
      { label: 'CIBC Ocho Rios Branch', value: 'cibc-ochorios' },
      { label: 'CIBC Port Antonio Branch', value: 'cibc-portantonio' },
      { label: 'CIBC Portmore Branch', value: 'cibc-portmore' },
      { label: 'CIBC Savanna-La-Mar Branch', value: 'cibc-savlamar' },
      { label: 'CIBC St. James Street Branch', value: 'cibc-stjames' },
      { label: 'CIBC Mortgage & Loan Centre', value: 'cibc-mortgage' }
    ],
    jnbank: [
      { label: 'JN Bank St. Mary (Annotto Bay)', value: 'jn-annottobay' },
      { label: 'JN Bank St. Andrew (Bryce Hill)', value: 'jn-brycehill' },
      { label: 'JN Bank Kingston (Azan Cross Road)', value: 'jn-azan' },
      { label: 'JN Bank St. Andrew (Barbican Road)', value: 'jn-barbican' },
      { label: 'JN Bank St. James (Montego Bay)', value: 'jn-mobay' },
      { label: 'JN Bank St. Catherine (Spanish Town)', value: 'jn-spanishtown' },
      { label: 'JN Bank St. Andrew (Belmont Road)', value: 'jn-belmont' },
      { label: 'JN Bank St. Catherine (Portmore)', value: 'jn-portmore' },
      { label: 'JN Bank St. Elizabeth (Black River)', value: 'jn-blackriver' },
      { label: 'JN Bank St. Catherine (Bog Walk)', value: 'jn-bogwalk' },
      { label: 'JN Bank St. Ann (Brown\'s Town)', value: 'jn-brownstown' },
      { label: 'JN Bank Portland (Buff Bay)', value: 'jn-buffbay' },
      { label: 'JN Bank St. James (Catherine Hall)', value: 'jn-catherinehall' },
      { label: 'JN Bank Manchester (Christiana)', value: 'jn-christiana' },
      { label: 'JN Bank St. Andrew (Constant Spring)', value: 'jn-constantspring' },
      { label: 'JN Bank St. Andrew (Lady Musgrave)', value: 'jn-ladymusgrave' },
      { label: 'JN Bank St. Andrew (Slipe Road)', value: 'jn-sliperoad' },
      { label: 'JN Bank Kingston (Duke Street)', value: 'jn-dukest' },
      { label: 'JN Bank Trelawny (Falmouth)', value: 'jn-falmouth' },
      { label: 'JN Bank St. Catherine (Ferry)', value: 'jn-ferry' },
      { label: 'JN Bank St. Mary (Gayle)', value: 'jn-gayle' },
      { label: 'JN Bank St. Catherine (Greater Portmore)', value: 'jn-greaterportmore' },
      { label: 'JN Bank Hanover (Green Island)', value: 'jn-greenisland' },
      { label: 'JN Bank St. Andrew (Grenada Crescent)', value: 'jn-grenada' },
      { label: 'JN Bank St. Catherine (Burke Road)', value: 'jn-burke' },
      { label: 'JN Bank St. Mary (Highgate)', value: 'jn-highgate' },
      { label: 'JN Bank St. Andrew (Old Hope Road)', value: 'jn-oldhope' },
      { label: 'JN Bank Headquarters (Constant Spring)', value: 'jn-hq' }
    ],
    sagicor: [
      { label: 'Sagicor Bank Dominica Drive (Headquarters)', value: 'sagicor-hq' },
      { label: 'Sagicor Bank Knutsford Boulevard', value: 'sagicor-knutsford' }
    ],
    firstglobal: [
      { label: 'First Global Bank St. Lucia Avenue (Corporate Office)', value: 'fgb-corporate' },
      { label: 'First Global Bank Barbados Avenue', value: 'fgb-barbados' }
    ]
  };

  /* Custom Constants */

  const CustomDropdown = ({ 
    label, 
    value, 
    items, 
    placeholder,
    setValue,
    onChangeValue,  // Add this new prop
    dropdownKey,
    searchable = false,
    searchPlaceholder = "Search...",
    disabled = false,
    listMode = "SCROLLVIEW",
    scrollViewProps = { nestedScrollEnabled: true }
  }) => {
    
    console.log(`CustomDropdown ${label}:`, {
      itemsCount: items?.length || 0,
      disabled,
      value,
      dropdownKey
    });
    
    return (
      <View style={[
        styles.dropdownWrapper,
        { zIndex: openDropdown === dropdownKey ? 1000 : 1 }
      ]}>
        <Text style={styles.text}>{label}</Text>
        <DropDownPicker
          open={openDropdown === dropdownKey}
          value={value}
          items={items}
          setOpen={(isOpen) => {
            console.log(`Dropdown ${dropdownKey} ${isOpen ? 'opened' : 'closed'}`);
            console.log(`Items available: ${items?.length || 0}`);
            return !disabled && setOpenDropdown(isOpen ? dropdownKey : null);
          }}
          setValue={setValue}
          onChangeValue={onChangeValue}  // Add this line
          placeholder={placeholder}
          style={[styles.dropdown, disabled && styles.disabledDropdown]}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={[styles.dropdownText, disabled && styles.disabledText]}
          placeholderStyle={[styles.placeholderText, disabled && styles.disabledText]}
          listItemLabelStyle={styles.dropdownItemText}
          ArrowDownIconComponent={() => (
            <Image 
              source={icons.down} 
              style={[styles.dropdownIcon, disabled && {tintColor: 'rgba(0, 0, 0, 0.2)'}]} 
            />
          )}
          disabled={disabled}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          onPress={() => !disabled && setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey)}
          listMode={listMode}
          scrollViewProps={scrollViewProps}
        />
      </View>
    );
  };

  /* Handlers Constants */

  const handleBankChange = (value) => {
    console.log('🚨 HANDLE BANK CHANGE CALLED! 🚨');
    console.log('=== BANK CHANGE DEBUG ===');
    console.log('Selected bank value:', value);
    console.log('Available keys in bankBranches:', Object.keys(bankBranches));
    console.log('Does key exist?', value in bankBranches);
    console.log('Raw branches for this key:', bankBranches[value]);
    console.log('Number of branches:', bankBranches[value]?.length || 0);
    
    const branches = bankBranches[value] || [];
    console.log('Branches array being set:', branches);
    
    // Update states
    setBank(value);
    setBranch(null);
    setAvailableBranches(branches);
    
    console.log('State updates called, checking in 200ms...');
    setTimeout(() => {
      console.log('=== STATE CHECK AFTER UPDATE ===');
      console.log('Bank state:', bank);
      console.log('availableBranches state length:', availableBranches.length);
    }, 200);
  };

  const handleBranchChange = (value) => {
    console.log('Branch selected:', value);
    setBranch(value);
  };

  const handleAccountTypeChange = (value) => {
    setAccountType(value);
  };

  const handleBankSelection = (selectedBank) => {
    const branches = bankBranches[selectedBank] || [];
    setAvailableBranches(branches);
    setBranch(null);
  };

  const handlePayment = () => {
  };

  const createSetValueHandler = (setter, customLogic = null) => {
    return (callbackOrValue) => {
      let newValue;
      
      if (typeof callbackOrValue === 'function') {
        // Handle callback pattern
        newValue = callbackOrValue();
      } else {
        // Handle direct value pattern
        newValue = callbackOrValue;
      }
      
      setter(newValue);
      
      // Run custom logic if provided
      if (customLogic) {
        customLogic(newValue);
      }
    };
  };

  useEffect(() => {
    console.log('📋 Available branches updated:', availableBranches.length);
    availableBranches.forEach((branch, index) => {
      console.log(`  ${index}: ${branch.label}`);
    });
  }, [availableBranches]);

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
              
              <Text style={styles.headertext}>{isEditing ? 'Add' : 'Edit'} Payment</Text>            
            </View>

            <View style={styles.texts}>              
              <View style={styles.textbody}>
                <Text style={styles.text}>Cardholder Name</Text>

                <View style={styles.textinput}>
                  <Image
                    source={icons.text}
                    style={styles.icon}
                    tintColor='rgba(0, 0, 0, 0.2)'
                  />

                  <TextInput
                    placeholder="Cardholder Name"
                    placeholderTextColor='rgba(0, 0, 0, 0.2)'
                    style={styles.subtext}
                    autoFocus={true}
                  />
                </View>
              </View>

              <View style={styles.textbody}>
                <Text style={styles.text}>Cardholder Number</Text>

                <View style={styles.textinput}>
                  <Image
                    source={icons.no}
                    style={styles.icon}
                    tintColor='rgba(0, 0, 0, 0.2)'
                  />

                  <TextInput
                    placeholder="Cardholder Number"
                    placeholderTextColor='rgba(0, 0, 0, 0.2)'
                    style={styles.subtext}
                    autoFocus={true}
                  />
                </View>
              </View>

              <View style={styles.textrow}>
                <View style={styles.textbody}>
                  <Text style={styles.text}>Expiry Date</Text>

                  <View style={styles.textinput}>
                    <Image
                      source={icons.no}
                      style={styles.icon}
                      tintColor='rgba(0, 0, 0, 0.2)'
                    />

                    <TextInput
                      placeholder="Expiry Date"
                      placeholderTextColor='rgba(0, 0, 0, 0.2)'
                      style={styles.subtext}
                      autoFocus={true}
                    />
                  </View>
                </View>

                <View style={styles.textbody}>
                  <Text style={styles.text}>CVV</Text>

                  <View style={styles.textinput}>
                    <Image
                      source={icons.no}
                      style={styles.icon}
                      tintColor='rgba(0, 0, 0, 0.2)'
                    />

                    <TextInput
                      placeholder="CVV"
                      placeholderTextColor='rgba(0, 0, 0, 0.2)'
                      style={styles.subtext}
                      autoFocus={true}
                    />
                  </View>
                </View>

                <View style={styles.textbody}>
                  <Text style={styles.text}>Transit No.</Text>

                  <View style={styles.textinput}>
                    <Image
                      source={icons.no}
                      style={styles.icon}
                      tintColor='rgba(0, 0, 0, 0.2)'
                    />

                    <TextInput
                      placeholder="Transit No."
                      placeholderTextColor='rgba(0, 0, 0, 0.2)'
                      style={styles.subtext}
                      autoFocus={true}
                    />
                  </View>
                </View>
              </View>
   
              <CustomDropdown
                label="Bank"
                value={bank}
                items={dropdownItems.banks}
                placeholder="Select Bank"
                setValue={createSetValueHandler(setBank, handleBankSelection)}
                dropdownKey="bank"
                searchable={true}
                searchPlaceholder="Search banks..."
              />

              <CustomDropdown
                label="Branch"
                value={branch}
                items={availableBranches}
                placeholder={bank ? "Select Branch" : "First select a Bank"}
                setValue={createSetValueHandler(setBranch)}
                dropdownKey="branch"
                disabled={!bank}
              />

              <CustomDropdown
                label="Account Type"
                value={accountType}
                items={dropdownItems.accountTypes}
                placeholder="Select Account Type"
                setValue={createSetValueHandler(setAccountType)}
                dropdownKey="accountType"
              />
            </View>
          </View>    
        </ScrollView>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handlePayment}
        >
          <Text style={styles.buttontext}>{isEditing ? 'Add' : 'Edit'} Payment</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    width: '100%',
    height: '100%',
  },

  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  scrollViewArea: {
    width: '100%',
    height: '100%',
  },

  /* Header */

  header: {
    width: '90%',
    flexDirection: 'row',
    marginBottom: 40,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',    
  },
  
  headertext: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 25,
  },

  /* Texts */

  texts: {
    width: '90%',
    flexDirection: 'column',
    gap: 10,
  },

  textbody: {
    flexDirection: 'column',
    gap: 5,
    marginBottom: 10,
    marginTop: 20,
  },

  textrow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },

  textinput: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gallery,
    borderRadius: 20,
    padding: 7,
    gap: 7,
  },

  text: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.charcoal,
  },

  subtext: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 15,
    color: colors.charcoal,
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
    borderWidth: 2,
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

  disabledDropdown: {
    backgroundColor: '#f5f5f5',
  },

  disabledText: {
    color: 'rgba(0, 0, 0, 0.2)',
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

export default EditPayment;