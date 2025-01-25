import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';

const RentalTracking = ({ route, navigation }) => {
    const { item } = route.params;

    const trackingStages = [
        { 
            label: 'Pesanan Dibuat', 
            icon: 'document-text', 
            color: 'bg-blue-500',
            timestamp: item.tanggal_mulai,
            completed: true
        },
        { 
            label: 'Pembayaran', 
            icon: 'card', 
            color: 'bg-green-500',
            timestamp: item.tanggal_mulai,
            completed: true
        },
        { 
            label: 'Konfirmasi Penyewaan', 
            icon: 'checkmark-circle', 
            color: 'bg-purple-500',
            timestamp: item.tanggal_mulai,
            completed: true
        },
        { 
            label: 'Mobil Siap Diambil', 
            icon: 'car', 
            color: 'bg-orange-500',
            timestamp: item.tanggal_mulai,
            completed: item.status !== 'Menunggu'
        },
        { 
            label: 'Penyewaan Selesai', 
            icon: 'flag', 
            color: 'bg-red-500',
            timestamp: item.tanggal_selesai,
            completed: item.status === 'Selesai'
        }
    ];

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    }; 

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white border-b border-gray-100 shadow-md">
                <View className="px-4 py-3 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 -ml-2"
                    >
                        <IonIcons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="font-poppins-medium text-[18px] text-gray-800 ml-2 top-0.5">
                        Tracking Penyewaan
                    </Text>
                </View>
            </View>

            <ScrollView className="mt-4 px-5">
                <View className="bg-white rounded-xl p-5 mb-4 shadow-md">
                    <Text className="font-poppins-semibold text-xl mb-4">
                        {item.mobil?.merk} - {item.kota?.nama}
                    </Text>

                    {/* Enhanced Tracking Stages */}
                    <View className="mb-4">
                        <Text className="font-poppins-medium text-gray-600 mb-3">Status Penyewaan</Text>
                        <View className="relative">
                            {trackingStages.map((stage, index) => (
                                <View key={stage.label} className="relative mb-4">
                                    {/* Vertical Connecting Line */}
                                    {index < trackingStages.length - 1 && (
                                        <View 
                                            className={`absolute left-5 top-12 bottom-[-16px] w-0.5 ${
                                                stage.completed ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                        />
                                    )}
                                    
                                    <View className="flex-row items-center">
                                        {/* Stage Icon */}
                                        <View className={`
                                            w-12 h-12 rounded-full items-center justify-center mr-4 
                                            ${stage.color} 
                                            ${stage.completed ? 'opacity-100' : 'opacity-50'}
                                        `}>
                                            <IonIcons 
                                                name={stage.icon} 
                                                size={24} 
                                                color="white" 
                                            />
                                        </View>
                                        
                                        {/* Stage Details */}
                                        <View className="flex-1">
                                            <Text className={`
                                                font-poppins-semibold text-base
                                                ${stage.completed ? 'text-black' : 'text-gray-400'}
                                            `}>
                                                {stage.label}
                                            </Text>
                                            {stage.completed && (
                                                <Text className="font-poppins-regular text-gray-600 text-sm">
                                                    {formatDateTime(stage.timestamp)}
                                                </Text>
                                            )}
                                        </View>
                                        
                                        {/* Status Icon */}
                                        {stage.completed ? (
                                            <IonIcons 
                                                name="checkmark-circle" 
                                                size={28} 
                                                color="#10B981" 
                                            />
                                        ) : (
                                            <IonIcons 
                                                name="time" 
                                                size={28} 
                                                color="#9CA3AF" 
                                            />
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Order Details */}
                    <View className="mb-4">
                        <Text className="font-poppins-medium text-gray-600 mb-2">Detail Pesanan</Text>
                        <View className="bg-blue-50 p-4 rounded-xl">
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-poppins-regular text-gray-700">Kode Penyewaan</Text>
                                <Text className="font-poppins-semibold text-black">{item.kode_penyewaan}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-poppins-regular text-gray-700">Total Biaya</Text>
                                <Text className="font-poppins-semibold text-black">{formatRupiah(item.total_biaya)}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="font-poppins-regular text-gray-700">Status</Text>
                                <Text className="font-poppins-semibold text-black">{item.status}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default RentalTracking;