import React, { useState, useEffect, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Loading from './(screens)/(load)/loading';

const Stack = createStackNavigator();

const Index = () => {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={Loading} />
    </Stack.Navigator>
  );
};

export default Index;
