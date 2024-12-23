import React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';
import { useUser } from "@/src/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from "../../../libs/axios";
import LogoutModal from "../../../components/LogoutModal";

const Profile = ({ navigation }) => {
  const { data: user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: () => axios.delete("/auth/logout"),
    onSuccess: async () => {
      await AsyncStorage.removeItem("@auth-token");
      queryClient.invalidateQueries(["auth", "user"]);
    },
    onError: (error) => {
      console.error("Logout failed", error.response);
      Alert.alert(
        "Logout Gagal", 
        error.response?.data?.message || "Terjadi kesalahan saat logout. Silakan coba lagi."
      );
    }
  });

  const handleLogout = () => setModalVisible(true);
  const confirmLogout = () => {
    setModalVisible(false);
    logout();
  };
  const cancelLogout = () => setModalVisible(false);

  const MenuItem = ({ icon, color = "#6B7280", title, onPress, isLast, isWarning }) => (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center px-5 py-3.5 ${!isLast ? 'border-b border-[#f0f0f0]' : ''} 
        bg-white ${isWarning ? 'opacity-90' : ''}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
      }}
    >
      <View className="w-9 h-9 mr-3.5 bg-opacity-10 rounded-full items-center justify-center"
        style={{ backgroundColor: `${color}15` }}>
        <Ionicons name={icon} size={19} color={color} />
      </View>
      <Text className={`font-poppins-regular text-[14.5px] flex-1 
        ${isWarning ? 'text-red-400' : 'text-gray-600'}`}>
        {title}
      </Text>
      <Ionicons 
        name="chevron-forward" 
        size={17} 
        color={isWarning ? "#FF3B30" : "#9CA3AF"} 
      />
    </TouchableOpacity>
  );

  const MenuSection = ({ title, children }) => (
    <View className="bg-white rounded-[14px] mt-3.5 overflow-hidden shadow-sm">
      <Text className="font-poppins-medium text-[14px] text-gray-700 px-5 py-3">
        {title}
      </Text>
      {children}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient 
        colors={['#0255d6', '#0372f5']}
        className="h-[155px] relative"
      >
        <View className="px-5 pt-5 z-10">
          <View className="flex-row items-center mt-4">
            <View className="mr-4 bg-white/20 rounded-full p-0.5">
              <Ionicons name="person-circle" size={58} color="white" />
            </View>
            <View>
              <Text className="font-poppins-medium text-white text-[17px]">
                {user.name}
              </Text>
              <Text className="font-poppins-regular text-white/90 text-[14px]">
                {user.email}
              </Text>
            </View>
          </View> 
        </View>
        <View className="absolute bottom-[-28px] left-0 right-0 h-[55px] bg-gray-50 rounded-t-[28px]" />
      </LinearGradient>

      <View className="flex-1 px-4 mt-[-12px]">
        <MenuSection title="Edit Profile">
          <MenuItem 
            icon="person"
            title="Edit Profile"
            color="#0372f5"
            onPress={() => navigation.navigate("EditProfile")}
          />
          <MenuItem 
            icon="key"
            title="Ganti Password"
            color="#0372f5"
            onPress={() => navigation.navigate("EditPassword")}
            isLast
          />
        </MenuSection>

        <MenuSection title="Bantuan">
          <MenuItem 
            icon="call"
            title="Hubungi Kami"
            color="#10B981"
          />
          <MenuItem 
            icon="help-circle"
            title="Pusat Bantuan"
            color="#10B981"
            isLast
          />
        </MenuSection>

        <MenuSection title="Info Lainnya">
          <MenuItem 
            icon="star"
            title="Review Aplikasi Kami"
            color="#F59E0B"
          />
          <MenuItem 
            icon="log-out"
            title="Logout"
            color="#EF4444"
            onPress={handleLogout}
            isLast
            isWarning
          />
        </MenuSection>
      </View>

      <LogoutModal
        modalVisible={modalVisible}
        subTitle="Apakah Anda yakin ingin logout?"
        url={require('../../../assets/lottie/logout-animation.json')}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </View>
  );
};

export default Profile;