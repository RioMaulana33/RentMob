import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';

const RentalTracking = ({ route, navigation }) => {
    const { item } = route.params;

    const formatDetailedDateTime = (dateString, timeString) => {
        if (!dateString || !timeString) return '-';

        const date = new Date(`${dateString}T${timeString}`);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const trackingStages = [
        {
            label: 'Rental Aktif',
            icon: 'checkmark-circle',
            color: item.status !== 'pending' ? 'bg-blue-100' : 'bg-gray-100',
            iconColor: '#0255d6',
            timestamp: formatDetailedDateTime(item.tanggal_mulai, item.jam_mulai),
            completed: item.status !== 'pending'
        },
        {
            label: 'Pengembalian Mobil',
            icon: 'car',
            color: item.status === 'selesai' ? 'bg-blue-100' : 'bg-gray-100',
            iconColor: '#0255d6',
            timestamp: formatDetailedDateTime(item.tanggal_selesai, item.jam_mulai),
            completed: item.status === 'selesai'
        },
        {
            label: 'Penyewaan Selesai',
            icon: 'flag',
            color: item.status === 'selesai' ? 'bg-blue-100' : 'bg-gray-100',
            iconColor: '#0255d6',
            timestamp: null,
            completed: item.status === 'selesai'
        }
    ];

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    const getDeliveryMethodName = (deliveryId) => {
        switch (deliveryId) {
            case 1:
                return "Ambil Sendiri";
            case 2:
                return "Layanan Jemput";
            default:
                return "Metode Tidak Diketahui";
        }
    };

    const getLottieViewProps = (status) => {
        return status === 'selesai'
            ? {
                autoPlay: true,
                loop: false
            }
            : {
                autoPlay: true,
                loop: true
            };
    }

    const getLottieAnimation = (status) => {
        switch (status) {
            case 'pending':
                return require('../../../assets/lottie/pending-animation.json');
            case 'aktif':
                return require('../../../assets/lottie/active-animation.json');
            case 'selesai':
                return require('../../../assets/lottie/done-animation.json');
            default:
                return require('../../../assets/lottie/pending-animation.json');
        }
    };

    const getStatusDescription = (status) => {
        switch (status) {
            case 'pending':
                return 'Menyiapkan Mobil Yang Anda Sewa';
            case 'aktif':
                return 'Penyewaan Sedang Berjalan';
            case 'selesai':
                return 'Penyewaan Telah Selesai';
            default:
                return 'Status Tidak Diketahui';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'text-gray-600';
            case 'aktif':
                return 'text-blue-600';
            case 'selesai':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const renderNote = () => {
        if (item.status !== 'pending') return null;

        return (
            <View className="mb-4">
                <Text className="font-poppins-medium text-gray-600 mb-2">Catatan Penting</Text>
                <View className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                    <View className="flex-row items-start mb-2">
                        <IonIcons name="alert-circle-outline" size={20} color="#f97316" />
                        <Text className="font-poppins-medium text-orange-700 ml-2 flex-1">
                            {item.delivery_id === 1 
                                ? "Pastikan tiba di tempat rental tepat waktu!"
                                : "Pastikan Anda siap di lokasi tepat waktu!"
                            }
                        </Text>
                    </View>
                    <Text className="font-poppins-regular text-orange-700 text-sm ml-7">
                        {item.delivery_id === 1 
                            ? "Waktu rental akan mulai terhitung sesuai dengan jam mulai yang Anda pilih. Keterlambatan tidak akan mengubah waktu selesai rental yang telah ditentukan."
                            : "Driver kami akan tiba di lokasi sebelum jam mulai yang Anda pilih."
                        }
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"
            />

            <View className="bg-white border-b border-gray-100 shadow-md">
                <View className="px-4 py-3 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 -ml-2"
                    >
                        <IonIcons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="font-poppins-medium text-[18px] text-gray-800 ml-2 top-0.5">
                        Detail Penyewaan
                    </Text>
                </View>
            </View>

            <ScrollView className="mt-4 px-5">
                <View className="bg-white rounded-xl p-5 mb-4 shadow-md">
                    <Text className="font-poppins-semibold text-xl mb-4 text-black">
                        {item.mobil?.merk} - {item.kota?.nama}
                    </Text>

                    <View className="items-center mb-4 px-2">
                        <LottieView
                            source={getLottieAnimation(item.status)}
                            {...getLottieViewProps(item.status)}
                            style={{ width: 250, height: 250 }}
                        />
                        <Text className={`font-poppins-semibold text-base mt-3 ${getStatusColor(item.status)}`}>
                            {getStatusDescription(item.status)}
                        </Text>
                    </View>

                    <View className="border-b border-gray-200 mb-4 " /> 

                    <View className="mb-4">
                        <Text className="font-poppins-medium text-gray-600 mb-3">Tracking Penyewaan</Text>
                        <View className="relative">
                            {trackingStages.map((stage, index) => (
                                <View key={stage.label} className="relative mb-8">
                                    {index < trackingStages.length - 1 && (
                                        <View
                                            className={`absolute left-5 top-[40px] bottom-[-30px] w-1 ${stage.completed ? 'bg-blue-100' : 'bg-gray-300'
                                                }`}
                                        />
                                    )}

                                    <View className="flex-row items-center">
                                        <View className={`
                                            w-12 h-12 rounded-full items-center justify-center mr-4 
                                            ${stage.color} 
                                            ${stage.completed ? 'opacity-100' : 'opacity-50'}
                                        `}>
                                            <IonIcons
                                                name={stage.icon}
                                                size={22}
                                                color={stage.iconColor}
                                            />
                                        </View>

                                        <View className="flex-1">
                                            <Text className={`
                                                font-poppins-semibold text-base
                                                ${stage.completed ? 'text-black' : 'text-gray-400'}
                                            `}>
                                                {stage.label}
                                            </Text>
                                            {stage.timestamp && (
                                                <Text className="font-poppins-regular text-gray-600 text-sm">
                                                    {stage.timestamp}
                                                </Text>
                                            )}
                                        </View>

                                        {stage.completed ? (
                                            <IonIcons
                                                name="checkmark-circle"
                                                size={20}
                                                color="#10B981"
                                            />
                                        ) : (
                                            <IonIcons
                                                name="time"
                                                size={20}
                                                color="#9CA3AF"
                                            />
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

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
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-poppins-regular text-gray-700">Status</Text>
                                <Text className="font-poppins-semibold text-black">{item.status}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="font-poppins-regular text-gray-700">Metode</Text>
                                <Text className="font-poppins-semibold text-black">{getDeliveryMethodName(item.delivery_id)}</Text>
                            </View>
                            {item.delivery_id === 2 && item.alamat_pengantaran && (
                                <View className="mt-2 pt-2 border-t border-blue-200">
                                    <Text className="font-poppins-regular text-gray-700 mb-1">Alamat Pengantaran :</Text>
                                    <Text className="font-poppins-medium text-black text-base">{item.alamat_pengantaran}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {renderNote()}
                </View>
            </ScrollView>
        </View>
    );
};

export default RentalTracking;