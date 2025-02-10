import React, { useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from '../../../libs/axios';

const PaymentWebView = ({ route, navigation }) => {
    const { paymentUrl, orderId, rentalData } = route.params;
    const [isProcessing, setIsProcessing] = useState(false);
    const webViewRef = useRef(null);
    
    // Enhanced success detection patterns
    const SUCCESS_PATTERNS = [
        'payment_status=success',
        'transaction_status=success',
        'status_code=200',
        '/success',
        'transaction_status=capture',
        'payment_type=credit_card',
        'payment_status=paid'
    ];
    
    // Enhanced failure detection patterns
    const FAILURE_PATTERNS = [
        'payment_status=failure',
        'transaction_status=failure',
        'status_code=201',
        'status_code=202',
        '/failed',
        'transaction_status=cancel',
        'transaction_status=deny'
    ];

    const isUrlMatchingPatterns = (url, patterns) => {
        return patterns.some(pattern => url.toLowerCase().includes(pattern.toLowerCase()));
    };
    
    const handleNavigationStateChange = async (navState) => {
        console.log('Current URL:', navState.url);
        
        const isSuccessUrl = isUrlMatchingPatterns(navState.url, SUCCESS_PATTERNS);
        const isFailureUrl = isUrlMatchingPatterns(navState.url, FAILURE_PATTERNS);
        
        if (isSuccessUrl && !isProcessing) {
            setIsProcessing(true);
            console.log('Payment success detected');
            
            try {
                // First check if rental already exists
                const checkRental = await axios.get(`/penyewaan/check/${orderId}`);
                
                if (checkRental.data.exists) {
                    // Rental already exists, proceed to success page
                    navigation.replace('PaymentSuccess', {
                        message: 'Pembayaran berhasil!',
                        rentalCode: checkRental.data.rental.kode_penyewaan
                    });
                    return;
                }
                
                // Create rental entry if it doesn't exist
                const rentalResponse = await axios.post('/penyewaan/store', {
                    ...rentalData,
                    status: 'pending',
                    payment_status: 'paid',
                    midtrans_booking_code: orderId
                });

                if (rentalResponse.data.status) {
                    navigation.replace('PaymentSuccess', {
                        message: 'Pembayaran berhasil!',
                        rentalCode: rentalResponse.data.data.kode_penyewaan
                    });
                } else {
                    throw new Error('Failed to create rental entry');
                }
            } catch (error) {
                console.error('Error handling payment success:', error);
                
                // Check if rental was actually created despite the error
                try {
                    const checkRental = await axios.get(`/penyewaan/check/${orderId}`);
                    if (checkRental.data.exists) {
                        navigation.replace('PaymentSuccess', {
                            message: 'Pembayaran berhasil!',
                            rentalCode: checkRental.data.rental.kode_penyewaan
                        });
                        return;
                    }
                } catch (checkError) {
                    console.error('Error checking rental:', checkError);
                }
                
                navigation.replace('PaymentFailed', {
                    message: 'Pembayaran berhasil tapi gagal membuat pesanan. Silakan hubungi customer service.'
                });
            }
        } else if (isFailureUrl) {
            navigation.replace('PaymentFailed', {
                message: 'Pembayaran gagal atau dibatalkan!'
            });
        }
    };

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                source={{ uri: paymentUrl }}
                style={styles.webview}
                onNavigationStateChange={handleNavigationStateChange}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#0255d6" />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default PaymentWebView;