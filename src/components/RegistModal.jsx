import React from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, Image } from 'react-native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

// Error Modal Component
export const ErrorModal = ({ isVisible, onClose, message, errorType = 'default' }) => {
  const getErrorContent = () => {
    switch (errorType) {
      case 'otp':
        return {
          title: 'Kode OTP Tidak Valid',
          image: require('../assets/image/otp-vector.png'),
          description: 'Kode OTP yang Anda masukkan salah. Silakan coba lagi.'
        };
      case 'email':
        return {
          title: 'Email Sudah Terdaftar',
          image: require('../assets/image/already-vector.png'),
          description: 'Gunakan email lain atau login menggunakan email ini'
        };
      default:
        return {
          title: 'Terjadi Kesalahan',
          image: require('../assets/image/already-vector.png'),
          description: message
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <Modal transparent visible={isVisible} animationType='fade'>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-9/12 max-w-md shadow-lg">
          <View className="items-center">
            <View className="w-60 h-60 mb-3">
              <Image
                source={errorContent.image}
                className="w-full h-full object-contain"
              />
            </View>
            <Text className="font-poppins-medium text-xl text-gray-800 mb-2 text-center">
              {errorContent.title}
            </Text>
            <Text className="font-poppins-regular text-sm text-gray-600 text-center mb-6">
              {errorContent.description}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="bg-gray-200 py-3 rounded-full items-center"
          >
            <Text className="text-black font-poppins-medium text-sm">Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Success Modal Component
export const SuccessModal = ({ isVisible, message, onClose, autoClose = true }) => {
  React.useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, onClose]);

  return (
    <Modal transparent visible={isVisible} animationType='fade'>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-10/12 max-w-md shadow-lg items-center">
          <LottieView
            source={require('../assets/lottie/check-animation.json')}
            autoPlay
            loop={false}
            style={{
              width: width * 0.6,
              height: width * 0.6,
            }}
          />
          <Text className="text-xl text-gray-800 font-poppins-semibold mb-2 text-center">
            Berhasil!
          </Text>
          <Text className="text-md text-gray-600 text-center font-poppins-regular">
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
};