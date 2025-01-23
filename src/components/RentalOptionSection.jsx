import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const RentalOptionModal = ({ visible, onClose, onSelect }) => (
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
                    onPress={() => onSelect('Lepas Kunci')}
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

const RentalOptionSection = ({ formData, setFormData }) => {
    const [showLepasKunciModal, setShowLepasKunciModal] = useState(false);

    const handleRentalOptionSelect = (option) => {
        if (option === 'Lepas Kunci') {
            setShowLepasKunciModal(true);
        } else {
            setFormData(prev => ({ ...prev, rental_option: option }));
        }
    };

    const rentalOptions = [
        {
            id: 'Dengan Supir',
            label: 'Dengan Supir',
            icon: 'account-tie',
            description: 'Mobil dikendarai oleh sopir profesional',
            color: 'bg-green-500'
        },
        {
            id: 'Lepas Kunci',
            label: 'Lepas Kunci',
            icon: 'key-variant',
            description: 'Anda mengemudi sendiri (butuh SIM)',
            color: 'bg-blue-500'
        }
    ];

    return (
        <View>
            <View className="flex-row gap-4 justify-between">
                {rentalOptions.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        onPress={() => handleRentalOptionSelect(option.id)}
                        className={`flex-1 p-4 rounded-xl border ${
                            formData.rental_option === option.id
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
                            <Text className={`font-poppins-semibold text-base mb-1 ${
                                formData.rental_option === option.id 
                                    ? 'text-blue-600' 
                                    : 'text-gray-800'
                            }`}>
                                {option.label}
                            </Text>
                            <Text className="text-gray-500 text-center font-poppins-regular text-xs">
                                {option.description}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <RentalOptionModal 
                visible={showLepasKunciModal}
                onClose={() => setShowLepasKunciModal(false)}
                onSelect={(option) => {
                    setFormData(prev => ({ ...prev, rental_option: option }));
                    setShowLepasKunciModal(false);
                }}
            />
        </View>
    );
};

export default RentalOptionSection;