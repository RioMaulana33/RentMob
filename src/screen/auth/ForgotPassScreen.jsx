import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, Animated, ActivityIndicator, Modal, Image } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import axios from '../../libs/axios';
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextField, Button, Colors } from "react-native-ui-lib";
import OTPInput from '../../components/OTPInput';
import { RegistModal, SuccessModal } from '../../components/RegistModal';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = React.useState(1); // 1: email, 2: OTP, 3: new password
  const [userEmail, setUserEmail] = React.useState('');
  const shakeAnimation = React.useRef(new Animated.Value(0)).current;
  const [successModalVisible, setSuccessModalVisible] = React.useState(false);
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorType, setErrorType] = React.useState('default');
  const [modalMessage, setModalMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const startShakeAnimation = () => {
    shakeAnimation.setValue(0);
    Animated.sequence([
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
    ]).start();
  };

  const handleSendOTP = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/auth/send-user-otp', {
        email: data.email
      });
      setUserEmail(data.email);
      setModalMessage('Kode OTP telah dikirim ke email Anda');
      setSuccessModalVisible(true);
      setStep(2);
    } catch (error) {
      setErrorType('email');
      setModalMessage('Email tidak terdaftar pada aplikasi');
      setErrorModalVisible(true);
      startShakeAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (data) => {
    try {
      setIsLoading(true);
      await axios.post('/auth/verify-user-otp', {
        email: userEmail,
        otp: data.otp
      });
      setModalMessage('OTP berhasil diverifikasi');
      setSuccessModalVisible(true);
      setStep(3);
    } catch (error) {
      setErrorType('otp');
      setModalMessage('Kode OTP yang Anda masukkan salah');
      setErrorModalVisible(true);
      startShakeAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    try {
      setIsLoading(true);
      await axios.post('/auth/reset-user-password', {
        email: userEmail,
        password: data.password,
        password_confirmation: data.password_confirmation
      });
      setModalMessage('Password berhasil direset');
      setSuccessModalVisible(true);
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (error) {
      setErrorType('default');
      setModalMessage(error.response?.data?.message || 'Gagal mereset password');
      setErrorModalVisible(true);
      startShakeAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <View marginB-25 className='mt-2'>
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
                    placeholder="Email"
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
              <Text className="text-red-500 font-poppins-regular text-sm ml-2 bottom-4">
                {errors.email.message}
              </Text>
            )}
          </View>
        );
      case 2:
        return (
          <View marginB-25 className='mt-2 mb-4'>
            <Controller
              control={control}
              name="otp"
              rules={{
                required: "Kode OTP tidak boleh kosong",
                minLength: {
                  value: 6,
                  message: "Kode OTP harus 6 digit"
                },
                maxLength: {
                  value: 6,
                  message: "Kode OTP harus 6 digit"
                }
              }}
              render={({ field: { onChange, value } }) => (
                <OTPInput
                  length={6}
                  value={value}
                  onChange={onChange}
                  hasError={!!errors.otp}
                />
              )}
            />
            {errors.otp && (
              <Text className="text-red-500 font-poppins-regular text-sm text-center bottom-2 mt-2">
                {errors.otp.message}
              </Text>
            )}
          </View>
        );
      case 3:
        return (
          <>
            <View marginB-25 className='mt-2'>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Password baru tidak boleh kosong",
                  minLength: {
                    value: 8,
                    message: "Password minimal 8 karakter"
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <View>
                    <TextField
                      style={{ fontFamily: "Poppins-Regular" }}
                      placeholder="Password Baru"
                      secureTextEntry={!isPasswordVisible}
                      placeholderTextColor="#999"
                      enableErrors
                      fieldStyle={{
                        paddingVertical: 12,
                        paddingHorizontal: 45,
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: errors.password ? '#ef4444' : Colors.grey60,
                        backgroundColor: '#f5f5f5',
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
                <Text className="text-red-500 font-poppins-regular text-sm ml-2 bottom-2.5">
                  {errors.password.message}
                </Text>
              )}
            </View>

            <View marginB-25>
              <Controller
                control={control}
                name="password_confirmation"
                rules={{
                  required: "Konfirmasi password tidak boleh kosong",
                  validate: value => value === watch('password') || "Password tidak cocok"
                }}
                render={({ field: { onChange, value } }) => (
                  <View>
                    <TextField
                      style={{ fontFamily: "Poppins-Regular" }}
                      placeholder="Konfirmasi Password Baru"
                      secureTextEntry={!isConfirmPasswordVisible}
                      placeholderTextColor="#999"
                      enableErrors
                      fieldStyle={{
                        paddingVertical: 12,
                        paddingHorizontal: 45,
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: errors.password_confirmation ? '#ef4444' : Colors.grey60,
                        backgroundColor: '#f5f5f5',
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
                    <TouchableOpacity
                      onPress={toggleConfirmPasswordVisibility}
                      style={{
                        position: "absolute" ,
                        right: 15,
                        top: 15,
                      }}
                    >
                      <Ionicons
                        name={isConfirmPasswordVisible ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password_confirmation && (
                <Text className="text-red-500 font-poppins-regular text-sm ml-2 bottom-2.5">
                  {errors.password_confirmation.message}
                </Text>
              )}
            </View>
          </>
        );
      default:
        return null;
    }
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
        <Text className="text-center text-2xl font-poppins-semibold text-black">
          Lupa Password
        </Text>
        <Text className="text-sm font-poppins-regular text-[#7f7f7f] text-center mb-5 mt-[5px]">
          {step === 1 && "Masukkan email Anda untuk menerima kode OTP"}
          {step === 2 && "Masukkan kode OTP yang telah dikirim ke email Anda"}
          {step === 3 && "Masukkan password baru Anda"}
        </Text>

        <View style={{ width: '90%', alignSelf: 'center' }}>
          <Animated.View>
            {renderFormStep()}
          </Animated.View>

          <Button
            label={step === 1 ? "Kirim OTP" : step === 2 ? "Verifikasi OTP" : "Reset Password"}
            onPress={handleSubmit(
              step === 1 ? handleSendOTP :
                step === 2 ? handleVerifyOTP :
                  handleResetPassword
            )}
            style={{
              height: 50,
              borderRadius: 25,
              backgroundColor: '#2563eb',
            }}
            labelStyle={{
              fontFamily: 'Poppins-Medium',
              fontSize: 16,
            }}
            disabled={isLoading}
          >
            {isLoading && (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginRight: 8 }}
              />
            )}
          </Button>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-8"
          >
            <Text className="text-center font-poppins-semibold text-base text-blue-400">
              Kembali ke halaman login
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {successModalVisible && (
        <SuccessModal
          isVisible={successModalVisible}
          onClose={() => setSuccessModalVisible(false)}
          message={modalMessage}
        />
      )}

      {errorModalVisible && (
        <Modal
          transparent
          visible={errorModalVisible}
          animationType='fade'
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white rounded-2xl p-6 w-9/12 max-w-md shadow-lg">
              <View className="items-center">
                <View className="w-60 h-60 mb-3">
                  <Image
                    source={
                      errorType === 'otp'
                        ? require('../../assets/image/otp-vector.png')
                        : errorType === 'email'
                          ? require('../../assets/image/already-vector.png')
                          : require('../../assets/image/regis-vector.png')
                    }
                    className="w-full h-full object-contain"
                  />
                </View>
                <Text className="font-poppins-medium text-xl text-gray-800 mb-2 text-center">
                  {errorType === 'otp'
                    ? 'Kode OTP Tidak Valid'
                    : errorType === 'email'
                      ? 'Email Tidak Terdaftar'
                      : 'Terjadi Kesalahan'}
                </Text>
                <Text className="font-poppins-regular text-sm text-gray-600 text-center mb-6">
                  {modalMessage}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setErrorModalVisible(false)}
                className="bg-gray-200 py-3 rounded-full items-center"
              >
                <Text className="text-black font-poppins-medium text-sm">Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ForgotPasswordScreen;