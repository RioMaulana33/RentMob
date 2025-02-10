import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from '../../../libs/axios';
import FastImage from 'react-native-fast-image';
import EmptyCar from '../../../components/EmptyCar';
import CarLoader from '../../../components/CarLoader';
import WishlistButton from '../../../components/WishlistButton';
import { useUser } from '../../../services';

const { height, width } = Dimensions.get('window');

const CarTypeInfo = ({ icon, type }) => (
  <View className="items-center mx-2">
    <View className="bg-blue-50 p-3 rounded-xl mb-2">
      <MaterialIcon name={icon} size={24} color="#0255d6" />
    </View>
    <Text className="text-sm font-poppins-medium text-gray-800">{type}</Text>
  </View>
);

const Home = ({ navigation }) => {
  const { data: user, isLoading: isUserLoading } = useUser();
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [kotaId, setKotaId] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);
  const [kotaList, setKotaList] = useState([]);
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [citySearchQuery, setCitySearchQuery] = useState('');

  const [isCarDetailsModalVisible, setIsCarDetailsModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const getTime = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 3 && currentHour < 11) return 'Selamat Pagi';
    if (currentHour >= 11 && currentHour < 15) return 'Selamat Siang';
    if (currentHour >= 15 && currentHour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const carTypes = [
    { icon: 'car-estate', type: 'SUV' },
    { icon: 'car-sports', type: 'Sedan' },
    { icon: 'car-side', type: 'MPV' },
    { icon: 'car', type: 'LCGC' },
  ];

  const sortedAndFilteredCities = kotaList
    .filter(city =>
      city.nama.toLowerCase().includes(citySearchQuery.toLowerCase())
    )
    .sort((a, b) => a.nama.localeCompare(b.nama));

  const renderCarDetailSpecItem = (iconName, title, value) => (
    <View className="flex-row items-center mb-3 bg-gray-100 p-2.5 rounded-xl">
      <MaterialIcon
        name={iconName}
        size={24}
        color="#0255d6"
        style={{ marginRight: 12 }}
      />
      <View className="flex-1">
        <Text className="text-gray-600 text-sm font-poppins-regular">{title}</Text>
        <Text className="font-poppins-semibold text-base text-gray-500">{value}</Text>
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
        // console.log("Full image URL:", `${process.env.APP_URL}/storage/${response.data.data[0]?.mobil?.foto}`);
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

  const displayedCars = filteredCars.slice(0, 10);
  const hasMoreCars = filteredCars.length > 10;

  const handleSeeMore = () => {
    navigation.navigate('AllCars', {
      kotaId: kotaId,
      kotaName: selectedKota?.nama,
      initialCars: cars
    });
  };

  const handleOpenCityModal = () => {
    if (!isCityModalVisible) {
      setIsCityModalVisible(true);
    }
  };

  const handleCloseCityModal = () => {
    setIsCityModalVisible(false);
    setCitySearchQuery('');
  };

  const handleCitySelect = (kota) => {
    setKotaId(kota.id);
    setSelectedKota(kota);
    handleCloseCityModal();
  };

  const handleOpenCarDetail = (car) => {
    setSelectedCar(car);
    setIsCarDetailsModalVisible(true);
  };;

  const handleCloseCarDetail = () => {
    setIsCarDetailsModalVisible(false);
    setTimeout(() => {
      setSelectedCar(null);
    }, 500); // Sesuaikan dengan animationOutTiming
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setIsCarDetailsModalVisible(true);
  };

  const handleRentCar = () => {
    if (selectedCar) {
      navigation.navigate("RentalForm", {
        carId: selectedCar.mobil.id,
        kotaId: selectedCar.kota.id
      });
      handleCloseCarDetail();
    }
  };

  const renderCityItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCitySelect(item)}
      className="flex-row items-center p-4 border-b border-gray-200"
    >
      <Icon name="location" size={24} color="#0255d6" style={{ marginRight: 12 }} />
      <Text className="text-base font-poppins-medium text-gray-800">{item.nama}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white">
        <LinearGradient
          colors={["#0255d6", "#0372f5"]}
          className="px-5 pt-8 pb-6"
          style={{
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <View className="mb-6">
            <Text className="text-white/80 text-sm font-poppins-regular mb-1">
              {getTime()},
            </Text>
            <Text className="text-white text-lg font-poppins-semibold">
              {isUserLoading ? "Loading..." : user?.name || "Pengguna"}
            </Text>
          </View>

          <View className="absolute top-8 right-5 flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.navigate('Wishlist')}
              className="mr-3 relative"
            >
              <Icon name="heart-outline" size={27} color="white" />
              
              <View className="absolute top-0 -right-0.5 bg-red-500 rounded-full w-3 h-3 items-center justify-center">
                <Text className="text-white text-xs font-poppins-medium"></Text>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate('Profile', {
                screen: 'EditProfile'
              })}
              className="rounded-full p-1"
            >
              <Icon name="person-circle" size={30} color="white" />
            </TouchableOpacity> */}
          </View>

          <TouchableOpacity
            onPress={handleOpenCityModal}
            className="bg-white rounded-xl flex-row items-center px-4 py-3 shadow-sm"
          >
            <Icon name="location" size={20} color="#0255d6" style={{ marginRight: 10 }} />
            <Text className="flex-1 text-gray-500 font-poppins-semibold text-sm">
              {selectedKota ? selectedKota.nama : 'Pilih Kota'}
            </Text>
            <Icon name="chevron-down" size={20} color="#0255d6" />
          </TouchableOpacity>
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
            <Text className="text-xl font-poppins-semibold text-black">Pilih Kota Anda</Text>
            <TouchableOpacity onPress={() => setIsCityModalVisible(false)}>
              <Icon name="close" size={24} color="#0255d6" />
            </TouchableOpacity>
          </View>

          <View className="bg-gray-100 rounded-xl flex-row items-center px-4 mb-4">
            <Icon name="search" size={20} color="#0255d6" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Cari kota"
              placeholderTextColor="#999"
              value={citySearchQuery}
              onChangeText={setCitySearchQuery}
              className="flex-1 text-black font-poppins-medium py-2"
              style={{ fontSize: 13 }}
            />
            {citySearchQuery ? (
              <TouchableOpacity onPress={() => setCitySearchQuery('')}>
                <Icon name="close-circle" size={20} color="gray" />
              </TouchableOpacity>
            ) : null}
          </View>

          <FlatList
            data={sortedAndFilteredCities}
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
                <FastImage
                  source={{
                    uri: selectedCar.mobil.foto
                      ? `${process.env.APP_URL}/storage/${selectedCar.mobil.foto}`
                      : "https://via.placeholder.com",
                    priority: FastImage.priority.high
                  }}
                  style={{
                    width: '100%',
                    height: 256,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    backgroundColor: '#e5e5e5' // Untuk debug
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <TouchableOpacity
                  onPress={handleCloseCarDetail}
                  className="absolute top-4 right-4 bg-white/70 rounded-full p-2"
                >
                  <Icon name="close" size={24} color="#0255d6" />
                </TouchableOpacity>
                <WishlistButton
                  carId={selectedCar.mobil.id}
                  kotaId={selectedCar.kota.id}
                  userId={user.id} // Pass the current user's ID
                />
              </View>

              <View className="px-5 pt-5">
                <Text className="text-2xl font-poppins-semibold mb-2 text-black">
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

      <ScrollView
        className="px-5 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >

        <View className="mb-20">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-poppins-semibold text-gray-800">Mobil Tersedia</Text>
            {hasMoreCars && (
              <TouchableOpacity
                onPress={handleSeeMore}
                className="px-3 py-1 rounded-full"
              >
                <Text className="text-blue-500 font-poppins-medium">Lihat Semua</Text>
              </TouchableOpacity>
            )}
          </View>

          {!kotaId ? (
            <EmptyCar />
          ) : isLoading ? (
            <CarLoader />
          ) : displayedCars.length > 0 ? (
            displayedCars.map((car, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-xl p-4 mb-4 shadow-sm"
                style={{
                  elevation: 5
                }}
                onPress={() => handleOpenCarDetail(car)}
              >
                <FastImage
                  source={{
                    uri: car.mobil.foto
                      ? `${process.env.APP_URL}/storage/${car.mobil.foto}`
                      : "https://via.placeholder.com",
                    priority: FastImage.priority.normal
                  }}
                  style={{
                    width: '100%',
                    height: 160,
                    borderRadius: 12,
                    marginBottom: 12,
                    backgroundColor: '#e5e5e5'
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-black text-lg font-poppins-semibold">
                      {car.mobil.merk} {car.mobil.model}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Icon name="location" size={16} color="#0255d6" />
                      <Text className="text-gray-500 font-poppins-regular ml-1">
                        {car.kota.nama}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-blue-500 font-poppins-semibold">
                    {formatRupiah(car.mobil.tarif)}/hari
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500 font-poppins-medium text-center">
                Tidak ada mobil tersedia di kota ini
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;