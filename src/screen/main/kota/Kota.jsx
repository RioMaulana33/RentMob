import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import axios from '../../../libs/axios';
import CityCardLoader from '../../../components/CityCardLoader';

const { width, height } = Dimensions.get('window');

const Kota = ({ navigation }) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('kota/get');
      const sortedCities = response.data.data.sort((a, b) =>
        a.nama.charAt(0).localeCompare(b.nama.charAt(0))
      );
      setCities(sortedCities);
    } catch (error) {
      console.error("Error fetching cities:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCities = cities.filter(city =>
    city.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CityCard = ({ city, onPress }) => (
    <TouchableOpacity
      onPress={() => onPress(city)}
      className="bg-white rounded-xl mb-3 overflow-hidden"
      style={{
        width: '48%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8
      }}
    >
      <FastImage
        source={{
          uri: city.foto
            ? `${process.env.APP_URL}/storage/${city.foto}`
            : "https://via.placeholder.com/400x200?text=City+Image",
          priority: FastImage.priority.normal
        }}
        style={{
          width: '100%',
          height: 140,
          backgroundColor: '#f3f4f6'
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View className="p-3">
        <Text className="text-md font-poppins-semibold text-gray-800 mb-1 truncate">
          {city.nama}
        </Text>
        <View className="flex-row items-start">
          <Icon name="location-outline" size={14} color="#0255d6" />
          <Text className="text-gray-600 text-xs font-poppins-regular ml-2 flex-1 leading-4 truncate">
            {city.alamat || 'Alamat tidak tersedia'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#0255d6" />
      <View style={{ zIndex: 10, backgroundColor: '#0255d6' }}>
        <LinearGradient
          colors={["#0255d6", "#0372f5"]}
          className="px-5 pt-4 pb-20"
        >
          <View className="flex-row items-center mb-1.5 top-6">
            <Text className="text-white text-xl font-poppins-bold">
              Eksplorasi Kota
            </Text>
          </View>
          <Text className="text-gray-100 font-poppins-regular mb-4 top-6">
            Temukan kota yang tersedia di rental kami
          </Text>
        </LinearGradient>
      </View>

      <View className="flex-1" style={{ marginTop: -20 }}>
        <View
          className="px-4 mb-4"
          style={{
            zIndex: 20,
            backgroundColor: 'transparent',
          }}
        >
          <View
            className="bg-white rounded-lg flex-row items-center px-3 py-2 bottom-4"
            style={{
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            }}
          >
            <Icon name="search" size={18} color="#0255d6" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Cari kota..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-gray-800 font-poppins-regular text-sm"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {isLoading ? (
          <View className="flex-1 px-4">
            <CityCardLoader />
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 8,
              paddingBottom: 80
            }}
          >
            {filteredCities.length > 0 ? (
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between'
              }}>
                {filteredCities.map((city, index) => (
                  <CityCard
                    key={city.id || index}
                    city={city}
                    onPress={(selectedCity) => navigation.navigate('KotaDetail', { city: selectedCity })}
                  />
                ))}
              </View>
            ) : (
              <View className="flex-1 justify-center items-center py-8">
                <MaterialIcon name="city-variant-outline" size={48} color="#0255d6" />
                <Text className="text-gray-500 font-poppins-medium mt-4 text-center">
                  {searchQuery ? 'Tidak ada kota yang sesuai dengan pencarian' : 'Tidak ada data kota tersedia'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default Kota;