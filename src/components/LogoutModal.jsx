import { Text, View, Modal, TouchableOpacity } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

export default function LogoutModal({
  url,
  modalVisible,
  title,
  subTitle,
  onConfirm,
  onCancel,
}) {
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
              onPress={onConfirm}
              className="bg-blue-500 py-3.5 rounded-xl">
              <Text className="text-center text-white font-poppins-medium text-base">
                Ya, Logout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCancel}
              className="bg-gray-200 py-3.5 rounded-xl mt-3">
              <Text className="text-center text-black font-poppins-medium text-base">
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
