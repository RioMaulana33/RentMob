import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const PaymentFailed = ({ route, navigation }) => {
    const { error, message } = route.params || {};
    const fadeIn = new Animated.Value(0);
    const slideUp = new Animated.Value(50);

    useEffect(() => {
        // Log error when component mounts
        console.error('Payment Failed Error:', error || 'Unknown error occurred');

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

    const handleTryAgain = () => {
        console.log('User initiated retry payment');
        navigation.goBack();
    };

    const handleContactSupport = () => {
        navigation.navigate('Support'); // Navigate to your support screen
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 min-h-screen">
                {/* Failed Animation Container */}
                <View className="flex-1 justify-center items-center px-6 pt-12">
                    {/* Lottie Animation */}
                    <View className="w-48 h-48 mb-8">
                        <LottieView
                            source={require('../../../assets/lottie/question-animation.json')}
                            autoPlay
                            loop={false}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>

                    {/* Failed Content */}
                    <Animated.View
                        style={{
                            opacity: fadeIn,
                            transform: [{ translateY: slideUp }],
                        }}
                        className="items-center w-full"
                    >
                        <Text className="text-3xl font-poppins-bold text-gray-900 mb-3">
                            Pembayaran Gagal
                        </Text>
                        <Text className="text-gray-500 font-poppins-regular text-center mb-8 px-8">
                            {message || 'Mohon maaf, transaksi Anda tidak dapat diproses saat ini. Silakan coba lagi atau hubungi customer service kami.'}
                        </Text>

                        {/* Error Details Card */}
                        <View className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                            <View className="flex-row items-center mb-4">
                                <MaterialIcon name="alert-circle" size={20} color="#DC2626" />
                                <Text className="text-red-600 font-poppins-semibold ml-2">Detail Gagal</Text>
                            </View>
                            <Text className="text-gray-500 font-poppins-regular">
                                {error || 'Terjadi kesalahan dalam proses pembayaran. Silakan periksa metode pembayaran Anda dan coba lagi.'}
                            </Text>
                        </View>

                        {/* Quick Actions */}
                        <View className="flex-row justify-between w-full mt-8 mb-8">
                            <TouchableOpacity 
                                className="flex-1 bg-gray-50 rounded-2xl p-4 mr-2 items-center"
                                onPress={handleTryAgain}
                            >
                                <MaterialIcon name="refresh" size={24} color="#4B5563" />
                                <Text className="text-gray-600 font-poppins-medium mt-2">Coba Lagi</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                className="flex-1 bg-gray-50 rounded-2xl p-4 ml-2 items-center"
                                onPress={handleContactSupport}
                            >
                                <MaterialIcon name="headset" size={24} color="#4B5563" />
                                <Text className="text-gray-600 font-poppins-medium mt-2">Hubungi CS</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>

                {/* Bottom Button */}
                <View 
                    className="px-6 pb-8"
                    style={{ paddingBottom: Platform.OS === 'ios' ? 34 : 24 }}
                >
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('HomeMain')}
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

export default PaymentFailed;