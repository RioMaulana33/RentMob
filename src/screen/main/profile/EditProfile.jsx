import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Dimensions
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "../../../libs/axios";
import { useUser } from "../../../services";
import SuccessModal from "../../../components/ProfileModal";
import * as ImagePicker from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';

const EditProfile = ({ navigation }) => {
  const { data: user } = useUser();
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role_id: user?.role_id || ""
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  
  const queryClient = useQueryClient();

  const getPhotoUrl = (photo) => {
    if (!photo) return "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg";
    return `${process.env.APP_URL}${photo}`;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (value) => {
    setUserData(prev => ({ ...prev, phone: value }));
    if (value && !validatePhone(value)) {
      setPhoneError("Nomor telepon tidak valid.");
    } else {
      setPhoneError("");
    }
  };

  const handleTakePhoto = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
      saveToPhotos: true,
    };

    try {
      const response = await ImagePicker.launchCamera(options);
      if (response.didCancel) return;
      
      const source = response.assets[0];
      setPhoto({
        uri: source.uri,
        type: source.type,
        name: source.fileName || `photo.${source.type.split('/')[1]}`
      });
      setPhotoPreview(source.uri);
      setPhotoModalVisible(false);
    } catch (error) {
      console.error('Camera Error:', error);
    }
  };

  const handleChooseFromGallery = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
    };

    try {
      const response = await ImagePicker.launchImageLibrary(options);
      if (response.didCancel) return;
      
      const source = response.assets[0];
      setPhoto({
        uri: source.uri,
        type: source.type,
        name: source.fileName || `photo.${source.type.split('/')[1]}`
      });
      setPhotoPreview(source.uri);
      setPhotoModalVisible(false);
    } catch (error) {
      console.error('Gallery Error:', error);
    }
  };

  const PhotoUploadModal = () => (
    <Modal
      isVisible={photoModalVisible}
       onBackdropPress={() => setPhotoModalVisible(false)}
        onSwipeComplete={() => setPhotoModalVisible(false)}
        swipeDirection={['down']}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        backdropOpacity={0.5}
    >
      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="items-center mb-6">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full mb-6" />
            <Text className="font-poppins-medium text-lg text-gray-800">
              Ubah Foto Profile
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleTakePhoto}
            className="flex-row items-center p-4 bg-blue-50 rounded-xl mb-3"
          >
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Ionicons name="camera" size={20} color="#1D4ED8" />
            </View>
            <View>
              <Text className="font-poppins-medium text-gray-800 text-[15px]">
                Ambil Foto
              </Text>
              <Text className="font-poppins-regular text-gray-500 text-[13px]">
                Gunakan kamera untuk mengambil foto
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleChooseFromGallery}
            className="flex-row items-center p-4 bg-blue-50 rounded-xl mb-6"
          >
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Ionicons name="images" size={20} color="#1D4ED8" />
            </View>
            <View>
              <Text className="font-poppins-medium text-gray-800 text-[15px]">
                Pilih dari Galeri
              </Text>
              <Text className="font-poppins-regular text-gray-500 text-[13px]">
                Pilih foto dari galeri anda
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPhotoModalVisible(false)}
            className="py-3.5 bg-gray-100 rounded-xl"
          >
            <Text className="font-poppins-medium text-gray-700 text-center">
              Batal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const handleSubmit = async () => {
    if (!validatePhone(userData.phone)) {
      setPhoneError("Nomor telepon tidak valid");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      
      if (photo) {
        formData.append('photo', photo);
      }

      const response = await axios.post('/auth/user/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.message) {
        setModalVisible(true);
        queryClient.invalidateQueries(["auth", "user"]);
        setTimeout(() => {
          setModalVisible(false);
          navigation.goBack();
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <SuccessModal modalVisible={modalVisible} message="Berhasil memperbarui data"/>
      <PhotoUploadModal />

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
          <View className="items-center mb-8">
          <View>
              <FastImage
                source={{
                  uri: photoPreview || getPhotoUrl(user?.photo),
                  priority: FastImage.priority.high,
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: "#ececec",
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <TouchableOpacity
                onPress={() => setPhotoModalVisible(true)}
                className="mt-3"
              >
                <Text className="text-blue-600 font-poppins-medium text-[14px] text-center right-2">
                  Ubah Foto Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>

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
              Nomor Telepon <Text className="text-red-500">*</Text>
            </Text>
            <View className="relative">
              <View className="absolute left-3.5 top-3.5 z-10" style={{ top: 16 }}> 
                <Ionicons name="call" size={20} color="#6B7280" />
              </View>
              <TextInput
                value={userData.phone}
                onChangeText={handlePhoneChange}
                placeholder="08xx/62xx/+62xx"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                className="bg-white pl-14 pr-4 py-3.5 rounded-xl text-[15px] font-poppins-medium
                  text-gray-700 border-[1.5px] border-gray-100 shadow-sm"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 1,
                }}
              />
              {phoneError ? (
                <Text className="text-red-500 text-[12px] mt-1 ml-1 font-poppins-regular">
                  {phoneError}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting || !!phoneError}
          className={`rounded-xl py-3.5 mb-6 shadow-sm
            ${isSubmitting || phoneError ? 'bg-blue-400' : 'bg-blue-600'}`}
        >
          <Text className="text-white font-poppins-semibold text-[14px] text-center">
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditProfile;