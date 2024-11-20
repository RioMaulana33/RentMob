import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { tw } from 'nativewind';

const MyRent = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const rentalHistory = [
    { id: '1', title: 'Rental Mobil Toyota Avanza', date: '12 Jan 2023', duration: '3 Hari', price: 'Rp 500.000', status: 'Selesai' },
    { id: '2', title: 'Rental Motor Honda Civic', date: '20 Feb 2023', duration: '1 Hari', price: 'Rp 100.000', status: 'Selesai' },
    { id: '3', title: 'Rental Mobil Suzuki Ertiga', date: '25 Mar 2023', duration: '2 Hari', price: 'Rp 400.000', status: 'Dalam Proses' },
  ];

  const filterHistory = () => {
    switch (filterStatus) {
      case 'all':
        return rentalHistory;
      case 'completed':
        return rentalHistory.filter(order => order.status === 'Selesai');
      case 'inProgress':
        return rentalHistory.filter(order => order.status === 'Dalam Proses');
      default:
        return rentalHistory;
    }
  };

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 my-2 shadow-md border border-gray-200">
      <View className="flex-row justify-between items-center mb-2">
        <View>
          <Text className="font-poppins-semibold text-lg text-gray-800">{item.title}</Text>
          <View className ="border-b border-gray-200 my-3 "/>
          <View className="flex-row items-center">
            <IonIcons name="calendar-outline" size={16} color="#6B7280" />
            <Text className="font-poppins-regular text-sm text-gray-600 ml-2">{item.date}</Text>
          </View>
        </View>
       
      </View>
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="font-poppins-regular text-sm text-gray-600">Durasi:</Text>
          <Text className="font-poppins-medium text-base text-gray-800">{item.duration}</Text>
        </View>
        <View>
          <Text className="font-poppins-regular text-sm text-gray-600">Harga:</Text>
          <Text className="font-poppins-medium text-base text-gray-800">{item.price}</Text>
        </View>
        <View style={{ top: -30 }}className={`px-4 py-2 rounded-full ${item.status === 'Selesai' ? 'bg-blue-100' : 'bg-orange-100'}`}>
          <Text className={`font-poppins-medium text-sm ${item.status === 'Selesai' ? 'text-blue-500' : 'text-orange-500'}`}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-blue-600 h-24 relative">
        <View className="absolute bottom-[-30px] left-0 right-0 h-16 bg-gray-100 rounded-t-3xl" />
      </View>
      <View className="flex-1 px-4 mt-[-20px]">
        <Text className="font-poppins-medium text-lg text-gray-800 my-3">Riwayat Rental</Text>

        <View className="flex-row mb-3">
          <TouchableOpacity
            className={`bg-${filterStatus === 'all' ? 'blue-600' : 'white'} rounded-full px-4 py-2 mr-2 shadow-md`}
            style={{
              backgroundColor: filterStatus === 'all' ? '#4C8BF5' : '#fff',
              color: filterStatus === 'all' ? '#fff' : '#4C8BF5'
            }}
            onPress={() => setFilterStatus('all')}
          >
            <Text className={`font-poppins-regular text-sm ${filterStatus === 'all' ? 'text-white' : 'text-blue-600'}`}>Semua</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`bg-${filterStatus === 'completed' ? 'blue-600' : 'white'} rounded-full px-4 py-2 mr-2 shadow-md`}
            style={{
              backgroundColor: filterStatus === 'completed' ? '#4C8BF5' : '#fff',
              color: filterStatus === 'completed' ? '#fff' : '#4C8BF5'
            }}
            onPress={() => setFilterStatus('completed')}
          >
            <Text className={`font-poppins-regular text-sm ${filterStatus === 'completed' ? 'text-white' : 'text-blue-600'}`}>Selesai</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`bg-${filterStatus === 'inProgress' ? 'blue-600' : 'white'} rounded-full px-4 py-2 mr-2 shadow-md`}
            style={{
              backgroundColor: filterStatus === 'inProgress' ? '#4C8BF5' : '#fff',
              color: filterStatus === 'inProgress' ? '#fff' : '#4C8BF5'
            }}
            onPress={() => setFilterStatus('inProgress')}
          >
            <Text className={`font-poppins-regular text-sm ${filterStatus === 'inProgress' ? 'text-white' : 'text-blue-600'}`}>Dalam Proses</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filterHistory()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default MyRent;