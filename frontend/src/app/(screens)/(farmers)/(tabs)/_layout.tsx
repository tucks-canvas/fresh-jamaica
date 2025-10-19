import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/* Import React-Native Content */
import { View, Image } from 'react-native';

/* Import Farmer Tabs */
import FarmerHome from './home';
import FarmerProducts from './products';
import FarmerOrders from './orders';
import FarmerStats from './statistics';
import FarmerProfile from './profile';

/* Import Icons, Images, and Colors */
import { icons } from '@/constants';
import colors from '@/constants/colors';

const Tab = createBottomTabNavigator();

const FarmerTabIcon = ({ source, focused }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Image
      source={source}
      style={{
        width: focused ? 23 : 20,
        height: focused ? 23 : 20,
        top: 20,
        backgroundColor: 'transparent',
        tintColor: focused ? colors.jewel : '#106a456f',
      }}
    />
  </View>
);

const FarmerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 255)',
          position: 'absolute',
          height: '10%',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          borderColor: 'transparent',
          elevation: 50,
          shadowColor: 'rgba(0, 0, 0, 0.4)',
        },
        tabBarIcon: ({ focused }) => {
          let iconSource;
          
          switch (route.name) {
            case 'Home':
              iconSource = focused ? icons.homefill : icons.home;
              break;
            case 'Products':
              iconSource = focused ? icons.productfill : icons.product;
              break;
            case 'Orders':
              iconSource = focused ? icons.orderfill : icons.order;
              break;
            case 'Stats':
              iconSource = focused ? icons.statsfill : icons.stats;
              break;
            case 'Profile':
              iconSource = focused ? icons.profilefill : icons.profile;
              break;
            default:
              iconSource = icons.home;
          }
          return <FarmerTabIcon source={iconSource} focused={focused} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={FarmerHome} />
      <Tab.Screen name="Products" component={FarmerProducts} />
      <Tab.Screen name="Orders" component={FarmerOrders} />
      <Tab.Screen name="Stats" component={FarmerStats} />
      <Tab.Screen name="Profile" component={FarmerProfile} />
    </Tab.Navigator>
  );
};

export default FarmerTabs;