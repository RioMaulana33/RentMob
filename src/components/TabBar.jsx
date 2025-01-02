import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';

function TabBar({ state, navigation }) {
  if (!state) return null;

  const animatedValues = React.useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;

  const handlePress = (screenName, index) => {
    state.routes.forEach((_, i) => {
      Animated.timing(animatedValues[i], {
        toValue: i === index ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
    navigation.navigate(screenName);
  };

  const getIconName = (screenName) => {
    switch (screenName) {
      case 'Home':
        return 'home-outline';
      case 'MyRent':
        return 'key-outline';
      case 'Favorite':
        return 'heart-outline';
      case 'Profile':
        return 'person-outline';
      default:
        return 'home-outline';
    }
  };

  const renderTab = (screenName, index) => {
    const iconName = getIconName(screenName);
    const isFocused = state.index === index;
    
    const translateY = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, -1.3], 
    });

    return (
      <TouchableOpacity
        key={screenName}
        style={styles.tabContainer}
        onPress={() => handlePress(screenName, index)}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ translateY }] }
          ]}
        >
          <IonIcons 
            name={isFocused ? iconName.replace('-outline', '') : iconName}
            size={22} 
            color={isFocused ? '#2563eb' : '#94a3b8'} 
          />
          <Text style={[
            styles.tabText,
            { 
              color: isFocused ? '#2563eb' : '#94a3b8',
              fontWeight: isFocused ? '600' : '400'
            }
          ]}>
            {screenName}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {state.routes.map((route, index) => renderTab(route.name, index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 12,
    justifyContent: 'space-around',
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  tabText: {
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default TabBar;