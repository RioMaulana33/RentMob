import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const Home = ({ navigation }) => {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header Section with Gradient Background */}
      <LinearGradient colors={['#097cf9', '#0ea5e9']} className="rounded-b-2xl overflow-hidden p-5">
        <View className="pt-10">
          <Text className="font-poppins-semibold text-white text-lg shadow-md">Hi, Selamat Datang di BluCarra</Text>
          <View className="flex-row items-center mt-5">
            <View className="flex-1 bg-white rounded-lg px-4 py-2 flex-row items-center">
              <TextInput 
                placeholder="Cari ...."
                placeholderTextColor="#666"
                className="flex-1 h-12 text-sm font-poppins-regular text-gray-500"
              />
              <TouchableOpacity className="p-2">
                <Ionicons name="options-outline" size={20} color="#0ea5e9" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="px-5 pt-5" showsVerticalScrollIndicator={false}>
        {/* Top Brand Section with Card */}
        <View className="bg-white rounded-xl p-5 mb-5 shadow-md">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-poppins-semibold text-gray-800">Top Brand</Text>
            <TouchableOpacity>
              <Text className="text-sm font-poppins-regular text-blue-500">Lihat Lainya</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {['tesla', 'bmw', 'mercedes', 'audi'].map((brand) => (
              <TouchableOpacity className="items-center mr-5" key={brand}>
                <Image source={{ uri: `https://example.com/${brand}-logo.png` }} className="w-12 h-12 rounded-full bg-white shadow-md" />
                <Text className="mt-2 text-sm font-poppins-regular text-gray-800">{brand.charAt(0).toUpperCase() + brand.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-poppins-semibold text-gray-800">Mobil Tersedia</Text>
          <TouchableOpacity>
            <Text className="text-sm font-poppins-regular text-blue-500">Lihat Lainya</Text>
          </TouchableOpacity>
        </View>
        
        <View className="mb-5">
          {[
            {
              name: 'Tesla Model S 2023',
              location: 'Purwokerto, Indonesia',
              price: '$150/day',
              image: 'https://example.com/tesla-model-s.jpg'
            },
            {
              name: 'Tesla Model Y 2021',
              location: 'Purwokerto, Indonesia',
              price: '$125/day',
              image: 'https://example.com/tesla-model-y.jpg'
            }
          ].map((car, index) => (
            <TouchableOpacity className="flex-row bg-white rounded-xl p-4 mb-4 shadow-md" key={index} onPress={() => navigation.navigate('CarDetail', { car })}>
              <Image source={{ uri: car.image }} className="w-24 h-24 rounded-lg" />
              <View className="flex-1 ml-4 justify-center">
                <Text className="text-lg font-poppins-semibold text-gray-800">{car.name}</Text>
                <Text className="text-sm font-poppins-regular text-gray-600 mt-1">{car.location}</Text>
                <Text className="text-lg font-poppins-semibold text-blue-500 mt-1">{car.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default Home;