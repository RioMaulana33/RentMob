import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
    const navigation = useNavigation();
    
    return (
      <View style={{ flex: 1, backgroundColor: '#0372f5' }}>
        <ImageBackground
          source={require('../../assets/image/bg_auth.jpg')}
          style={{
            width: width,
            height: height * 0.4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />

        <View 
          className="bg-white w-full h-full self-center -mt-[280px] py-[20px] px-5 rounded-[30px] shadow-lg"
          style={styles.contentContainer}
        >
          <View className="items-center px-6 w-full max-w-md self-center top-24">
            <Image
              style={{ width: 280, height: 280 }}
              source={require('../../assets/image/welcome-vector.png')}
            />
            
            <Text className="text-4xl font-poppins-bold text-black text-center mb-4">
              Selamat Datang!
            </Text>
            
            <Text className="text-md font-poppins-regular text-[#7f7f7f] text-center mb-8 px-4">
              Sewa mobil dengan mudah dan nyaman. Temukan kendaraan impian Anda 
              dalam satu aplikasi yang praktis dan terpercaya.
            </Text>
          </View>
        </View>

        <View className="absolute bottom-2 left-0 right-0 px-5 pb-5">
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            style={{ borderRadius: 25 }}
            className="py-4 px-6 bg-[#2563eb] shadow-lg mb-4"
          >
            <Text className="text-lg font-poppins-bold text-white text-center">
              Login
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')}
            style={{ borderRadius: 25 }}
            className="py-4 px-6 border-2 border-[#2563eb] "
          >
            <Text className="text-lg font-poppins-bold text-[#2563eb] text-center">
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    contentContainer: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },

  });
  
  export default WelcomeScreen;