import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser } from "../../../services";
import FastImage from 'react-native-fast-image';

const VerifyDoc = ({ navigation }) => {
  const { data: user } = useUser();
  
  const handleVerification = (type) => {
    if (type === 'sim' && !user?.verify_ktp) {
      Alert.alert(
        'Verifikasi KTP Diperlukan',
        'Anda harus memverifikasi KTP terlebih dahulu sebelum verifikasi SIM.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    navigation.navigate('DocumentCamera', { documentType: type });
  };

  const getVerificationStatus = (type) => {
    const value = type === 'ktp' ? user?.verify_ktp : user?.verify_sim;
    if (!value) return 'Belum Terverifikasi';
    return 'Terverifikasi';
  };

  const getStatusColor = (type) => {
    const value = type === 'ktp' ? user?.verify_ktp : user?.verify_sim;
    return value ? 'text-green-600' : 'text-red-500';
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white border-b border-gray-100"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        <View className="px-4 py-3 flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="font-poppins-medium text-[18px] text-gray-800 ml-2 top-0.5">
            Verifikasi Dokumen
          </Text>
        </View>
      </View>

      <View className="p-4">
        <Text className="font-poppins-medium text-[14px] text-gray-600 mb-3 ml-1">
          Pilih dokumen yang ingin diverifikasi
        </Text>

        {/* KTP Verification Card */}
        <TouchableOpacity
          onPress={() => handleVerification('ktp')}
          className="bg-white p-4 rounded-2xl mb-4 shadow-sm"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 1,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mr-4">
                <Ionicons name="card" size={24} color="#1D4ED8" />
              </View>
              <View className="flex-1">
                <Text className="font-poppins-medium text-gray-800 text-[15px] mb-1">
                  Verifikasi KTP
                </Text>
                <Text className={`font-poppins-medium text-[13px] ${getStatusColor('ktp')}`}>
                  {getVerificationStatus('ktp')}
                </Text>
              </View>
            </View>
            {user?.verify_ktp && (
              <FastImage
                source={{ uri: user.verify_ktp }}
                className="w-12 h-12 rounded-lg"
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
          </View>
        </TouchableOpacity>

        {/* SIM Verification Card */}
        <TouchableOpacity
          onPress={() => handleVerification('sim')}
          className="bg-white p-4 rounded-2xl shadow-sm"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 1,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mr-4">
                <Ionicons name="document-text" size={24} color="#1D4ED8" />
              </View>
              <View className="flex-1">
                <Text className="font-poppins-medium text-gray-800 text-[15px] mb-1">
                  Verifikasi SIM
                </Text>
                <Text className={`font-poppins-medium text-[13px] ${getStatusColor('sim')}`}>
                  {getVerificationStatus('sim')}
                </Text>
              </View>
            </View>
            {user?.verify_sim && (
              <FastImage
                source={{ uri: user.verify_sim }}
                className="w-12 h-12 rounded-lg"
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
          </View>
        </TouchableOpacity>

        <Text className="font-poppins-regular text-[13px] text-gray-500 mt-4 px-1">
          *Pastikan foto dokumen jelas dan tidak blur. Verifikasi SIM hanya bisa dilakukan setelah KTP terverifikasi.
        </Text>
      </View>
    </View>
  );
};

export default VerifyDoc;