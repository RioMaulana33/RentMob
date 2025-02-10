import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const { height } = Dimensions.get('window');

const KotaDetail = ({ route, navigation }) => {
  const { city } = route.params;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header with City Image */}
      <View className="relative">
        <FastImage
          source={{
            uri: city.foto
              ? `${process.env.APP_URL}/storage/${city.foto}`
              : "https://via.placeholder.com/400x200?text=City+Image",
            priority: FastImage.priority.high
          }}
          style={{
            width: '100%',
            height: height * 0.35,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0 
          }}
        />
        
        <View className="px-5 pt-12 pb-6 flex-row items-center z-10">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="mr-4"
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-poppins-bold">
            {city.nama}
          </Text>
        </View>
      </View>

      <ScrollView 
        className="px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: height * 0.25 }}
      >
        {/* Address Card */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md">
          <View className="flex-row items-center mb-2">
            <Icon name="location" size={20} color="#0255d6" />
            <Text className="text-md font-poppins-semibold ml-3 text-gray-800">
              Alamat
            </Text>
          </View>
          <Text className="text-gray-600 font-poppins-regular">
            {city.alamat || 'Alamat tidak tersedia'}
          </Text>
        </View>

        {/* Description Card */}
        <View className="bg-white rounded-xl p-4 shadow-md pb-4">
          <View className="flex-row items-center mb-2">
            <Icon name="information-circle" size={20} color="#0255d6" />
            <Text className="text-md font-poppins-semibold ml-3 text-gray-800">
              Deskripsi Kota
            </Text>
          </View>
          <Text className="text-gray-600 font-poppins-regular">
            {city.deskripsi || 'Deskripsi tidak tersedia'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default KotaDetail;