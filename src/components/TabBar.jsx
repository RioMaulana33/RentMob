import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
function TabBar({ state, navigation }) {
  if (!state) {
    return null;
  }

  const handlePress = (screenName, index) => {
    navigation.navigate(screenName);
  };

  const getIconName = (screenName) => {
    switch (screenName) {
      case 'Home':
        return 'home';
      case 'MyRent':
        return 'key';
      case 'Favorite':
        return 'heart';
      case 'Profile':
        return 'person';
      default:
        return 'home';
    }
  };

  const renderTab = (screenName, index) => {
    const iconName = getIconName(screenName);
    const isFocused = state.index === index;
    
    return (
      <TouchableOpacity
        key={screenName}
        style={[
          styles.tabContainer,
          { justifyContent: isFocused ? 'center' : 'flex-end' }
        ]}
        onPress={() => handlePress(screenName, index)}
      >
        <View
          style={[
            styles.iconContainer,
            { shadowColor: isFocused ? '#60a5fa' : 'transparent', 
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isFocused ? 0.5 : 0,
              shadowRadius: 6,
              elevation: isFocused ? 10 : 0
            }
          ]}
        >
          {isFocused && (
            <View style={styles.activeIndicator} />
          )}
          <IonIcons 
            name={iconName} 
            size={25} 
            color={isFocused ? '#60a5fa' : '#a1a1aa'} 
          />
          <Text style={[
            styles.tabText,
            { 
              color: isFocused ? '#60a5fa' : '#a1a1aa',
              fontFamily: isFocused ? 'Poppins-SemiBold' : 'Poppins-SemiBold'
            }
          ]}>
            {screenName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => renderTab(route.name, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 75,
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    width: 96,
    height: 4,
    backgroundColor: '#60a5fa',
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
    position: 'absolute',
    top: -12,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TabBar;  