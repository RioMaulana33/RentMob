import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from '../libs/axios';

const RentalOptionModal = ({ visible, onClose, onSelect, selectedOption }) => (
    <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
    >
        <View className="flex-1 justify-end">
            <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
                <Text className="text-xl font-poppins-semibold text-gray-800 mb-4">
                    Persyaratan Izin Mengemudi
                </Text>
                <View className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
                    <View className="flex-row items-start mb-3">
                        <MaterialIcon name="alert-circle-outline" size={24} color="#0255d6" />
                        <Text className="text-blue-700 font-poppins-regular ml-2 flex-1">
                            Untuk opsi Lepas Kunci, Anda WAJIB memiliki Surat Izin Mengemudi (SIM) A yang masih berlaku.
                        </Text>
                    </View>
                    <View className="space-y-2">
                        {[
                            'Dokumen SIM asli harus dibawa saat pengambilan mobil',
                            'SIM tidak dalam masa skorsing/pencabutan',
                            'Fotocopy SIM akan diminta saat pengambilan mobil'
                        ].map((item, index) => (
                            <View key={index} className="flex-row items-center">
                                <MaterialIcon name="check-circle" size={16} color="#0255d6" />
                                <Text className="text-blue-700 font-poppins-regular ml-2">
                                    {item}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => onSelect(selectedOption)}
                    className="bg-blue-500 rounded-full py-4 items-center"
                >
                    <Text className="text-white font-poppins-semibold text-base">
                        Saya Mengerti dan Memenuhi Syarat
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onClose}
                    className="mt-3 py-3 items-center"
                >
                    <Text className="text-gray-600 font-poppins-medium">
                        Batalkan
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

const RentalOptionSection = ({ formData, setFormData, rentalOptions, calculateTotalCost, carDetails }) => {
    const [showLepasKunciModal, setShowLepasKunciModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);

    // Calculate rental duration in days
    const calculateRentalDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Calculate daily cost for rental option
    const calculateDailyOptionCost = (option) => {
        const rentalDays = calculateRentalDays(formData.tanggal_mulai, formData.tanggal_selesai);
        return option.biaya * rentalDays;
    };

    useEffect(() => {
        const fetchRentalOptions = async () => {
            try {
                const response = await axios.get('/rentaloption/get');
                const optionsWithIcons = response.data.data.map(option => ({
                    ...option,
                    icon: option.nama.toLowerCase().includes('supir') ? 'account-tie' : 'key-variant',
                    color: option.nama.toLowerCase().includes('supir') ? 'bg-green-500' : 'bg-blue-500'
                }));
            } catch (error) {
                console.error('Error fetching rental options:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRentalOptions();
    }, []);

    const handleRentalOptionSelect = (option) => {
        if (option.nama.toLowerCase().includes('lepas kunci')) {
            setSelectedOption(option);
            setShowLepasKunciModal(true);
        } else {
            const newTotalCost = calculateTotalCost(
                formData.tanggal_mulai,
                formData.tanggal_selesai,
                carDetails?.tarif || 0,
                option.id,
                formData.delivery_id
            );

            setFormData(prev => ({
                ...prev,
                rentaloptions_id: option.id,
                total_biaya: newTotalCost
            }));
        }
    };

    if (!rentalOptions.length) {
        return (
            <View className="items-center justify-center py-4">
                <ActivityIndicator size="small" color="#0255d6" />
            </View>
        );
    }

    return (
        <View>
            <Text className="text-gray-700 font-poppins-medium mb-2">
                Pilih Opsi Rental
            </Text>
            <View className="flex-row gap-4 justify-between">
                {rentalOptions.map((option) => {
                    const dailyOptionCost = calculateDailyOptionCost(option);
                    const rentalDays = calculateRentalDays(formData.tanggal_mulai, formData.tanggal_selesai);

                    return (
                        <TouchableOpacity
                            key={option.id}
                            onPress={() => handleRentalOptionSelect(option)}
                            className={`flex-1 p-4 rounded-xl border ${formData.rentaloptions_id === option.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white'
                                }`}
                        >
                            <View className="items-center">
                                <View className={`w-16 h-16 ${option.color} rounded-full items-center justify-center mb-3`}>
                                    <MaterialIcon
                                        name={option.icon}
                                        size={32}
                                        color="white"
                                    />
                                </View>
                                <Text className={`font-poppins-semibold text-base mb-1 ${formData.rental_option === option.id
                                    ? 'text-blue-600'
                                    : 'text-gray-800'
                                    }`}>
                                    {option.nama}
                                </Text>
                                <Text className="text-gray-500 text-center font-poppins-regular text-xs">
                                    {option.deskripsi}
                                </Text>
                                <Text className="text-blue-500 font-poppins-medium text-sm mt-2">
                                    +Rp {option.biaya.toLocaleString('id-ID')}/hari
                                </Text>
                                <Text className="text-gray-500 font-poppins-regular text-xs mt-1">
                                    Total {rentalDays} hari: Rp {dailyOptionCost.toLocaleString('id-ID')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <RentalOptionModal
                visible={showLepasKunciModal}
                onClose={() => setShowLepasKunciModal(false)}
                selectedOption={selectedOption}
                onSelect={(option) => {
                    const newTotalCost = calculateTotalCost(
                        formData.tanggal_mulai,
                        formData.tanggal_selesai,
                        carDetails?.tarif || 0,
                        option.id,
                        formData.delivery_id
                    );

                    setFormData(prev => ({
                        ...prev,
                        rentaloptions_id: option.id,
                        total_biaya: newTotalCost
                    }));
                    setShowLepasKunciModal(false);
                }}
            />
        </View>
    );
};

export default RentalOptionSection;