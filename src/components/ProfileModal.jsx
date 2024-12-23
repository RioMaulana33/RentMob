import { Text, View, Modal } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProfileModal({ modalVisible, message }) {
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-10/12 max-w-md shadow-lg items-center">
          <View className="bg-green-100 p-3 rounded-full mb-4">
            <Ionicons name="checkmark-circle" size={50} color="#22c55e" />
          </View>
          <Text className="text-xl text-gray-800 font-poppins-semibold mb-2 text-center">
            Berhasil!
          </Text>
          <Text className="text-md text-gray-600 text-center font-poppins-regular">
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}