import { Text, View, Modal, TouchableOpacity } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

export default function ConfirmationModal({
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
        <View className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg items-center">
          <LottieView source={url} autoPlay loop={false} className="w-48 h-48" />
          <Text className="text-lg font-semibold text-black text-center mt-2">
            {title}
          </Text>
          <Text className="text-sm text-gray-600 text-center my-2">
            {subTitle}
          </Text>
          <View className="flex-row justify-between w-full mt-4">
            <TouchableOpacity
              onPress={onCancel}
              className="bg-gray-200 px-4 py-2 rounded-md w-5/12">
              <Text className="text-center text-gray-800 font-medium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="bg-blue-500 px-4 py-2 rounded-md w-5/12">
              <Text className="text-center text-white font-medium">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
