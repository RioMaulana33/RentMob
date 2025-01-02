import React, { useState, useEffect } from "react";
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
import SuccessModal from "../../../components/ProfileModal";

const EditPassword = ({ navigation }) => {
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    password_confirmation: ""
  });

  const queryClient = useQueryClient();


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password.trim()) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    if (!formData.password_confirmation.trim()) {
      newErrors.password_confirmation = "Konfirmasi password harus diisi";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Password tidak sama";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.post("/auth/change-password", {
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });
      
      if (response.data.status) {
        setShowSuccessModal(true);
        queryClient.invalidateQueries(["users"]);
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert(
        "Kesalahan",
        error.response?.data?.message || "Gagal mengubah password"
      );
    } finally {
      setIsSubmitting(false);
    }
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
            Ganti Password
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-6">
          <View className="mb-8">
            <Text className="font-poppins-medium text-[13px] text-gray-700 mb-2 ml-1">
              Password Baru
            </Text>
            <View className="relative">
              <View className="absolute left-3.5 z-10" style={{ top: 16 }}>
                <Ionicons name="key" size={20} color={errors.password ? '#ef4444' : '#6B7280'} />
              </View>
              <TextInput
                value={formData.password}
                onChangeText={(value) => {
                  setFormData(prev => ({ ...prev, password: value }));
                  setErrors(prev => ({ ...prev, password: "" }));
                }}
                placeholder="Masukkan password baru"
                maxLength={12}
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!isPasswordVisible}
                className={`bg-white pl-14 pr-12 py-3.5 rounded-xl text-[15px] font-poppins-medium 
                  text-gray-700 border-[1.5px] ${errors.password ? 'border-red-400' : 'border-gray-100'}
                  shadow-sm`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 1,
                }}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3.5 z-10"
                style={{ top: 16 }}
              >
                <Ionicons 
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-400 text-[12px] mt-1 ml-1 font-poppins-regular">
                {errors.password}
              </Text>
            )}
          </View>

          <View className="mb-1">
            <Text className="font-poppins-medium text-[13px] text-gray-700 mb-2 ml-1">
              Konfirmasi Password
            </Text>
            <View className="relative">
              <View className="absolute left-3.5 z-10" style={{ top: 16 }}>
                <Ionicons name="key" size={20} color={errors.password_confirmation ? '#ef4444' : '#6B7280'} />
              </View>
              <TextInput
                value={formData.password_confirmation}
                onChangeText={(value) => {
                  setFormData(prev => ({ ...prev, password_confirmation: value }));
                  setErrors(prev => ({ ...prev, password_confirmation: "" }));
                }}
                placeholder="Konfirmasi password baru"
                placeholderTextColor="#9CA3AF"
                maxLength={12}
                secureTextEntry={!isConfirmPasswordVisible}
                className={`bg-white pl-14 pr-12 py-3.5 rounded-xl text-[15px] font-poppins-medium 
                  text-gray-700 border-[1.5px] ${errors.password_confirmation ? 'border-red-400' : 'border-gray-100'}
                  shadow-sm`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 1,
                }}
              />
              <TouchableOpacity
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                className="absolute right-3.5 z-10"
                style={{ top: 16 }}
              >
                <Ionicons 
                  name={isConfirmPasswordVisible ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>
            {errors.password_confirmation && (
              <Text className="text-red-400 text-[12px] mt-1 ml-1 font-poppins-regular">
                {errors.password_confirmation}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`rounded-xl py-3.5 mb-6 shadow-sm
            ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600'}`}
        >
          <Text className="text-white font-poppins-semibold text-[14px] text-center">
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <SuccessModal 
        modalVisible={showSuccessModal}
        message="Password berhasil diubah"
      />
    </View>
  );
};

export default EditPassword;