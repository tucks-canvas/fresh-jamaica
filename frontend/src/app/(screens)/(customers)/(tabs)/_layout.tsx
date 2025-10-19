import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image } from 'react-native';

// Import FarmerTabs
import CustomerHome from './home';
import CustomerLike from './like';
import CustomerCart from './cart';
import CustomerOrder from './order';
import CustomerProfile from './profile';

// Import Images, Icons, and Colors
import { icons, images } from '@/constants';
import colors from '@/constants/colors';

const Tab = createBottomTabNavigator();

const CustomerTabIcon = ({ source, focused }) => (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={source}
        style={{
          width: focused ? 23 : 20,
          height: focused ? 23 : 20,
          top: 20,
          backgroundColor: 'transparent',
          tintColor: focused ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)',
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
            case 'Like':
              iconSource = focused ? icons.likefill : icons.like;
              break;
            case 'Cart':
              iconSource = focused ? icons.cartfill : icons.cart;
              break;
            case 'Order':
              iconSource = focused ? icons.orderfill : icons.order;
              break;
            case 'Profile':
              iconSource = focused ? icons.profilefill : icons.profile;
              break;
            default:
              iconSource = icons.home;
          }
          return <CustomerTabIcon source={iconSource} focused={focused} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={CustomerHome} />
      <Tab.Screen name="Like" component={CustomerLike} />
      <Tab.Screen name="Cart" component={CustomerCart} />
      <Tab.Screen name="Order" component={CustomerOrder} />
      <Tab.Screen name="Profile" component={CustomerProfile} />
    </Tab.Navigator>
  );
};

export default FarmerTabs;
