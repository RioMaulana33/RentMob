import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, Animated, Modal, Image } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import axios from '../../libs/axios';
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextField, Button, Colors } from "react-native-ui-lib";
import { ErrorModal, SuccessModal } from '../../components/RegistModal';
import OTPInput from '../../components/OTPInput';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [phase, setPhase] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempName, setTempName] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errorType, setErrorType] = useState('default');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const shakeAnimation = React.useRef(new Animated.Value(0)).current;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const startShakeAnimation = () => {
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
        toValue: 0,
        duration: 50,
        useNativeDriver: true
      })
    ]).start();
  };

  // Phase 1: Send Registration OTP
  const handlePhase1Submit = async (data) => {
    try {
      setIsLoading(true);

      const response = await axios.post("/auth/initialize-registration", {
        name: data.name,
        email: data.email
      });

      if (response.data.status) {
        setTempEmail(data.email);
        setTempName(data.name);
        setPhase(2);
        setCountdown(60);
      }

    } catch (error) {
      if (error.response?.data?.message.includes('email') ||
        error.response?.data?.message.includes('taken')) {
        setErrorType('email');
        setErrorModalVisible(true);
      } else {
        setErrorType('default');
        setErrorModalVisible(true);
        setErrorMessage(error.response?.data?.message || 'Terjadi kesalahan sistem');
      }
      console.error("Registration initialization failed", error.response?.data || error.message);
      startShakeAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  // Phase 2: Verify OTP
  const handlePhase2Submit = async (data) => {
    try {
      setIsLoading(true);

      const formattedOTP = data.otp.toString().padStart(6, '0');

      const response = await axios.post("/auth/verify-registration-otp", {
        email: tempEmail,
        otp: formattedOTP
      });

      if (response.data.status) {
        setSuccessModalVisible(true);
        setSuccessMessage('Kode OTP berhasil diverifikasi');
        setTimeout(() => {
          setSuccessModalVisible(false);
          setPhase(3);
        }, 2000);
      }

    } catch (error) {
      console.error("OTP verification failed", {
        requestData: {
          email: tempEmail,
          otp: data.otp
        },
        error: error.response?.data || error.message
      });

      setErrorType('otp');
      setErrorModalVisible(true);
      setErrorMessage('Kode OTP tidak valid');
    } finally {
      setIsLoading(false);
    }
  };

  // Phase 3: Complete Registration
  const handlePhase3Submit = async (data) => {
    try {
      setIsLoading(true);

      // Call complete registration endpoint
      const response = await axios.post("/auth/complete-registration", {
        email: tempEmail,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password_confirmation
      });

      if (response.data.status) {
        // Registration successful, navigate to success screen
        navigation.navigate('SuccessRegis');
      }

    } catch (error) {
      // console.error("Registration completion failed", error.response?.data || error.message);
      startShakeAnimation();

      // Show error message to user
      setErrorModalVisible(true);
      setErrorMessage(error.response?.data?.message || 'Gagal menyelesaikan registrasi');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP function
  const resendOTP = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post("/auth/resend-registration-otp", {
        email: tempEmail,
        name: tempName
      });
      if (response.data.status) {
        setSuccessModalVisible(true);
        setSuccessMessage('Kode OTP baru telah dikirim ke email Anda');
        setCountdown(60);
        setTimeout(() => {
          setSuccessModalVisible(false);
        }, 2000);
      }

    } catch (error) {
      console.error("Resend OTP failed", error.response?.data || error.message);
      setErrorModalVisible(true);
      setErrorMessage(error.response?.data?.message || 'Gagal mengirim ulang kode OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPhase1 = () => (
    <View>
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
                placeholder="Nama Lengkap"
                placeholderTextColor="#999"
                maxLength={20}
                enableErrors
                fieldStyle={{
                  paddingVertical: 12,
                  paddingHorizontal: 45,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: errors.name ? '#ef4444' : Colors.grey60,
                  backgroundColor: '#f5f5f5',
                }}
                onChangeText={onChange}
                value={value}
              />
              <View style={{ position: "absolute", left: 15, top: 15 }}>
                <Ionicons name="person" size={20} color={errors.name ? '#ef4444' : '#666'} />
              </View>
            </View>
          )}
        />
        {errors.name && (
          <Text className="text-red-500 font-poppins-regular text-sm bottom-3">
            {errors.name.message}
          </Text>
        )}
      </View>

      <View marginB-25 className='mt-4 relative'>
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
              <View style={{ position: "absolute", left: 15, top: 15 }}>
                <Ionicons name="mail" size={20} color={errors.email ? '#ef4444' : '#666'} />
              </View>
            </View>
          )}
        />
        {errors.email && (
          <Text className="text-red-500 font-poppins-regular text-sm bottom-3">
            {errors.email.message}
          </Text>
        )}
      </View>

      <Button
        labelStyle={{ fontFamily: "Poppins-Medium", color: 'white' }}
        style={{ marginTop: 20 }}
        backgroundColor={'#2563eb'}
        paddingV-14
        borderRadius={25}
        onPress={handleSubmit(handlePhase1Submit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Text style={{ color: 'white', fontFamily: "Poppins-Medium" }}>
            Mengirim Kode OTP...
          </Text>
        ) : (
          <Text style={{ fontSize: 15, color: 'white', fontFamily: "Poppins-SemiBold" }}>
            Kirim Kode OTP
          </Text>
        )}
      </Button>
    </View>
  );

  const renderPhase2 = () => (
    <View>
      <View marginB-25 className='mt-2'>
        <Controller
          control={control}
          name="otp"
          rules={{
            required: "Kode OTP tidak boleh kosong",
            minLength: { value: 6, message: "Kode OTP harus 6 digit" },
            maxLength: { value: 6, message: "Kode OTP harus 6 digit" }
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
          <Text className="text-red-500 font-poppins-regular text-sm text-center mt-2">
            {errors.otp.message}
          </Text>
        )}
      </View>

      <Button
        labelStyle={{ fontFamily: "Poppins-Medium", color: 'white' }}
        style={{ marginTop: 20 }}
        backgroundColor={'#2563eb'}
        paddingV-14
        borderRadius={25}
        onPress={handleSubmit(handlePhase2Submit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Text style={{ color: 'white', fontFamily: "Poppins-Medium" }}>
            Memverifikasi OTP...
          </Text>
        ) : (
          <Text style={{ fontSize: 15, color: 'white', fontFamily: "Poppins-SemiBold" }}>
            Verifikasi OTP
          </Text>
        )}
      </Button>

      <View className="flex-row justify-center items-center mt-6">
        <TouchableOpacity
          onPress={resendOTP}
          disabled={countdown > 0 || isLoading}
          className={`${countdown > 0 ? 'opacity-50' : ''}`}
        >
          <Text className="text-blue-500 font-poppins-medium">
            Kirim Ulang Kode OTP
          </Text>
        </TouchableOpacity>
        {countdown > 0 && (
          <Text className="text-gray-500 font-poppins-regular ml-2">
            ({countdown}s)
          </Text>
        )}
      </View>
    </View>
  );

  const renderPhase3 = () => (
    <View>
      <View marginB-25 className='mt-2 relative'>
        <Controller
          control={control}
          name="phone"
          rules={{
            required: "Nomor telepon tidak boleh kosong",
            pattern: {
              value: /^(\+62|62|0)8[1-9][0-9]{7,10}$/,
              message: "Nomor telepon tidak valid."
            }
          }}
          render={({ field: { onChange, value } }) => (
            <View>
              <TextField
                style={{ fontFamily: "Poppins-Regular" }}
                placeholder="Nomor Telepon"
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                enableErrors
                fieldStyle={{
                  paddingVertical: 12,
                  paddingHorizontal: 45,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: errors.phone ? '#ef4444' : Colors.grey60,
                  backgroundColor: '#f5f5f5',
                }}
                onChangeText={onChange}
                value={value}
              />
              <View style={{ position: "absolute", left: 15, top: 15 }}>
                <Ionicons name="call" size={20} color={errors.phone ? '#ef4444' : '#666'} />
              </View>
            </View>
          )}
        />
        {errors.phone && (
          <Text className="text-red-500 font-poppins-regular text-sm bottom-3">
            {errors.phone.message}
          </Text>
        )}
      </View>

      <View marginB-25 className='mt-4 relative'>
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
                placeholder="Password"
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
                onChangeText={onChange}
                value={value}
              />
              <View style={{ position: "absolute", left: 15, top: 15 }}>
                <Ionicons name="key" size={20} color={errors.password ? '#ef4444' : '#666'} />
              </View>
              <TouchableOpacity
                onPress={() => setPasswordVisible(!isPasswordVisible)}
                style={{ position: "absolute", right: 15, top: 15 }}
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
          <Text className="text-red-500 font-poppins-regular text-sm bottom-3">
            {errors.password.message}
          </Text>
        )}
      </View>

      <View marginB-25 className='mt-4 relative'>
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
                placeholder="Konfirmasi Password"
                placeholderTextColor="#999"
                secureTextEntry={!isConfirmPasswordVisible}
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
              <View style={{ position: "absolute", left: 15, top: 15 }}>
                <Ionicons name="key" size={20} color={errors.password_confirmation ? '#ef4444' : '#666'} />
              </View>
              <TouchableOpacity
                onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
                style={{ position: "absolute", right: 15, top: 15 }}
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
          <Text className="text-red-500 font-poppins-regular text-sm bottom-3">
            {errors.password_confirmation.message}
          </Text>
        )}
      </View>

      <Button
        labelStyle={{ fontFamily: "Poppins-Medium", color: 'white' }}
        style={{ marginTop: 20 }}
        backgroundColor={'#2563eb'}
        paddingV-14
        borderRadius={25}
        onPress={handleSubmit(handlePhase3Submit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Text style={{ color: 'white', fontFamily: "Poppins-Medium" }}>
            Mendaftarkan Akun...
          </Text>
        ) : (
          <Text style={{ fontSize: 15, color: 'white', fontFamily: "Poppins-SemiBold" }}>
            Daftar
          </Text>
        )}
      </Button>
    </View>
  );

  const getPhaseTitle = () => {
    switch (phase) {
      case 1:
        return "Registrasi";
      case 2:
        return "Verifikasi Email";
      case 3:
        return "Lengkapi Data";
      default:
        return "Registrasi";
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 1:
        return "Masukkan nama dan email aktif Anda";
      case 2:
        return "Masukkan kode OTP yang telah dikirim ke email Anda";
      case 3:
        return "Lengkapi data untuk menyelesaikan pendaftaran";
      default:
        return "Buat akun baru untuk melanjutkan";
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
          {getPhaseTitle()}
        </Text>
        <Text className="text-sm font-poppins-regular text-[#7f7f7f] text-center mb-5 mt-[5px]">
          {getPhaseDescription()}
        </Text>

        <View style={{ width: '90%', alignSelf: 'center' }}>
          <Animated.View
          >
            {phase === 1 && renderPhase1()}
            {phase === 2 && renderPhase2()}
            {phase === 3 && renderPhase3()}
          </Animated.View>

          <ErrorModal
            isVisible={errorModalVisible}
            message={errorMessage}
            errorType={errorType}
            onClose={() => setErrorModalVisible(false)}
          />
          <SuccessModal
            isVisible={successModalVisible}
            message={successMessage}
            onClose={() => setSuccessModalVisible(false)}
          />
        </View>

        {phase === 1 && (
          <View className="flex-row justify-center mt-10 top">
            <Text className="text-[#7f7f7f] font-poppins-regular">Sudah Punya Akun?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-[#0ea5e9] font-poppins-semibold"> Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default RegisterScreen;