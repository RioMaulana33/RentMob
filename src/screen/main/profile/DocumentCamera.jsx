import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "../../../libs/axios";
import { useQueryClient } from "@tanstack/react-query";
import SuccessModal from "../../../components/ProfileModal";
import FastImage from 'react-native-fast-image';

const DocumentCamera = ({ navigation, route }) => {
  const { documentType } = route.params;
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;

  console.log('Camera device status:', {
    hasDevice: !!device,
    deviceInfo: device
  });

  React.useEffect(() => {
    const checkPermissions = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      console.log('Current camera permission status:', cameraPermission);
    };
    
    checkPermissions();
  }, []);
  
  const queryClient = useQueryClient();

  const requestCameraPermission = async () => {
    console.log('Requesting camera permission...');
    if (Platform.OS === 'android') {
      try {
        const permission = await Camera.requestCameraPermission();
        console.log('Camera permission result:', permission);
        return true;
      } catch (err) {
        console.error('Camera permission error:', err);
        return false;
      }
    }
    return true;
  };

  const validateDocument = async (imagePath) => {
    try {
      setProcessing(true);
      const result = await TextRecognition.recognize(imagePath);
      const text = result.text.toLowerCase();
      
      if (documentType === 'ktp') {
        if (!text.includes('nik') || !text.includes('provinsi')) {
          Alert.alert('Verifikasi Gagal', 'Pastikan foto KTP jelas dan lengkap. Pastikan NIK dan data lainnya terbaca dengan jelas.');
          return false;
        }
      } else if (documentType === 'sim') {
        if (!text.includes('sim') || !text.includes('polri')) {
          Alert.alert('Verifikasi Gagal', 'Pastikan foto SIM jelas dan lengkap. Pastikan nomor SIM dan data lainnya terbaca dengan jelas.');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      Alert.alert('Error', 'Gagal memverifikasi dokumen. Silakan coba lagi.');
      return false;
    } finally {
      setProcessing(false);
    }
  };

  const takePicture = async () => {
    console.log('Starting take picture process...');
    const hasPermission = await requestCameraPermission();
    console.log('Camera permission status:', hasPermission);
  
    if (!hasPermission) {
      console.log('No camera permission granted');
      Alert.alert('Izin Diperlukan', 'Aplikasi membutuhkan izin kamera untuk melanjutkan');
      return;
    }
  
    if (camera.current) {
      try {
        console.log('Taking photo...');
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
        });
        console.log('Photo taken successfully:', photo);
        
        const photoUri = `file://${photo.path}`;
        console.log('Photo URI:', photoUri);
        
        // ... kode lainnya
      } catch (error) {
        console.error('Camera Error:', error);
        Alert.alert('Error', 'Gagal mengambil foto. Silakan coba lagi.');
      }
    } else {
      console.log('Camera ref is not available');
    }
  };

  const handleSubmit = async () => {
    if (!photo) {
      Alert.alert('Error', 'Silakan ambil foto terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(`verify_${documentType}`, photo);

      const response = await axios.post('/auth/user/verify-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.message) {
        setModalVisible(true);
        queryClient.invalidateQueries(["auth", "user"]);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('VerificationMenu');
        }, 2000);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Terjadi kesalahan saat mengunggah dokumen');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!devices || !devices.back) {
    console.log('Checking device availability:', {
      devicesExist: !!devices,
      backCameraExists: !!devices?.back,
      frontCameraExists: !!devices?.front
    });
    
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#60A5FA" />
        <Text className="mt-4 text-gray-600">Menginisialisasi kamera...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <SuccessModal 
        modalVisible={modalVisible} 
        message={`Berhasil mengunggah ${documentType.toUpperCase()}`}
      />

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
            Foto {documentType.toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="flex-1">
        {photoPreview ? (
          <View className="flex-1 p-4">
            <FastImage
              source={{ uri: photoPreview }}
              className="flex-1 rounded-xl"
              resizeMode={FastImage.resizeMode.cover}
            />
            <View className="flex-row justify-between mt-4 px-4">
              <TouchableOpacity
                onPress={() => {
                  setPhoto(null);
                  setPhotoPreview(null);
                }}
                className="bg-gray-100 px-6 py-3 rounded-xl"
              >
                <Text className="font-poppins-medium text-gray-700">Ambil Ulang</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-xl ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600'}`}
              >
                <Text className="font-poppins-medium text-white">
                  {isSubmitting ? 'Mengunggah...' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="flex-1">
            <Camera
              ref={camera}
              style={{ flex: 1 }}
              device={device}
              isActive={true}
              photo={true}
            />
            {processing && (
              <View className="absolute inset-0 bg-black/50 items-center justify-center">
                <ActivityIndicator size="large" color="#fff" />
                <Text className="text-white mt-2 font-poppins-medium">
                  Memverifikasi dokumen...
                </Text>
              </View>
            )}
            <View className="absolute bottom-10 w-full">
              <View className="items-center">
                <TouchableOpacity
                  onPress={takePicture}
                  disabled={processing}
                  className="w-16 h-16 bg-white rounded-full items-center justify-center"
                >
                  <View className="w-14 h-14 bg-blue-600 rounded-full" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default DocumentCamera;