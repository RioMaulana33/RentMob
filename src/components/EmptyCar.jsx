import React from 'react';
import { View, Text, Image } from 'react-native';

const EmptyCar = () => {
  return (
    <View className="flex-1 items-center justify-center py-8 top-28">
      <Image 
        source={ require('../assets/image/biasa.png') }
        alt="Select City Illustration"
        className="w-64 h-60 mb-6"
      />
      
      <Text className="text-xl font-poppins-semibold text-gray-800 text-center mb-2">
        Pilih Kota Anda
      </Text>
      <Text className="text-gray-500 font-poppins-regular text-center px-8">
        Silahkan pilih kota untuk melihat daftar mobil yang tersedia di Kota Anda
      </Text>
    </View>
  );
};

export default EmptyCar;