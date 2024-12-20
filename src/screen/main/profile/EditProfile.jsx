import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "../../../libs/axios";
import { useUser } from "../../../services";

const EditProfile = ({ route }) => {
  const { data: user, isLoading } = useUser();
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role_id: user?.role_id || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  
  const queryClient = useQueryClient();

  const validateName = () => {
    if (!userData.name.trim()) {
      setNameError("Nama harus diisi");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateName()) return;
  
    setIsSubmitting(true);
  
    try {
      const response = await axios.put('/auth/user/update', {
        name: userData.name,
        phone: userData.phone
      });
  
      if (response.data.message) {
        Alert.alert("Berhasil", response.data.message);
        queryClient.invalidateQueries(["auth", "user"]);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert(
        "Kesalahan",
        error.response?.data?.message || "Gagal memperbarui profil"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#312e81" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Text className="font-poppins-medium text-[14px] text-gray-800 px-4 py-3">
        Edit Profile
      </Text>
      
      <View className="bg-white rounded-[12px] mx-4">
        <View className="px-4 py-3 border-b border-[#f0f0f0]">
          <View className="flex-row items-center mb-2">
            <View className="w-8 mr-3">
              <Ionicons name="person-outline" size={24} color="#666" />
            </View>
            <Text className="font-poppins-medium text-sm text-gray-800">Nama</Text>
          </View>
          <TextInput
            className={`pl-11 pr-4 py-2 text-sm font-poppins-regular text-black ${
              nameError ? "border-red-500" : "border-gray-200"
            }`}
            value={userData.name}
            onChangeText={(value) => handleChange("name", value)}
            onBlur={validateName}
            placeholder="Masukkan nama Anda"
            placeholderTextColor="#aaa"
          />
          {nameError && (
            <Text className="text-red-500 text-sm mt-1 pl-11 font-poppins-regular ">
              {nameError}
            </Text>
          )}
        </View>

        <View className="px-4 py-3 border-b border-[#f0f0f0]">
          <View className="flex-row items-center mb-2">
            <View className="w-8 mr-3">
              <Ionicons name="mail-outline" size={24} color="#666" />
            </View>
            <Text className="font-poppins-medium text-sm text-gray-800">Email</Text>
          </View>
          <TextInput
            value={userData.email}
            className="pl-11 pr-4 py-2 text-sm font-poppins-regular bg-gray-50 text-black"
            editable={false}
          />
        </View>

        <View className="px-4 py-3">
          <View className="flex-row items-center mb-2">
            <View className="w-8 mr-3">
              <Ionicons name="call-outline" size={24} color="#666" />
            </View>
            <Text className="font-poppins-medium text-sm text-gray-800">No. Telepon</Text>
          </View>
          <TextInput
            value={userData.phone}
            onChangeText={(value) => handleChange("phone", value)}
            placeholder="Masukkan nomor telepon"
            className="pl-11 pr-4 py-2 text-sm font-poppins-regular text-black"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        className="mx-4 mt-6 rounded-lg py-3 flex items-center"
        style={{ 
          backgroundColor: "#2563eb",
          opacity: isSubmitting ? 0.5 : 1
        }}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-poppins-bold text-sm">
            Simpan Perubahan
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;