import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import axios from '../../../libs/axios';
import AllCarLoader from '../../../components/AllCarLoader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import WishlistButton from '../../../components/WishlistButton';
import LinearGradient from 'react-native-linear-gradient';
import { useUser } from '../../../services/UseUser';

const { height } = Dimensions.get('window');

const AllCars = ({ route, navigation }) => {
    const { data: user } = useUser();
    const { kotaId, kotaName, initialCars } = route.params;
    const [cars, setCars] = useState(initialCars || []);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCarDetailsModalVisible, setIsCarDetailsModalVisible] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [filters, setFilters] = useState({
        priceRange: 'all',
        fuelType: 'all',
        carType: 'all',
        capacity: 'all'
    });

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
            const response = await axios.get(`/mobil/getkota/${kotaId}`, {
                params: {
                    search: searchQuery,
                    ...filters
                }
            });
            setCars(response.data.data);
        } catch (error) {
            console.error("Error fetching cars:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Add useEffect to refetch when filters change
    useEffect(() => {
        fetchCars();
    }, [searchQuery, filters, kotaId]);


    const filteredCars = cars.filter(car =>
        car.mobil.merk.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.mobil.model.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters);
        // Apply the filters to your cars data here
        const filtered = cars.filter(car => {
            if (newFilters.priceRange !== 'all') {
                const price = car.mobil.tarif;
                if (newFilters.priceRange === 'under200' && price >= 200000) return false;
                if (newFilters.priceRange === '200to500' && (price < 200000 || price > 500000)) return false;
                if (newFilters.priceRange === 'above500' && price <= 500000) return false;
            }

            if (newFilters.fuelType !== 'all' && car.mobil.bahan_bakar.toLowerCase() !== newFilters.fuelType) return false;
            if (newFilters.carType !== 'all' && car.mobil.type.toLowerCase() !== newFilters.carType) return false;
            if (newFilters.capacity !== 'all' && car.mobil.kapasitas.toString() !== newFilters.capacity) return false;

            return true;
        });

        setCars(filtered);
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

    const renderCarItem = ({ item }) => (
        <TouchableOpacity
            className="flex-row bg-white rounded-xl p-4 mx-5 mb-4 shadow-md"
            onPress={() => handleOpenCarDetail(item)}
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
            <LinearGradient
                colors={["#0255d6", "#0372f5"]}>
                <View className="px-4 py-3 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 -ml-2"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="font-poppins-medium text-[18px] text-white ml-2 top-0.5">
                        Mobil Tersedia di {kotaName}
                    </Text>
                </View>
            </LinearGradient>

            <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFilterApply={handleFilterApply}
            />

            {isLoading ? (
                <AllCarLoader /> // Replace ActivityIndicator with CarLoader
            ) : (
                <FlatList
                    data={filteredCars}
                    renderItem={renderCarItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
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
                <View
                    style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        height: height * 0.85,
                    }}
                >
                    {selectedCar ? (
                        <>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 100 }}
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
                                        <Ionicons name="close" size={24} color="#0255d6" />
                                    </TouchableOpacity>

                                    <WishlistButton
                                        carId={selectedCar.mobil.id}
                                        kotaId={selectedCar.kota.id}
                                        userId={user.id}
                                        onWishlistChange={(isInWishlist) => {
                                        }}
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
                        </>
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-gray-500 font-poppins-medium">Loading...</Text>
                        </View>
                    )}
                </View>
            </Modal>
        </View>
    );
};

export default AllCars;