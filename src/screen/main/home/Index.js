import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Home from './Home';
import AllCars from './AllCars';
import RentalForm from './RentalForm';


const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="HomeMain" component={Home} />
      <Stack.Screen name="AllCars" component={AllCars} 
        options={{
                ...TransitionPresets.SlideFromRightIOS
              }}  />
      <Stack.Screen name="RentalForm" component={RentalForm} 
        options={{
                ...TransitionPresets.SlideFromRightIOS
              }}  />
    

    </Stack.Navigator>
  );
};

export default HomeNavigator;
