import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSequence, 
  withTiming,
  useSharedValue
} from 'react-native-reanimated';

const OTPInput = ({ length = 6, value = '', onChange, hasError }) => {
  const inputRefs = useRef([]);
  const [localValue, setLocalValue] = useState(Array(length).fill(''));
  const [focused, setFocused] = useState(-1);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (hasError) {
      shake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [hasError]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shake.value }]
    };
  });

  const handleChange = (text, index) => {
    const newValue = [...localValue];
    newValue[index] = text;
    setLocalValue(newValue);

    const combinedValue = newValue.join('');
    onChange(combinedValue);

    if (text.length === 1 && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !localValue[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      const newValue = [...localValue];
      newValue[index - 1] = '';
      setLocalValue(newValue);
      onChange(newValue.join(''));
    }
  };

  const handleFocus = (index) => {
    setFocused(index);
  };

  const handleBlur = () => {
    setFocused(-1);
  };

  return (
    <Animated.View style={[styles.container]}>
      {Array(length).fill(0).map((_, index) => (
        <View
          key={index}
          style={[
            styles.inputContainer,
            focused === index && styles.inputContainerFocused,
            hasError && styles.inputContainerError
          ]}
        >
          <TextInput
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.input}
            maxLength={1}
            keyboardType="number-pad"
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            value={localValue[index]}
            selectTextOnFocus
          />
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  inputContainer: {
    width: 45,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: '#2563eb',
    backgroundColor: '#fff',
    transform: [{ scale: 1.05 }],
  },
  inputContainerError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  input: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: '#000',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
});

export default OTPInput;