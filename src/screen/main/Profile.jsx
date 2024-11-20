import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { tw } from 'nativewind';

const Profile = () => {
  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-blue-600 h-[160px] relative">
        <View className="px-4 pt-5 z-10">
          <View className="flex-row items-center mt-4">
            <View className="mr-4">
              <Ionicons name="person-circle" size={64} color="white" />
            </View>
            <View>
              <Text className="font-poppins-medium text-white text-[18px]">Customer</Text>
              <Text className="font-poppins-regular text-white text-[14px] opacity-90">customer@testing.com</Text>
            </View>
          </View>
        </View>
        <View className="absolute bottom-[-30px] left-0 right-0 h-[60px] bg-gray-100 rounded-t-[30px]" />
      </View>

      <View className="flex-1 px-4 mt-[-20px]">
        <View className="bg-white rounded-[12px] mt-4 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <Text className="font-poppins-medium text-[14px] text-gray-800 px-4 py-3">Edit Profile</Text>
          <TouchableOpacity className="flex-row items-center px-4 py-3 border-b border-[#f0f0f0] bg-white rounded-t-[12px]">
            <View className="w-8 mr-3">
              <Ionicons name="person-outline" size={24} color="#666" />
            </View>
            <Text className="font-poppins-regular text-[14px] text-gray-800 flex-1">Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center px-4 py-3 bg-white rounded-b-[12px]">
            <View className="w-8 mr-3">
              <Ionicons name="key-outline" size={24} color="#666" />
            </View>
            <Text className="font-poppins-regular text-[14px] text-gray-800 flex-1">Ganti Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-[12px] mt-4 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <Text className="font-poppins-medium text-[14px] text-gray-800 px-4 py-3">Bantuan</Text>
          <TouchableOpacity className="flex-row items-center px-4 py-3 border-b border-[#f0f0f0] bg-white rounded-t-[12px]">
            <View className="w-8 mr-3">
              <Ionicons name="call-outline" size={24} color="#666" />
            </View>
            <Text className="font-poppins-regular text-[14px] text-gray-800 flex-1">Hubungi Kami</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center px-4 py-3 bg-white rounded-b-[12px]">
            <View className="w-8 mr-3">
              <Ionicons name="help-circle-outline" size={24} color="#666" />
            </View>
            <Text className="font-poppins-regular text-[14px] text-gray-800 flex-1">Pusat Bantuan</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-[12px] mt-4 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <Text className="font-poppins-medium text-[14px] text-gray-800 px-4 py-3">Info Lainnya</Text>
          <TouchableOpacity className="flex-row items-center px-4 py-3 border-b border-[#f0f0f0] bg-white rounded-t-[12px]">
            <View className="w-8 mr-3">
              <Ionicons name="star-outline" size={24} color="#666" />
            </View>
            <Text className="font-poppins-regular text-[14px] text-gray-800 flex-1">Review Aplikasi Kami</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center px-4 py-3 bg-white rounded-b-[12px]">
            <View className="w-8 mr-3">
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            </View>
            <Text className="font-poppins-regular text-[14px] text-red-500 flex-1">Logout</Text>
            <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;