import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, Animated, ActivityIndicator, Modal, Image } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import axios from '../../libs/axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextField, Button, Colors } from "react-native-ui-lib";

const { width, height } = Dimensions.get('window');

const ErrorModal = ({ visible, onClose, navigation }) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType='fade'>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-10/12 max-w-md shadow-lg">
          <View className="items-center">
            <View className="w-60 h-60 mb-3">
              <Image
                source={require('../../assets/image/already-vector.png')}
                className="w-full h-full object-contain"
              />
            </View>

            <Text className="font-poppins-medium text-xl text-gray-800 mb-2">
              Email/Password salah
            </Text>

            <Text className="font-poppins-regular text-sm text-gray-600 text-center mb-4">
              Pastikan data yang Anda isi sudah benar
            </Text>

            <View className="w-full h-[1px] bg-gray-200 my-4" />

            <View className="w-full items-center">
              <Text className="font-poppins-regular text-sm text-gray-600 text-center mb-4">
                Belum memiliki akun?
              </Text>

              <TouchableOpacity
                onPress={() => {
                  onClose();
                  navigation.navigate('Register');
                }}
                className="bg-blue-500 w-full py-3 rounded-full items-center mb-3"
              >
                <Text className="text-white font-poppins-medium text-sm">
                  Daftar Sekarang
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-100 w-full py-3 rounded-full items-center"
              >
                <Text className="text-gray-700 font-poppins-medium text-sm">
                  Coba Login Lagi
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const LoginScreen = ({ navigation }) => {
  const shakeAnimation = React.useRef(new Animated.Value(0)).current;
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();

  const startShakeAnimation = () => {
    shakeAnimation.setValue(0);

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

  const [isLoading, setIsLoading] = React.useState(false);

  const login = async (data) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/auth/secure/login", data);

      await AsyncStorage.setItem("@auth-token", res.data.token);
      queryClient.invalidateQueries(["auth", "user"]);
    } catch (error) {
      console.error('Login error:', error.response?.data);
      startShakeAnimation();
      setErrorModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };


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
                      keyboardType="email-address"
                      placeholderTextColor="#999"
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
                      <Ionicons name="mail" size={20} color={errors.email ? '#ef4444' : '#666'} />
                    </View>
                  </View>
                )}
              />
              {errors.email && (
                <Text
                  className="text-red-500 font-poppins-regular text-sm"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    marginTop: 7,
                    left: 5,
                    height: 20
                  }}
                >
                  {errors.email.message}
                </Text>
              )}
            </View>

            <View marginB-15 className='mt-8'>
              <Controller
                control={control}
                name="password"
                rules={{ required: "Password tidak boleh kosong" }}
                render={({ field: { onChange, value } }) => (
                  <View>
                    <TextField
                      style={{ fontFamily: "Poppins-Regular" }}
                      placeholderTextColor="#999"
                      placeholder={"Password"}
                      maxLength={12}
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
                      <Ionicons name="key" size={20} color={errors.password ? '#ef4444' : '#666'} />
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
                <Text
                  className="text-red-500 font-poppins-regular text-sm"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    marginTop: 8,
                    left: 5,
                    height: 20
                  }}
                >
                  {errors.password.message}
                </Text>
              )}
            </View>
          </Animated.View>

          <ErrorModal
            visible={errorModalVisible}
            message={errorMessage}
            onClose={() => setErrorModalVisible(false)}
            navigation={navigation}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPass')}
            style={{
              alignSelf: 'flex-end',
              marginBottom: 20,
              marginTop: 10
            }}
          >
            <Text className="text-[#0ea5e9] text-sm font-poppins-semibold">Lupa Password?</Text>
          </TouchableOpacity>

          <Button
            label={isLoading || "Login"}
            labelStyle={{
              fontFamily: "Poppins-Medium",
              color: 'white'
            }}
            backgroundColor={'#2563eb'}
            paddingV-14
            borderRadius={25}
            onPress={handleSubmit(login)}
            disabled={isLoading}
          >
            {isLoading && (
              <View style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ActivityIndicator
                  color="white"
                  size="small"
                />
              </View>
            )}
          </Button>
        </View>

        <View className="flex-row justify-center mt-64" >
          <Text className="text-[#7f7f7f] font-poppins-regular">Belum Punya Akun?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-[#0ea5e9] font-poppins-semibold"> Registrasi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;