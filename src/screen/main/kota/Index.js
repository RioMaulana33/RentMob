import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Kota from './Kota';
import KotaDetail from './KotaDetail';


const Stack = createStackNavigator();

const KotaNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="KotaMain" component={Kota} />    
      <Stack.Screen name="KotaDetail" component={KotaDetail} 
        options={{
                ...TransitionPresets.SlideFromRightIOS
              }}  />

    </Stack.Navigator>
  );
};

export default KotaNavigator;
