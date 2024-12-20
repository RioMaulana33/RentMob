import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from '../../../libs/axios';

const { height, width } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [kotaId, setKotaId] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);
  const [kotaList, setKotaList] = useState([]);
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCarDetailsModalVisible, setIsCarDetailsModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const renderCarDetailSpecItem = (iconName, title, value) => (
    <View className="flex-row items-center mb-3 bg-gray-100 p-3 rounded-xl">
      <MaterialIcon 
        name={iconName} 
        size={24} 
        color="#0255d6" 
        style={{ marginRight: 12 }} 
      />
      <View className="flex-1">
        <Text className="text-gray-600 text-sm font-poppins-regular">{title}</Text>
        <Text className="font-poppins-semibold text-base">{value}</Text>
      </View>
    </View>
  );

  useEffect(() => {
    const fetchKota = async () => {
      try {
        const response = await axios.get('kota/get');
        setKotaList(response.data.data);
      } catch (error) {
        console.error("Error fetching kota:", error.response?.data || error.message);
      }
    };

    fetchKota();
  }, []);

  useEffect(() => {
    if (!kotaId) return;

    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/mobil/getkota/${kotaId}`);
        console.log(response.data );
        setCars(response.data.data);
      } catch (error) {
        console.error("Error fetching cars:", error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, [kotaId]);

  const filteredCars = cars.filter(car =>
    car.mobil.merk.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.mobil.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (kota) => {
    setKotaId(kota.id);
    setSelectedKota(kota);
    setIsCityModalVisible(false);
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setIsCarDetailsModalVisible(true);
  };

  const handleRentCar = () => {
    // Navigate to rental form with selected car's ID
    if (selectedCar) {
      navigation.navigate("RentalForm", { carId: selectedCar.mobil.id });
      setIsCarDetailsModalVisible(false);
    }
  };

  const renderCityItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCitySelect(item)}
      className="flex-row items-center p-4 border-b border-gray-200"
    >
      <Icon name="location" size={24} color="#0255d6" style={{ marginRight: 12 }} />
      <Text className="text-base font-poppins-medium">{item.nama}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white">
        <LinearGradient
          colors={["#0255d6", "#0372f5"]}
          className="px-5 pt-12 pb-4 rounded-b-2xl overflow-hidden"
        >
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-white text-lg font-poppins-semibold bottom-5 ">BluCarra</Text>
              <Text className="text-white/80 font-poppins-medium bottom-5 text-sm">Temukan Mobil Impianmu</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsCityModalVisible(true)}
              className="flex-row items-center bg-white/20 rounded-full px-3 py-2 bottom-4 "
            >
              <Icon name="location" size={16} color="white" style={{ marginRight: 5 }} />
              <Text className="text-white font-poppins-medium text-sm">
                {selectedKota ? selectedKota.nama : 'Pilih Kota'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-xl flex-row items-center px-4 ">
            <Icon name="search" size={20} color="#0255d6" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Cari mobil yang anda inginkan"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-black font-poppins-medium top-0.5"
              style={{ fontSize: 13 }}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={20} color="gray" />
              </TouchableOpacity>
            ) : null}
          </View>
        </LinearGradient>
      </View>

      {/* City Selection Modal */}
      <Modal
        isVisible={isCityModalVisible}
        onBackdropPress={() => setIsCityModalVisible(false)}
        onSwipeComplete={() => setIsCityModalVisible(false)}
        swipeDirection={['down']}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        backdropOpacity={0.5}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: height * 0.5,
            paddingTop: 20,
            paddingHorizontal: 20
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-poppins-semibold">Pilih Kota Anda</Text>
            <TouchableOpacity onPress={() => setIsCityModalVisible(false)}>
              <Icon name="close" size={24} color="#0255d6" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={kotaList}
            renderItem={renderCityItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>

      {/* Car Details Modal */}
        <Modal
      isVisible={isCarDetailsModalVisible}
      onBackdropPress={() => setIsCarDetailsModalVisible(false)}
      onSwipeComplete={() => setIsCarDetailsModalVisible(false)}
      swipeDirection={['down']}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      backdropOpacity={0.5}
    >
      {selectedCar && (
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: height * 0.85,
          }}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }} // Extra padding for bottom button
          >
            <View className="relative">
              <Image
                // source={{ uri: selectedCar.mobil.foto }}
                className="w-full h-64 rounded-t-2xl"
                resizeMode="cover"
              />
              <TouchableOpacity 
                onPress={() => setIsCarDetailsModalVisible(false)}
                className="absolute top-4 right-4 bg-white/70 rounded-full p-2"
              >
                <Icon name="close" size={24} color="#0255d6" />
              </TouchableOpacity>
            </View>

            <View className="px-5 pt-5">
              <Text className="text-2xl font-poppins-semibold mb-2">
                {selectedCar.mobil.merk} {selectedCar.mobil.model}
              </Text>
              <Text className="text-blue-500 text-lg font-poppins-medium mb-4">
                 {formatRupiah(selectedCar.mobil.tarif)}/hari
              </Text>

              <View className="space-y-3">
                {renderCarDetailSpecItem(
                  "car", 
                  "Tahun", 
                  selectedCar.mobil.tahun
                )}
                 {renderCarDetailSpecItem(
                  "car-info", 
                  "Model", 
                  selectedCar.mobil.model
                )}
                {renderCarDetailSpecItem(
                  "car-shift-pattern", 
                  "Tipe", 
                  selectedCar.mobil.type
                )}
                {renderCarDetailSpecItem(
                  "car-seat", 
                  "Kapasitas", 
                  `${selectedCar.mobil.kapasitas} Orang`
                )}
                {renderCarDetailSpecItem(
                  "gas-station", 
                  "Bahan Bakar", 
                  selectedCar.mobil.bahan_bakar
                )}
              </View>
            </View>
          </ScrollView>

          <View 
            className="absolute bottom-0 left-0 right-0 p-4 bg-white shadow-2xl"
            style={{ 
              borderTopWidth: 1, 
              borderTopColor: '#E5E7EB' 
            }}
          >
            <TouchableOpacity
              onPress={handleRentCar}
              className="bg-blue-500 rounded-xl p-4 flex-row justify-center items-center"
            >
              <Text className="text-white font-poppins-semibold text-base">
                Sewa Mobil Sekarang
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Modal>

      <ScrollView className="px-5 pt-5" showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-poppins-semibold text-gray-800 mb-2">Mobil Tersedia</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0255d6" />
        ) : (
          filteredCars.map((car, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row bg-white rounded-xl p-4 mb-4 shadow-md"
              onPress={() => handleCarSelect(car)}
            >
              <Image
                // source={{ uri: car.mobil.foto }}
                className="w-24 h-24 rounded-lg"
              />
              <View className="ml-4">
                <Text className="text-lg font-poppins-semibold">{car.mobil.merk} {car.mobil.model}</Text>
                <Text className="text-gray-500 font-poppins-regular">{car.kota.nama}</Text>
                <Text className="text-blue-500 font-poppins-regular">{formatRupiah(car.mobil.tarif)}/day</Text> 
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Home;