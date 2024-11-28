import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import ConfirmationModal from '../../components/ConfirmationModal';

const Favorite = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const favoriteCars = [
    {
      name: 'Tesla Model S 2023',
      location: 'Purwokerto, Indonesia',
      price: '$150/day',
      image: 'https://example.com/tesla-model-s.jpg'
    },
    {
      name: 'BMW i8 2021',
      location: 'Jakarta, Indonesia',
      price: '$180/day',
      image: 'https://example.com/bmw-i8.jpg'
    },
    {
      name: 'Mercedes-Benz E-Class 2022',
      location: 'Surabaya, Indonesia',
      price: '$160/day',
      image: 'https://example.com/mercedes-e-class.jpg'
    },
    {
      name: 'Audi A4 2020',
      location: 'Bandung, Indonesia',
      price: '$130/day',
      image: 'https://example.com/audi-a4.jpg'
    }
  ];

  const handleTrashPress = (car) => {
    setSelectedCar(car);
    setModalVisible(true);
  };

  const handleConfirmDelete = () => {
    console.log(`${selectedCar.name} has been removed.`);
    setModalVisible(false);
    // Logika untuk menghapus mobil dari daftar favorit
  };

  const handleCancelDelete = () => {
    setSelectedCar(null);
    setModalVisible(false);
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-[#097cf9] rounded-b-[15px] overflow-hidden">
        <View className="px-5 pt-10 pb-5">
          <Text className="font-poppins-semibold text-white text-[18px] shadow-[rgba(0,0,0,0.4)_0_-1px_10px]">Cari mobil favoritmu di sini</Text>
          <Text className="font-poppins-regular text-white text-[13px] mt-1">Temukan mobil jadi lebih mudah</Text>
        </View>
      </View>

      <ScrollView className="px-5 pt-5" showsVerticalScrollIndicator={false}>
        {/* Favorite Cars Section */}
        <View className="mb-5">
          {favoriteCars.map((car, index) => (
            <View className="flex-row bg-white rounded-[15px] p-4 mb-4 shadow-md" key={index}>
              <Image source={{ uri: car.image }} className="w-[100px] h-[100px] rounded-[10px]" />
              <View className="flex-1 ml-4 justify-center">
                <Text className="text-[16px] font-poppins-semibold text-gray-800">{car.name}</Text>
                <Text className="text-[14px] font-poppins-regular text-gray-600 mt-1">{car.location}</Text>
                <Text className="text-[16px] font-poppins-semibold text-blue-500 mt-1">{car.price}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleTrashPress(car)}
                className="rounded-full justify-center items-center p-2 hover:bg-red-100 transition duration-200"
              >
                <Ionicons name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <ConfirmationModal
        modalVisible={modalVisible}
        title="Delete Favorite?"
        subTitle={`Are you sure you want to delete ${selectedCar?.name} from your favorites?`}
        url={require('../../assets/lottie/question-animation.json')}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </View>
  );
};

export default Favorite;
