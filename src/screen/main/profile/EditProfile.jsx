import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "../../../libs/axios";
import { useUser } from "../../../services";
import SuccessModal from "../../../components/ProfileModal";


const EditProfile = ({ navigation }) => {
  const { data: user } = useUser();
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role_id: user?.role_id || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.put('/auth/user/update', {
        name: userData.name,
        phone: userData.phone
      });
      if (response.data.message) {
        setModalMessage(response.data.message);
        setModalVisible(true);
        queryClient.invalidateQueries(["auth", "user"]);
        setTimeout(() => {
          setModalVisible(false);
          navigation.goBack();
        }, 2000);
      }
    } catch (error) {
      setModalMessage("Gagal memperbarui profil");
      console.error("Error updating profile:", error.response?.data || error.message);
      setModalVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <SuccessModal modalVisible={modalVisible} message="Berhasil memperbarui data" />
      
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
            Edit Profile
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-6">
          <View className="mb-4">
            <Text className="font-poppins-medium text-[13px] text-gray-700 mb-2 ml-1">
              Nama Lengkap
            </Text>
            <View className="relative">
              <View className="absolute left-3.5 z-10" style={{ top: 16 }}>
                <Ionicons name="person" size={20} color="#6B7280" />
              </View>
              <TextInput
                value={userData.name}
                maxLength={20}
                onChangeText={(value) => setUserData(prev => ({ ...prev, name: value }))}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor="#9CA3AF"
                className="bg-white pl-14 pr-4 py-3.5 rounded-xl text-[15px] font-poppins-medium 
                  text-gray-700 border-[1.5px] border-gray-100 shadow-sm"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 1,
                }}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="font-poppins-medium text-[13px] text-gray-700 mb-2 ml-1">
              Email
            </Text>
            <View className="relative">
              <View className="absolute left-3.5 top-3.5 z-10" style={{ top: 16 }}>
                <Ionicons name="mail" size={20} color="#9CA3AF" />
              </View>
              <TextInput
                value={userData.email}
                editable={false}
                className="bg-gray-100 pl-14 pr-4 py-3.5 rounded-xl text-[15px] font-poppins-medium
                  text-gray-500 border-[1.5px] border-gray-100 shadow-sm"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 1,
                }}
              />
            </View>
          </View>

          <View className="mb-1">
            <Text className="font-poppins-medium text-[13px] text-gray-700 mb-2 ml-1">
              Nomor Telepon
            </Text>
            <View className="relative">
              <View className="absolute left-3.5 top-3.5 z-10" style={{ top: 16 }}> 
                <Ionicons name="call" size={20} color="#6B7280" />
              </View>
              <TextInput
                value={userData.phone}
                onChangeText={(value) => setUserData(prev => ({ ...prev, phone: value }))}
                placeholder="Masukkan nomor telepon"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                className="bg-white pl-14  pr-4 py-3.5 rounded-xl text-[15px] font-poppins-medium
                  text-gray-700 border-[1.5px] border-gray-100 shadow-sm"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 1,
                }}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`rounded-xl py-3.5 mb-6 shadow-sm
            ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600'}`}
        >
          <Text className="text-white font-poppins-semibold text-[14px] text-center">
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditProfile;