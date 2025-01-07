import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from '../../../libs/axios';

const AllCars = ({ route, navigation }) => {
    const { kotaId, kotaName, initialCars } = route.params;
    const [cars, setCars] = useState(initialCars || []);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    useEffect(() => {
        if (!initialCars) {
            fetchCars();
        }
    }, [kotaId]);

    const fetchCars = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/mobil/getkota/${kotaId}`);
            setCars(response.data.data);
        } catch (error) {
            console.error("Error fetching cars:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderCarItem = ({ item }) => (
        <TouchableOpacity
            className="flex-row bg-white rounded-xl p-4 mx-5 mb-4 shadow-md"
            onPress={() => navigation.navigate('CarDetails', { car: item })}
        >
            <FastImage
                source={{
                    uri: item.mobil.foto
                        ? `${process.env.APP_URL}/storage/${item.mobil.foto}`
                        : "https://via.placeholder.com",
                    priority: FastImage.priority.normal
                }}
                style={{
                    width: 96,
                    height: 96,
                    borderRadius: 8,
                    backgroundColor: '#e5e5e5'
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
            <View className="ml-4 flex-1 my-2.5">
                <Text className="text-black text-lg font-poppins-semibold">
                    {item.mobil.merk} {item.mobil.model}
                </Text>
                <Text className="text-gray-500 font-poppins-regular">
                    {item.kota.nama}
                </Text>
                <Text className="text-blue-500 font-poppins-regular">
                    {formatRupiah(item.mobil.tarif)}/hari
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <View className="bg-white border-b border-gray-100"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 2,
                    elevation: 3,
                }}
            >
                <View className="px-4 py-3 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 -ml-2"
                    >
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="font-poppins-medium text-[18px] text-gray-800 ml-2 top-0.5">
                        Mobil Tersedia di {kotaName}
                    </Text>
                </View>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#0255d6" className="mt-4" />
            ) : (
                <FlatList
                    data={cars}
                    renderItem={renderCarItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default AllCars;