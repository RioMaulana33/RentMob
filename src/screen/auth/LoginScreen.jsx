import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, Animated } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from '../../libs/axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextField, Button, Colors } from "react-native-ui-lib";

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  // Tambahkan animated value untuk shake effect
  const shakeAnimation = React.useRef(new Animated.Value(0)).current;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();

  // Fungsi untuk menganimasikan shake effect
  const startShakeAnimation = () => {
    // Reset nilai animasi
    shakeAnimation.setValue(0);
    
    // Buat sequence animasi
    const sequence = Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true
      })
    ]);

    // Jalankan animasi 3 kali
    Animated.loop(sequence, { iterations: 1 }).start();
  };

  const {
    mutate: login,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (data) => axios.post("/auth/login", data),
    onSuccess: async (res) => {
      console.log(res.data)
      await AsyncStorage.setItem("@auth-token", res.data.token);
      queryClient.invalidateQueries(["auth", "user"]);
      navigation.navigate('MainApp');
    },
    onError: (error) => {
      console.error(error.response?.data);
      // Trigger animasi saat error
      startShakeAnimation();
      Toast.show({
        type: "error",
        text1: "Email atau password salah!",
      });
    },
  });

  // Tambahkan useEffect untuk memicu animasi ketika ada error form
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      startShakeAnimation();
    }
  }, [errors]);

  const [isPasswordVisible, setPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ImageBackground
        source={require('../../assets/image/bg_auth.jpg')}
        style={{
          width: width,
          height: height * 0.3,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />

      <View className="bg-white w-full h-full self-center -mt-[35px] py-[50px] px-5 rounded-[30px] shadow-lg">
        <Text className="text-center text-2xl font-poppins-semibold text-black">Login</Text>
        <Text className="text-sm font-poppins-regular text-[#7f7f7f] text-center mb-5 mt-[5px]">
          Silakan login untuk melanjutkan ke akun anda.
        </Text>

        <View style={{ width: '90%', alignSelf: 'center' }} >
        <Animated.View 
          style={[
            { 
              width: '100%', 
              alignSelf: 'center',
            },
            {
              transform: [{
                translateX: shakeAnimation
              }]
            }
          ]}
        >
          <View marginB-25 className='mt-2'>
            <Controller
              control={control}
              name="email"
              rules={{ required: "Email tidak boleh kosong", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Email tidak valid" } }}
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextField
                    style={{ fontFamily: "Poppins-Regular" }}
                    placeholder={"Email"}
                    enableErrors
                    fieldStyle={{
                      paddingVertical: 12,
                      paddingHorizontal: 45,
                      borderRadius: 25,
                      borderWidth: 1,
                      borderColor: errors.email ? '#ef4444' : Colors.grey60,
                      backgroundColor: '#f5f5f5',
                    }}
                    containerStyle={{
                      marginBottom: -20,
                    }}
                    onChangeText={onChange}
                    value={value}
                  />
                  <View style={{
                    position: "absolute",
                    left: 15,
                    top: 15,
                  }}>
                    <Ionicons name="mail-outline" size={20} color={errors.email ? '#ef4444' : '#666'} />
                  </View>
                </View>
              )}
            />
            {errors.email && (
              <Text className="text-red-500 font-poppins-regular text-sm mt-2">
                {errors.email.message}
              </Text>
            )}
          </View>

          <View marginB-15 className='mt-6'>
            <Controller
              control={control}
              name="password"
              rules={{ required: "Password tidak boleh kosong" }}
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextField
                    style={{ fontFamily: "Poppins-Regular" }}
                    placeholder={"Password"}
                    secureTextEntry={!isPasswordVisible}
                    enableErrors
                    fieldStyle={{
                      paddingVertical: 12,
                      paddingHorizontal: 45,
                      borderRadius: 25,
                      borderWidth: 1,
                      borderColor: errors.password ? '#ef4444' : Colors.grey60,
                      backgroundColor: '#f5f5f5',
                    }}
                    containerStyle={{
                      marginBottom: -20,
                      position: "relative",
                    }}
                    onChangeText={onChange}
                    value={value}
                  />
                  <View style={{
                    position: "absolute",
                    left: 15,
                    top: 15,
                  }}>
                    <Ionicons name="key-outline" size={20} color={errors.password ? '#ef4444' : '#666'} />
                  </View>
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      right: 15,
                      top: 15,
                    }}
                  >
                    <Ionicons
                      name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text className="text-red-500 font-poppins-regular text-sm mt-2">
                {errors.password.message}
              </Text>
            )}
          </View>          
         </Animated.View>


          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={{
              alignSelf: 'flex-end',
              marginBottom: 20,
              marginTop: 10
            }}
          >
            <Text className="text-[#0ea5e9] text-sm font-poppins-semibold">Lupa Password?</Text>
          </TouchableOpacity>

          <Button
          
            labelStyle={{ fontFamily: "Poppins-Medium" }}
            label="Login"
            backgroundColor={'#2563eb'}
            paddingV-14
            borderRadius={25}
            onPress={handleSubmit(login)}
            disabled={isLoading || isSuccess}
          />

</View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-[#7f7f7f] font-poppins-regular">Belum Punya Akun?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text className="text-[#0ea5e9] font-poppins-semibold"> Registrasi</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-[#7f7f7f] text-center text-xs mt-[200px] font-poppins-regular">
          © 2024 BluCarra. All Rights Reserved.
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;