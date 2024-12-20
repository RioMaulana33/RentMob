import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Profile from './Profile';
import EditProfile from './EditProfile';
import EditPassword from './EditPassword';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="ProfileMain" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} 
        options={{
                ...TransitionPresets.SlideFromRightIOS
              }}  />
      <Stack.Screen name="EditPassword" component={EditPassword} 
        options={{
                ...TransitionPresets.SlideFromRightIOS
              }}
      />        
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
