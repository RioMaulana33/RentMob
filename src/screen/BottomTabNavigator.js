import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import HomeNavigator from './main/home/Index';
import MyRentNavigator from './main/myrent/Index';
import KotaNavigator from './main/kota/Index';
import TabBar from '../components/TabBar';
import ProfileNavigator from './main/profile/Index'; 

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => {
        const currentRoute = getFocusedRouteNameFromRoute(props.navigation.getState().routes[props.state.index]);
        
        const mainScreens = ['HomeMain', 'MyRentMain', 'KotaMain', 'ProfileMain'];
        const shouldShowTabBar = mainScreens.includes(currentRoute) || currentRoute === undefined;
        
        if (!shouldShowTabBar) {
          return null; 
        }
        
        return <TabBar {...props} />;
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeNavigator} 
      />
      <Tab.Screen 
        name="MyRent" 
        component={MyRentNavigator} 
      />
      <Tab.Screen 
        name="Kota" 
        component={KotaNavigator} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
