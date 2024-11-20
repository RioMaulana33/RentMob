import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from '../../libs/axios';
const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

 useEffect(() => {
   axios.get('mobil/get'
   ).then(res => {
     console.log(res.data);
   })
 })
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/image/bg_auth.jpg')}
        style={styles.header}
      >
      </ImageBackground>

      <View className="bg-white w-full h-full self-center -mt-[35px] py-[50px] px-5 rounded-[30px] shadow-lg">
        <Text className="text-center text-2xl font-poppins-semibold text-black">Login</Text>
        <Text className="text-sm font-poppins-regular text-[#7f7f7f] text-center mb-5 mt-[5px]">
          Silakan login untuk melanjutkan ke akun Anda dengan pengalaman menarik.
        </Text>
        
        <View className="mb-5">
          <TextInput
            className="h-[50px] border border-[#dcdcdc] rounded-[25px] px-4 bg-white/80 text-[#333] mb-4 font-poppins-regular"
            placeholder="Email"
            placeholderTextColor="#7f7f7f"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <View className="flex-row items-center border border-[#dcdcdc] rounded-[25px] bg-white/80 px-4 mb-4">
            <TextInput
              className="flex-1 h-[50px] text-[#333] font-poppins-regular"
              placeholder="Password"
              placeholderTextColor="#7f7f7f"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} className="p-2.5">
              <Ionicons 
                name={showPassword ? "eye" : "eye-off"} 
                size={24} 
                color="#7f7f7f" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-[#0ea5e9] h-[50px] justify-center items-center rounded-[25px]"
          onPress={() => navigation.navigate('MainApp')}
        >
          <Text className="text-white text-lg font-poppins-semibold">Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('ForgotPassword')}
          className="mt-4 mb-5"
        >
          <Text className="text-[#0ea5e9] text-sm text-center font-poppins-regular">Forgot Password?</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-1">
          <Text className="text-[#7f7f7f] font-poppins-regular">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text className="text-[#86d1e6] font-poppins-medium"> Sign Up</Text>
          </TouchableOpacity>
        </View>
        
        <Text className="text-[#7f7f7f] text-center text-xs mt-[125px] font-poppins-regular">
          © 2024 Rentmate. All Rights Reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: width,
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;