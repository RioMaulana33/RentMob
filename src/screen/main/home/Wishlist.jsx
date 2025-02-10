import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import axios from '../../../libs/axios';
import { useUser } from '../../../services';
import LinearGradient from 'react-native-linear-gradient';
import WishlistButton from '../../../components/WishlistButton';

const { height } = Dimensions.get('window');

const Wishlist = ({ navigation }) => {
  const { data: user } = useUser();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
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

  const fetchWishlist = async (pageNumber = 1, shouldRefresh = false) => {
    try {
      if (shouldRefresh) {
        setIsRefreshing(true);
      } else if (pageNumber === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await axios.post('/wishlist/user', {
        page: pageNumber,
        per: 10,
        search: searchQuery
      });

      const newData = response.data.data;
      setHasMore(newData.length === 10);

      if (pageNumber === 1) {
        setWishlist(newData);
      } else {
        setWishlist(prev => [...prev, ...newData]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchWishlist(1);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchWishlist(nextPage);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    fetchWishlist(1, true);
  };

  const removeFromWishlist = async (uuid) => {
    try {
      await axios.delete(`/wishlist/wishlist/destroy/${uuid}`);
      handleCloseCarDetail(); 
      fetchWishlist(page);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleOpenCarDetail = (car) => {
    setSelectedCar(car);
    setIsCarDetailsModalVisible(true);
  };

  const handleCloseCarDetail = () => {
    setIsCarDetailsModalVisible(false);
    setTimeout(() => {
      setSelectedCar(null);
    }, 500);
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

  const renderWishlistItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleOpenCarDetail(item)}
      className="bg-white rounded-xl p-4 mx-5 mb-4 shadow-sm"
      style={{ elevation: 5 }}
    >
      <FastImage
        source={{
          uri: item.mobil.foto
            ? `${process.env.APP_URL}/storage/${item.mobil.foto}`
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
            {item.mobil.merk} {item.mobil.model}
          </Text>
          <View className="flex-row items-center mt-1">
            <Icon name="location" size={16} color="#0255d6" />
            <Text className="text-gray-500 font-poppins-regular ml-1">
              {item.kota.nama}
            </Text>
          </View>
        </View>
        <Text className="text-blue-500 font-poppins-semibold">
          {formatRupiah(item.mobil.tarif)}/hari
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0255d6" />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient colors={["#0255d6", "#0372f5"]}>
        <View className="px-4 py-4 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="font-poppins-medium text-[18px] text-white ml-2 top-0.5">
            Wishlist Saya
          </Text>
        </View>
      </LinearGradient>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0255d6" />
        </View>
      ) : wishlist.length > 0 ? (
        <FlatList
          data={wishlist}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.uuid}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#0255d6']}
            />
          }
        />
      ) : (
        <View className="flex-1 justify-center items-center px-5">
          <MaterialIcon name="heart-off" size={48} color="#9ca3af" />
          <Text className="text-gray-500 font-poppins-medium mt-4 text-center">
            Belum ada mobil yang ditambahkan ke wishlist
          </Text>
        </View>
      )}

      {/* Car Details Modal */}
      <Modal
        isVisible={isCarDetailsModalVisible}
        onBackdropPress={handleCloseCarDetail}
        onSwipeComplete={handleCloseCarDetail}
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
                  backgroundColor: '#e5e5e5'
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <TouchableOpacity
                onPress={handleCloseCarDetail}
                className="absolute top-4 right-4 bg-white/70 rounded-full p-2"
              >
                <Icon name="close" size={24} color="#0255d6" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeFromWishlist(selectedCar.uuid)}
                className="absolute top-4 left-4 bg-white/70 rounded-full p-2"
              >
                <Icon name="heart" size={24} color="#ef4444" />
              </TouchableOpacity>
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
    </View>
  );
};

export default Wishlist;