import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SuccessRegis = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient 
      colors={['#0255d6', '#0372f5']}
      className="flex-1 relative"
    >
      <View className="flex-1 justify-center items-center px-5">
        <LottieView
          source={require('../../assets/lottie/check-animation.json')}
          autoPlay
          loop={false}
          style={{
            width: width * 0.6,
            height: width * 0.6,
          }}
        />

        <Text 
          className="text-2xl text-white font-poppins-semibold text-center mt-5"
        >
          Registrasi Berhasil!
        </Text>

        <Text 
          className="text-base text-white font-poppins-regular text-center mt-2 mx-5"
        >
          Akun Anda telah berhasil dibuat. Silakan login untuk melanjutkan.
        </Text>
      </View>

      <View className="absolute bottom-10 w-full px-6">
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="bg-white py-4 rounded-full flex-row justify-center items-center"
        >
          <Text 
            className="text-[#0ea5e9] font-poppins-semibold text-base text-center"
          >
            Lanjut ke Halaman Login
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SuccessRegis;