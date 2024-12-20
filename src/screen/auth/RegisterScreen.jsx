import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, Animated, ActivityIndicator } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from '../../libs/axios';
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextField, Button, Colors } from "react-native-ui-lib";
import AlreadyEmailModal from '../../components/AlreadyEmailModal';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const shakeAnimation = React.useRef(new Animated.Value(0)).current;

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

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

    Animated.loop(sequence, { iterations: 1 }).start();
  };

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const register = async (data) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/auth/register", data);

      // Navigate to success screen
      navigation.navigate('SuccessRegis');
    }  catch (error) {
      console.error(error.response?.data);
      
      if (error.response?.data?.message?.includes('Email sudah terdaftar')) {
        setErrorMessage('Email sudah ter-registrasi');
        setErrorModalVisible(true);
      }
      
      startShakeAnimation();

    } finally {
      setIsLoading(false);
    }
  };

  const closeErrorModal = () => {
    setErrorModalVisible(false);
  };

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
        <Text className="text-center text-2xl font-poppins-semibold text-black">Registrasi</Text>
        <Text className="text-sm font-poppins-regular text-[#7f7f7f] text-center mb-5 mt-[5px]">
          Buat akun baru untuk melanjutkan
        </Text>

        <View style={{ width: '90%', alignSelf: 'center' }}>
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
            <View marginB-25 className='mt-2 relative'>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: "Nama tidak boleh kosong",
                  minLength: { value: 2, message: "Nama minimal 2 karakter" }
                }}
                render={({ field: { onChange, value } }) => (
                  <View>
                    <TextField
                      style={{ fontFamily: "Poppins-Regular" }}
                      placeholder={"Nama Lengkap"}
                      placeholderTextColor="#999"
                      enableErrors
                      fieldStyle={{
                        paddingVertical: 12,
                        paddingHorizontal: 45,
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: errors.name ? '#ef4444' : Colors.grey60,
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
                      <Ionicons name="person" size={20} color={errors.name ? '#ef4444' : '#666'} />
                    </View>
                  </View>
                )}
              />
              {errors.name && (
                <Text
                  className="text-red-500 font-poppins-regular text-sm"
                  style={{
                    position: 'absolute',
                    marginTop: 5,
                    top: '100%',
                    left: 5,
                    height: 20
                  }}
                >
                  {errors.name.message}
                </Text>
              )}
            </View>

            {/* Email Field */}
            <View marginB-25 className='mt-10 relative'>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "Email tidak boleh kosong",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email tidak valid"
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <View>
                    <TextField
                      style={{ fontFamily: "Poppins-Regular" }}
                      placeholder={"Email"}
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
                    marginTop: 8,
                    left: 5,
                    height: 20
                  }}
                >
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Password Field */}
            <View marginB-15 className='mt-10 relative'>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Password tidak boleh kosong",
                  minLength: { value: 8, message: "Password minimal 8 karakter" }
                }}
                render={({ field: { onChange, value } }) => (
                  <View>
                    <TextField
                      style={{ fontFamily: "Poppins-Regular" }}
                      placeholder={"Password"}
                      placeholderTextColor="#999"
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
                    marginTop: 5,
                    left: 5,
                    height: 20
                  }}
                >
                  {errors.password.message}
                </Text>
              )}
            </View>

            <View marginB-15 className='mt-10 relative'>
              <Controller
                control={control}
                name="password_confirmation"
                rules={{
                  required: "Konfirmasi password tidak boleh kosong",
                  validate: (value) => value === watch("password") || "Konfirmasi password tidak cocok"
                }}
                render={({ field: { onChange, value } }) => (
                  <View>
                    <TextField
                      style={{ fontFamily: "Poppins-Regular" }}
                      placeholderTextColor="#999"
                      placeholder={"Konfirmasi Password"}
                      secureTextEntry={!isPasswordVisible}
                      enableErrors
                      fieldStyle={{
                        paddingVertical: 12,
                        paddingHorizontal: 45,
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: errors.password_confirmation ? '#ef4444' : Colors.grey60,
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
                      <Ionicons name="key" size={20} color={errors.password_confirmation ? '#ef4444' : '#666'} />
                    </View>
                  </View>
                )}
              />
              {errors.password_confirmation && (
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
                  {errors.password_confirmation.message}
                </Text>
              )}
            </View>
          </Animated.View>

          <Button
            labelStyle={{
              fontFamily: "Poppins-Medium",
              color: 'white'
            }}
            style={{ marginTop: 50 }}
            backgroundColor={'#2563eb'}
            paddingV-14
            borderRadius={25}
            onPress={handleSubmit(register)}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* <ActivityIndicator
                  color="white"
                  size="small"
                  style={{ marginRight: 10 }}
                /> */}
                <Text style={{
                  color: 'white',
                  fontFamily: "Poppins-Medium"
                }}>
                  Memproses Registrasi Anda ...
                </Text>
              </View>
            ) : (
              <Text style={{
                fontSize: 15,
                color: 'white',
                fontFamily: "Poppins-SemiBold"
              }}>
                Daftar
              </Text>
            )}
          </Button>
        </View>

      <AlreadyEmailModal 
        isVisible={errorModalVisible}
        message={errorMessage}
        onClose={closeErrorModal}
      />
        <View className="flex-row justify-center mt-6">
          <Text className="text-[#7f7f7f] font-poppins-regular">Sudah Punya Akun?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-[#0ea5e9] font-poppins-semibold"> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;