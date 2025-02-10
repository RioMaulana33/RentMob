import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "../../../libs/axios";
import SuccessModal from "../../../components/ProfileModal";

const EditPassword = ({ navigation }) => {
  const [formData, setFormData] = useState({
    old_password: "",
    password: "",
    password_confirmation: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({
    old_password: "",
    password: "",
    password_confirmation: ""
  });

  const queryClient = useQueryClient();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.old_password.trim()) {
      newErrors.old_password = "Password lama harus diisi";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password baru harus diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    } else if (formData.password === formData.old_password) {
      newErrors.password = "Password baru tidak boleh sama dengan password lama";
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
      const response = await axios.post("/auth/change-password", formData);
      
      if (response.data.status) {
        setShowSuccessModal(true);
        queryClient.invalidateQueries(["users"]);
        
        setFormData({
          old_password: "",
          password: "",
          password_confirmation: ""
        });
        
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      }
    } catch (error) {
      // Handle specific error from backend for wrong old password
      if (error.response?.data?.message === 'Password lama tidak sesuai') {
        setErrors(prev => ({
          ...prev,
          old_password: "Password lama tidak sesuai"
        }));
      } else if (error.response?.data?.errors) {
        // Handle other validation errors from backend
        setErrors(prev => ({
          ...prev,
          ...error.response.data.errors
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPasswordInput = (field, label, placeholder, visibilityKey) => (
    <View className="mb-8">
      <Text className="font-poppins-medium text-[13px] text-gray-700 mb-2 ml-1">
        {label}
      </Text>
      <View className="relative">
        <View className="absolute left-3.5 z-10" style={{ top: 16 }}>
          <Ionicons 
            name="key" 
            size={20} 
            color={errors[field] ? '#ef4444' : '#6B7280'} 
          />
        </View>
        <TextInput
          value={formData[field]}
          onChangeText={(value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
            setErrors(prev => ({ ...prev, [field]: "" }));
          }}
          placeholder={placeholder}
          maxLength={12}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!isPasswordVisible[visibilityKey]}
          className={`bg-white pl-14 pr-12 py-3.5 rounded-xl text-[15px] font-poppins-medium 
            text-gray-700 border-[1.5px] ${errors[field] ? 'border-red-400' : 'border-gray-100'}
            shadow-sm`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 1,
          }}
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(prev => ({
            ...prev,
            [visibilityKey]: !prev[visibilityKey]
          }))}
          className="absolute right-3.5 z-10"
          style={{ top: 16 }}
        >
          <Ionicons 
            name={isPasswordVisible[visibilityKey] ? "eye-outline" : "eye-off-outline"} 
            size={20} 
            color="#6B7280" 
          />
        </TouchableOpacity>
      </View>
      {errors[field] && (
        <Text className="text-red-400 text-[12px] mt-1 ml-1 font-poppins-regular">
          {errors[field]}
        </Text>
      )}
    </View>
  );

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
          {renderPasswordInput(
            "old_password",
            "Password Lama",
            "Masukkan password lama",
            "old"
          )}
          {renderPasswordInput(
            "password",
            "Password Baru",
            "Masukkan password baru",
            "new"
          )}
          {renderPasswordInput(
            "password_confirmation",
            "Konfirmasi Password",
            "Konfirmasi password baru",
            "confirm"
          )}
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