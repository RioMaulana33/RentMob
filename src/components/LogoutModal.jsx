import { Text, View, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import LottieView from 'lottie-react-native';

export default function LogoutModal({
  url,
  modalVisible,
  title,
  subTitle,
  onConfirm,
  onCancel,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-10/12 max-w-md shadow-lg">
          <View className="items-center">
            <LottieView
              source={url}
              autoPlay
              loop={false}
              style={{ width: 150, height: 150 }}
            />
           
            <Text className="text-md text-gray-600 text-center my-2 font-poppins-regular">
              {subTitle}
            </Text>
          </View>
          <View className="mt-4 space-y-4">
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading}
              className={`${isLoading ? 'bg-red-50' : 'bg-red-100'} py-3.5 rounded-full`}>
              {isLoading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator size="small" color="#EF4444" />
                  <Text className="text-red-500 font-poppins-semibold text-base ml-2">
                    Logging out...
                  </Text>
                </View>
              ) : (
                <Text className="text-center text-red-500 font-poppins-semibold text-base">
                  Ya, Logout
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCancel}
              disabled={isLoading}
              className={`${isLoading ? 'bg-gray-100' : 'bg-gray-200'} py-3.5 rounded-full mt-3`}>
              <Text className={`text-center ${isLoading ? 'text-gray-400' : 'text-black'} font-poppins-medium text-base`}>
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}