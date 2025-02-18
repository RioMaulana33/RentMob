import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';

const PaymentSuccess = ({ route, navigation }) => {
    const fadeIn = new Animated.Value(0);
    const slideUp = new Animated.Value(50);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideUp, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleBackToHome = () => {
        navigation.navigate('MyRentMain');
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 min-h-screen">
                {/* Success Animation Container */}
                <View className="flex-1 justify-center items-center px-6 pt-12">
                    {/* Lottie Animation */}
                    <View className="w-48 h-48 mb-8">
                        <LottieView
                            source={require('../../../assets/lottie/done-animation.json')}
                            autoPlay
                            loop={false}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>

                    {/* Success Content */}
                    <Animated.View
                        style={{
                            opacity: fadeIn,
                            transform: [{ translateY: slideUp }],
                        }}
                        className="items-center w-full"
                    >
                        <Text className="text-3xl font-poppins-bold text-gray-900 mb-3">
                            Pembayaran Berhasil!
                        </Text>
                        <Text className="text-gray-500 font-poppins-regular text-center mb-8 px-8">
                            Terima kasih atas pesanan Anda. Pemesanan mobil berhasil, Untuk melihat detail pemesanan silahkan cek di menu MyRent
                        </Text>

                        {/* Modern Status Card */}
                        <View className="w-full bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-6 mb-8">
                            <View className="space-y-6">
                                {/* Status Badge */}
                                <View className="self-center bg-green-100 rounded-full px-4 py-2 mb-2 mr-2">
                                    <Text className="text-green-600 font-poppins-semibold text-center">
                                        Transaksi Sukses
                                    </Text>
                                </View>
                                
                                {/* Time Section */}
                                <View className="bg-white rounded-2xl p-4 mr-2">
                                    <Text className="text-gray-400 font-poppins-medium text-sm text-center mb-1">
                                        Waktu Transaksi
                                    </Text>
                                    <Text className="text-gray-900 font-poppins-semibold text-center">
                                        {new Date().toLocaleString('id-ID')}
                                    </Text>
                                </View>
                                
                               
                            </View>
                        </View>
                    </Animated.View>
                </View>

                {/* Bottom Button */}
                <View 
                    className="px-6 pb-8 space-y-4 mt-auto"
                    style={{ paddingBottom: Platform.OS === 'ios' ? 34 : 24 }}
                >
                    <TouchableOpacity 
                        onPress={handleBackToHome}
                        className="overflow-hidden rounded-2xl shadow-lg"
                    >
                        <LinearGradient
                            colors={['#0255d6', '#0372f5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-4 px-6"
                        >
                            <Text className="text-white text-center font-poppins-bold text-lg">
                                Kembali ke Beranda
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default PaymentSuccess;