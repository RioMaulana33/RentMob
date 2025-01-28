import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Image, SafeAreaView } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import axios from '../../../libs/axios';
import MyRentSkeletonLoader from '../../../components/MyRentSkeletonLoader';

const MyRent = ({ navigation }) => {
  const [filterStatus, setFilterStatus] = useState('-');
  const [rentalHistory, setRentalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const fetchRentalHistory = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const response = await axios.post('/penyewaan/history', {
        status: filterStatus
      });
      setRentalHistory(response.data.data);
    } catch (error) {
      console.error('Error fetching rental history:', error);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRentalHistory();
  }, [filterStatus]);

  const onRefresh = () => {
    fetchRentalHistory(true);
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'aktif':
        return {
          container: 'bg-blue-100',
          text: 'text-blue-500'
        };
      case 'pending':
        return {
          container: 'bg-yellow-100',
          text: 'text-yellow-500'
        };
      case 'selesai':
        return {
          container: 'bg-green-100',
          text: 'text-green-500'
        };
      default:
        return {
          container: 'bg-gray-100',
          text: 'text-gray-500'
        };
    }
  };

  const renderItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <TouchableOpacity 
      onPress={() => navigation.navigate('RentalTracking', { item })}
      className="bg-white rounded-xl p-4 mx-5 mb-4 shadow-md"
    >
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-black text-base font-poppins-semibold">
              {item.mobil?.merk}  -  {item.kota?.nama}
            </Text>
            <View className="border-b border-gray-200 my-3"/>
            <View className="flex-row items-center">
              <IonIcons name="calendar-outline" size={16} color="#6B7280" />
              <Text className="font-poppins-regular text-sm text-gray-600 ml-2">
                {item.tanggal_mulai}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500 font-poppins-regular text-[13px]">Kode:</Text>
            <Text className="text-black font-poppins-medium text-sm">{item.kode_penyewaan}</Text>
          </View>
          <View>
            <Text className="text-gray-500 font-poppins-regular text-[13px]">Total:</Text>
            <Text className="text-black font-poppins-medium text-sm">
              {formatRupiah(item.total_biaya)}
            </Text>
          </View>
          <View style={{ top: -30 }} className={`px-4 py-2 rounded-full ${statusStyle.container}`}>
            <Text className={`font-poppins-medium text-sm ${statusStyle.text}`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        </TouchableOpacity>
    );
  };

  const EmptyStateComponent = () => (
    <View className="flex-1 justify-center items-center pt-56">
      <View className="items-center mb-4">
        <Image
          source={require('../../../assets/image/question-vector.png')}
          style={{ width: 200, height: 200}}
          resizeMode="contain"
        />
      </View>
      <Text className="font-poppins-regular text-gray-400 text-center px-4" >
        Tidak Ada Data Rental
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient colors={['#0255d6', '#0372f5']} className="h-24 relative">
        <View className="absolute bottom-[-30px] left-0 right-0 h-16 bg-gray-50 rounded-t-3xl" />
      </LinearGradient>
      <View className="flex-1 mt-[-20px]">
        <Text className="font-poppins-medium text-lg text-gray-800 my-3 mx-5">
          Riwayat Rental
        </Text>

        <View className="flex-row mb-3 px-5">
          {[
            { label: 'Semua', value: '-' },
            { label: 'Aktif', value: 'aktif' },
            { label: 'Pending', value: 'pending' },
            { label: 'Selesai', value: 'selesai' }
          ].map((status) => (
            <TouchableOpacity
              key={status.value}
              className={`rounded-full px-4 py-2 mr-2 shadow-sm`}
              style={{
                backgroundColor: filterStatus === status.value ? '#4C8BF5' : '#fff'
              }}
              onPress={() => setFilterStatus(status.value)}
            >
              <Text 
                className={`font-poppins-regular text-sm ${
                  filterStatus === status.value ? 'text-white' : 'text-blue-600'
                }`}
              >
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading ? (
          <MyRentSkeletonLoader />
        ) : (
          <FlatList
            data={rentalHistory}
            renderItem={renderItem}
            keyExtractor={(item) => item.uuid}
            contentContainerStyle={{ 
              paddingTop: 20, 
              paddingBottom: 100 // Increased bottom padding to prevent tab bar overlap
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyStateComponent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#0255d6']}
                tintColor="#0255d6"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyRent;