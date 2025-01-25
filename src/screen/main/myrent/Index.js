import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import MyRent from './MyRent';
import RentalTracking from './RentalTracking';


const Stack = createStackNavigator();

const MyRentNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="MyRentMain" component={MyRent} />    
      <Stack.Screen name="RentalTracking" component={RentalTracking} 
        options={{
                ...TransitionPresets.SlideFromRightIOS
              }}  />

    </Stack.Navigator>
  );
};

export default MyRentNavigator;
