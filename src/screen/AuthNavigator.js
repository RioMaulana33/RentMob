import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import WelcomeScreen from '../screen/auth/WelcomeScreen';
import LoginScreen from '../screen/auth/LoginScreen';
import ForgotPassScreen from './auth/ForgotPassScreen';
import RegisterScreen from '../screen/auth/RegisterScreen';
import SuccessRegis from '../screen/auth/SuccessRegis';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen}/>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen 
        name="ForgotPass" 
        component={ForgotPassScreen}
        options={{...TransitionPresets.SlideFromRightIOS}}/>
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{
          ...TransitionPresets.BottomSheetAndroid
        }}
      />
      <Stack.Screen 
        name="SuccessRegis" 
        component={SuccessRegis}
        options={{
          ...TransitionPresets.BottomSheetAndroid
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;