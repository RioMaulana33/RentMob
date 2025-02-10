import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator, } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomDatePicker from '../../../components/CustomDatePicker';
import CustomTimePicker from '../../../components/CustomTImePicker';
import RentalOptionSection from '../../../components/RentalOptionSection';
import axios from '../../../libs/axios';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';

const RenderDeliveryMethod = ({ method, selected, onSelect }) => (
    <TouchableOpacity
        onPress={onSelect}
        className={`w-full mb-3 ${selected ? 'bg-blue-50' : 'bg-white'} 
            p-4 rounded-xl border-2 ${selected ? 'border-blue-500' : 'border-gray-200'}`}
    >
        <View className="flex-row items-center">
            <View className={`w-5 h-5 rounded-full border-2 mr-3 
                ${selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} 
                justify-center items-center`}>
                {selected && (
                    <MaterialIcon name="check" size={14} color="white" />
                )}
            </View>

            <View className={`w-10 h-10 rounded-full ${selected ? 'bg-blue-100' : 'bg-gray-100'} 
                justify-center items-center mr-3`}>
                <MaterialIcon
                    name={method.id === 1 ? "car" : "map-marker-radius"}
                    size={24}
                    color={selected ? "#0255d6" : "#6B7280"}
                />
            </View>

            <View className="flex-1">
                <Text className={`font-poppins-semibold ${selected ? 'text-blue-500' : 'text-gray-900'}`}>
                    {method.nama}
                </Text>
                <Text className="text-gray-500 text-sm font-poppins-regular mt-0.5">
                    {method.id === 1
                        ? "Ambil mobil di lokasi rental"
                        : "Mobil diantar ke lokasi Anda"}
                </Text>
                {method.id === 2 && (
                    <View className="flex-row items-center mt-2">
                        <Text className="text-gray-500 text-xs font-poppins-regular">
                            <Text className='text-red-500'>*</Text> Terdapat biaya tambahan
                        </Text>
                    </View>
                )}
            </View>
        </View>
    </TouchableOpacity>
);

const ValidationModal = ({ isVisible, onClose, errors }) => (
    <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        onSwipeComplete={onClose}
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
                paddingTop: 20,
                paddingHorizontal: 20,
                paddingBottom: Platform.OS === 'ios' ? 34 : 24,
            }}
        >
            {/* Drag Indicator */}
            <View className="items-center -mt-3 mb-4">
                <View className="w-12 h-1.5 rounded-full bg-gray-200" />
            </View>

            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-poppins-semibold text-gray-900">
                    Lengkapi Data
                </Text>
                <TouchableOpacity
                    onPress={onClose}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                    <MaterialIcon name="close" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Error List */}
            <View className="space-y-6">
                {Object.entries(errors).map(([key, value], index) => (
                    value && (
                        <View key={key} className="flex-row items-center p-4 ">
                            <MaterialIcon name="alert-circle-outline" size={20} color="#ef4444" />
                            <Text className="text-red-600 font-poppins-medium ml-3 flex-1">
                                {key === 'alamat_pengantaran' && 'Alamat pengantaran belum diisi'}
                                {key === 'delivery_id' && 'Metode pengantaran belum dipilih'}
                                {key === 'rental_option' && 'Opsi rental belum dipilih'}
                            </Text>
                        </View>
                    )
                ))}
            </View>

            {/* Action Button */}
            <TouchableOpacity
                onPress={onClose}
                className="mt-8"
            >
                <LinearGradient
                    colors={["#0255d6", "#0372f5"]}
                    className="py-4 rounded-2xl"
                    style={{ borderRadius: 10 }}
                >
                    <Text className="text-white font-poppins-semibold text-center text-base">
                        Mengerti
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    </Modal>
);

const RentalForm = ({ route, navigation }) => {
    const { carId, kotaId } = route.params;
    const [carDetails, setCarDetails] = useState(null);
    const [kotaDetails, setKotaDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deliveryMethods, setDeliveryMethods] = useState([]);
    const [showNoticeCard, setShowNoticeCard] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availabilityError, setAvailabilityError] = useState(null);
    const [showAvailabilityError, setShowAvailabilityError] = useState(false);

    // Date & Time picker states
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [formErrors, setFormErrors] = useState({
        alamat_pengantaran: false,
        delivery_id: false,
        rental_option: false
    });

    const [isValidationModalVisible, setIsValidationModalVisible] = useState(false);


    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            alamat_pengantaran: false,
            delivery_id: false,
            rental_option: false
        };

        // Validate delivery method
        if (!formData.delivery_id) {
            newErrors.delivery_id = true;
            isValid = false;
        }

        // Validate rental option
        if (!formData.rental_option) {
            newErrors.rental_option = true;
            isValid = false;
        }

        // Validate address if delivery service is selected
        if (formData.delivery_id === 2) {
            if (!formData.alamat_pengantaran || formData.alamat_pengantaran.trim() === '') {
                newErrors.alamat_pengantaran = true;
                isValid = false;
            }
        }

        setFormErrors(newErrors);

        // Show validation modal if there are errors
        if (!isValid) {
            setIsValidationModalVisible(true);
        }

        return isValid;
    };

    // Form state
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        no_hp: '',
        tanggal_mulai: new Date(),
        tanggal_selesai: (() => {
            const nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + 1);
            return nextDay;
        })(),
        jam_mulai: null,
        delivery_id: '',
        rental_option: '',
        total_biaya: 0,
        alamat_pengantaran: '',
        status: 'pending'
    });

    const ensureMinimumRentalPeriod = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate the difference in days
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If the difference is less than 1 day, set end date to start date + 1 day
        if (diffDays < 1) {
            const newEndDate = new Date(start);
            newEndDate.setDate(start.getDate() + 1);
            return newEndDate;
        }

        return end;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const carResponse = await axios.get(`/mobil/get/${carId}`);
                setCarDetails(carResponse.data.data);

                const kotaResponse = await axios.get('/kota/get');
                const selectedKota = kotaResponse.data.data.find(kota => kota.id === kotaId);
                setKotaDetails(selectedKota);

                const deliveryResponse = await axios.get('/delivery/get');
                setDeliveryMethods(deliveryResponse.data.data);

                // Calculate initial total cost
                const initialTotalCost = calculateTotalCost(
                    formData.tanggal_mulai,
                    formData.tanggal_selesai,
                    carResponse.data.data.tarif
                );

                setFormData(prev => ({
                    ...prev,
                    total_biaya: initialTotalCost,
                    kota_id: kotaId
                }));
            } catch (error) {
                Alert.alert("Error", "Gagal memuat data");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [carId, kotaId]);

    const calculateTotalCost = (startDate, endDate, dailyRate) => {
        // Ensure startDate and endDate are Date objects
        const start = startDate instanceof Date ? startDate : new Date(startDate);
        const end = endDate instanceof Date ? endDate : new Date(endDate);

        // Calculate days, ensuring at least 1 day
        const rentalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        return dailyRate * rentalDays;
    };


    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    const AvailabilityErrorModal = ({ isVisible, onClose }) => (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection={['down']}
            style={{ justifyContent: 'flex-end', margin: 0 }}
            animationInTiming={500}
            animationOutTiming={500}
        >
            <View className="bg-white rounded-t-3xl p-6">
                <View className="items-center -mt-3 mb-4">
                    <View className="w-12 h-1.5 rounded-full bg-gray-200" />
                </View>

                <View className="items-center mb-4">
                    <MaterialIcon name="car-off" size={48} color="#ef4444" />
                </View>

                <Text className="text-xl font-poppins-semibold text-center text-gray-900 mb-2">
                    Mobil Tidak Tersedia
                </Text>

                <Text className="text-gray-600 text-center mb-6 font-poppins-regular">
                    Maaf, mobil tidak tersedia untuk periode yang Anda pilih. Silakan pilih tanggal lain atau cari mobil lainnya.
                </Text>

                <TouchableOpacity
                    onPress={onClose}
                    className="w-full"
                >
                    <LinearGradient
                        colors={["#0255d6", "#0372f5"]}
                        className="py-4 rounded-2xl"
                        style={{ borderRadius: 10 }}
                    >
                        <Text className="text-white font-poppins-semibold text-center">
                            Mengerti
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </Modal>
    );

    const handleStartDateChange = (selectedDate) => {
        setShowStartDatePicker(false);

        setFormData(prev => {
            // Always ensure end date is at least one day after the new start date
            const updatedEndDate = ensureMinimumRentalPeriod(selectedDate, prev.tanggal_selesai);

            const updatedFormData = {
                ...prev,
                tanggal_mulai: selectedDate,
                tanggal_selesai: updatedEndDate,
                jam_mulai: null  // Reset jam_mulai whenever date changes
            };

            // Recalculate total cost
            updatedFormData.total_biaya = calculateTotalCost(
                updatedFormData.tanggal_mulai,
                updatedFormData.tanggal_selesai,
                carDetails?.tarif || 0
            );

            return updatedFormData;
        });
    };

    // Handle End Date Change
    const handleEndDateChange = (selectedDate) => {
        setShowEndDatePicker(false);

        setFormData(prev => {
            // Ensure the selected end date is at least one day after start date
            const updatedEndDate = ensureMinimumRentalPeriod(prev.tanggal_mulai, selectedDate);

            const updatedFormData = {
                ...prev,
                tanggal_selesai: updatedEndDate
            };

            // Recalculate total cost
            updatedFormData.total_biaya = calculateTotalCost(
                prev.tanggal_mulai,
                updatedEndDate,
                carDetails?.tarif || 0
            );

            return updatedFormData;
        });
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }

        setIsSubmitting(true);
        setAvailabilityError(null);

        try {
            // Create rental payload
            const rentalPayload = {
                mobil_id: carId,
                kota_id: kotaId,
                delivery_id: formData.delivery_id,
                tanggal_mulai: formData.tanggal_mulai.toISOString().split('T')[0],
                tanggal_selesai: formData.tanggal_selesai.toISOString().split('T')[0],
                jam_mulai: formData.jam_mulai.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                }) + ':00',
                rental_option: formData.rental_option,
                status: 'pending',
                total_biaya: formData.total_biaya,
                alamat_pengantaran: formData.alamat_pengantaran || ''
            };

            // Check availability without storing data
            const availabilityResponse = await axios.post('/penyewaan/check-stok', rentalPayload);

            if (!availabilityResponse.data.available) {
                setAvailabilityError(availabilityResponse.data.message);
                setShowAvailabilityError(true);
                setIsSubmitting(false);
                return;
            }

            // If available, proceed with payment
            const midtransResponse = await axios.post('/penyewaan/midtrans/get-token', rentalPayload);

            if (midtransResponse.data.status === 'success') {
                navigation.navigate('PaymentWebView', {
                    paymentUrl: midtransResponse.data.redirect_url,
                    orderId: midtransResponse.data.order_id,
                    rentalData: rentalPayload
                });
            } else {
                Alert.alert('Error', 'Gagal memproses pembayaran');
            }
        } catch (error) {
            console.error('Error in submission:', error);
            if (error.response?.data?.message?.includes('tidak tersedia')) {
                setAvailabilityError('Mobil tidak tersedia untuk periode ini');
                setShowAvailabilityError(true);
            } else {
                Alert.alert('Error', 'Terjadi kesalahan saat memproses pesanan');
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    const DeliveryMethodSection = () => (
        <View className="mb-3">
            <View className="space-y-2">
                {deliveryMethods.map((method) => (
                    <RenderDeliveryMethod
                        key={method.id}
                        method={method}
                        selected={formData.delivery_id === method.id}
                        onSelect={() => setFormData(prev => {
                            const deliveryCost = method.biaya || 0;
                            const rentalCost = calculateTotalCost(
                                prev.tanggal_mulai,
                                prev.tanggal_selesai,
                                carDetails?.tarif || 0
                            );

                            return {
                                ...prev,
                                delivery_id: method.id,
                                total_biaya: rentalCost + deliveryCost
                            };
                        })}
                    />
                ))}
            </View>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0255d6" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <LinearGradient
                colors={["#0255d6", "#0372f5"]}
                className="px-5 pt-4 pb-4"
            >
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4"
                    >
                        <Icon name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-lg font-poppins-semibold">Form Pesanan</Text>
                        <View className="flex-row items-center mt-0.5">
                            <Text className="text-white/80 font-poppins-medium text-sm ">
                                {carDetails?.merk} {carDetails?.model}
                            </Text>
                            <Text className="text-white/80 font-poppins-medium text-sm ml-1">-</Text>
                            <Text className="text-white/80 font-poppins-medium text-sm ml-1">
                                {kotaDetails?.nama}
                            </Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                className="flex-1 px-5 pt-5"
                contentContainerStyle={{ paddingBottom: 140 }}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
            >
                {/* Car Info Card */}
                <View
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 24,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                    }}
                >
                    {/* Car info content */}
                    <View className="flex-row">
                        <FastImage
                            source={{
                                uri: carDetails?.foto
                                    ? `${process.env.APP_URL}/storage/${carDetails.foto}`
                                    : "https://via.placeholder.com",
                                priority: FastImage.priority.normal
                            }}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 8,
                                backgroundColor: '#e5e5e5'
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <View className="ml-4 flex-1">
                            <Text className="text-black text-lg font-poppins-semibold">
                                {carDetails?.merk} {carDetails?.model}
                            </Text>
                            <Text className="text-gray-500 font-poppins-regular">
                                {kotaDetails?.nama}
                            </Text>
                            <Text className="text-blue-500 font-poppins-regular">
                                {formatRupiah(carDetails?.tarif)}/hari
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Date Range Picker */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-poppins-medium mb-2">Periode Rental</Text>
                    <View className="flex-row space-x-5">
                        {/* Start Date */}
                        <TouchableOpacity
                            onPress={() => setShowStartDatePicker(true)}
                            className="flex-1 bg-white px-4 py-3.5 rounded-xl border border-gray-200"
                        >
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-xs text-gray-500 font-poppins-regular mb-1">Mulai</Text>
                                    <Text className="text-gray-800 font-poppins-medium">
                                        {formData.tanggal_mulai.toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </Text>
                                </View>
                                <MaterialIcon name="calendar" size={20} color="#0255d6" />
                            </View>
                        </TouchableOpacity>

                        {/* End Date */}
                        <TouchableOpacity
                            onPress={() => setShowEndDatePicker(true)}
                            className="flex-1 bg-white px-4 py-3.5 rounded-xl border border-gray-200 ml-2"
                        >
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-xs text-gray-500 font-poppins-regular mb-1">Selesai</Text>
                                    <Text className="text-gray-800 font-poppins-medium">
                                        {formData.tanggal_selesai.toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </Text>
                                </View>
                                <MaterialIcon name="calendar" size={20} color="#0255d6" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Time Picker */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-poppins-medium mb-2">Jam Mulai</Text>
                    <TouchableOpacity
                        onPress={() => setShowTimePicker(true)}
                        className="bg-white px-4 py-3.5 rounded-xl border border-gray-200"
                    >
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="text-xs text-gray-500 font-poppins-regular mb-1">Waktu</Text>
                                <Text className="text-gray-800 font-poppins-medium">
                                    {formData.jam_mulai
                                        ? formData.jam_mulai.toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        })
                                        : '--:--'
                                    }
                                </Text>
                            </View>
                            <MaterialIcon name="clock-outline" size={20} color="#0255d6" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Delivery Method */}
                <DeliveryMethodSection />

                {/* Rental Option */}
                <RentalOptionSection
                    formData={formData}
                    setFormData={setFormData}
                />

                {/* Alamat Pengantaran */}
                {formData.delivery_id === 2 && (
                    <View className="mt-6">
                        <Text className="text-gray-700 font-poppins-medium mb-2">
                            Alamat Pengantaran <Text className="text-red-500">*</Text>
                        </Text>
                        <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <TextInput
                                className={`px-4 py-4 text-gray-800 font-poppins-regular ${formErrors.alamat_pengantaran ? 'border-2 border-red-500' : 'border border-gray-200'
                                    }`}
                                placeholder="Masukkan alamat lengkap pengantaran..."
                                placeholderTextColor="#64748b"
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={formData.alamat_pengantaran}
                                onChangeText={(text) => {
                                    setFormData(prev => ({ ...prev, alamat_pengantaran: text }));
                                    if (formErrors.alamat_pengantaran) {
                                        setFormErrors(prev => ({ ...prev, alamat_pengantaran: false }));
                                    }
                                }}
                                style={{
                                    minHeight: 100,
                                    maxHeight: 150,
                                    borderRadius: 10
                                }}
                                keyboardDismissMode="none"
                                keyboardShouldPersistTaps="handled"
                            />
                            <View className="px-4 py-2 bg-blue-50 flex-row items-center">
                                <MaterialIcon name="information-outline" size={18} color="#0255d6" />
                                <Text className="text-blue-600 font-poppins-regular text-xs ml-2 flex-1">
                                    Pastikan alamat akurat untuk memudahkan pengantaran
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* No Cancellation Notice */}
                {showNoticeCard && (
                    <View className="mb-6 mt-4">
                        <View className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                            {/* Header with close button */}
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-row items-center">
                                    <MaterialIcon name="alert-circle-outline" size={24} color="#f97316" />
                                    <Text className="text-orange-700 font-poppins-semibold text-base ml-2">
                                        Perhatian Penting
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setShowNoticeCard(false)}
                                    className="p-1"
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <MaterialIcon name="close" size={20} color="#f97316" />
                                </TouchableOpacity>
                            </View>

                            {/* Notice Content */}
                            <View className="ml-1">
                                <Text className="text-orange-700 font-poppins-regular text-sm leading-5">
                                    Pesanan yang sudah dibuat tidak dapat dibatalkan atau di-refund.
                                </Text>

                                {/* Checklist Section */}
                                <View className="mt-3 space-y-2">
                                    {[
                                        'Tanggal dan waktu pengambilan sesuai',
                                        'Metode sudah dipilih',
                                        'Alamat pengantaran lengkap dan akurat (Jika memilih layanan jemput)'
                                    ].map((item, index) => (
                                        <View key={index} className="flex-row items-center">
                                            <MaterialIcon name="check-circle" size={16} color="#f97316" />
                                            <Text className="text-orange-700 font-poppins-regular text-sm ml-2">
                                                {item}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Bottom Message */}
                                <View className="mt-3 pt-3 border-t border-orange-200">
                                    <Text className="text-orange-700 font-poppins-medium text-sm">
                                        Pastikan Anda telah mengisi semua data dengan benar dan yakin dengan periode sewa yang dipilih.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

            </ScrollView >
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    paddingHorizontal: 20,
                    paddingTop: 16,
                    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -4,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 8,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                }}
            >
                <View className="flex-row items-center justify-between mb-4">
                    <View>
                        <Text className="text-gray-500 font-poppins-medium text-sm mb-1">
                            Total Biaya
                        </Text>
                        <Text className="text-2xl font-poppins-semibold text-gray-900">
                            {formatRupiah(formData.total_biaya)}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        className={`${isSubmitting ? 'bg-blue-300' : 'bg-blue-500'} rounded-full py-3.5 px-8`}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-poppins-semibold text-base">
                                Sewa Mobil
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Additional Info */}
                <View className="flex-row items-center">
                    <MaterialIcon name="information-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-500 font-poppins-regular text-xs ml-1">
                        Harga sudah termasuk pajak dan biaya layanan
                    </Text>
                </View>
            </View>

            {/* Date & Time Pickers */}
            <CustomDatePicker
                visible={showStartDatePicker}
                value={formData.tanggal_mulai}
                onChange={handleStartDateChange}
                onClose={() => setShowStartDatePicker(false)}
                minimumDate={new Date()}
            />

            <CustomDatePicker
                visible={showEndDatePicker}
                value={formData.tanggal_selesai}
                onChange={handleEndDateChange}
                onClose={() => setShowEndDatePicker(false)}
                minimumDate={new Date(formData.tanggal_mulai.getTime() + 24 * 60 * 60 * 1000)} // Set minimum to next day after start date
            />

            <CustomTimePicker
                visible={showTimePicker}
                value={formData.jam_mulai}
                onChange={(time) => {
                    setFormData(prev => ({
                        ...prev,
                        jam_mulai: time
                    }));
                    setShowTimePicker(false);
                }}
                onClose={() => setShowTimePicker(false)}
                is24Hour={true}
                minuteInterval={30}
                selectedDate={formData.tanggal_mulai} // Pass the selected start date
            />

            <ValidationModal
                isVisible={isValidationModalVisible}
                onClose={() => setIsValidationModalVisible(false)}
                errors={formErrors}
            />

            <AvailabilityErrorModal
                isVisible={showAvailabilityError}
                onClose={() => setShowAvailabilityError(false)}
            />
        </View >
    );
};

export default RentalForm;