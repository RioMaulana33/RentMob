import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import axios from "../../../libs/axios";

const EditPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (formData.password !== formData.password_confirmation) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post("/auth/change-password", {
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      if (response.data.status) {
        Alert.alert("Berhasil", "Password berhasil diubah.");
        queryClient.invalidateQueries(["users"]);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert(
        "Kesalahan",
        error.response?.data?.message || "Gagal mengubah password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Text className="font-poppins-medium text-[14px] text-gray-800 px-4 py-3">
        Ganti Password
      </Text>
      
      <View className="bg-white rounded-[12px] mx-4">
        <View className="px-4 py-3 border-b border-[#f0f0f0]">
          <TextInput
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            placeholder="Masukkan password baru"
            placeholderTextColor="#aaa"
            className="pl-4 pr-4 py-2 text-sm font-poppins-regular border border-gray-200 rounded-md text-black"
          />
        </View>
        
        <View className="px-4 py-3 border-b border-[#f0f0f0]">
          <TextInput
            secureTextEntry
            value={formData.password_confirmation}
            onChangeText={(value) => handleChange("password_confirmation", value)}
            placeholder="Konfirmasi password baru"
            placeholderTextColor="#aaa"
            className="pl-4 pr-4 py-2 text-sm font-poppins-regular border border-gray-200 rounded-md text-black"
          />
        </View>
        {error && (
          <Text className="text-red-500 text-sm mt-2 pl-4 font-poppins-regular">
            {error}
          </Text>
        )}
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
            Ubah Password
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditPassword;
