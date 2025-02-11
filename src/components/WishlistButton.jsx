import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert, Text, View, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from '../libs/axios';

const NotificationModal = ({ modalVisible, message }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-10/12 max-w-md shadow-lg items-center">
          <View className="bg-green-100 p-3 rounded-full mb-4">
            <Icon name="checkmark-circle" size={50} color="#22c55e" />
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
};

const WishlistButton = ({ carId, kotaId, userId, onWishlistChange }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistData, setWishlistData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    checkWishlistStatus();
  }, [carId]);

  const showNotification = (message) => {
    setModalMessage(message);
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
    }, 2000);
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get('/wishlist/get');
      const wishlistItem = response.data.data.find(
        item => item.mobil_id === carId && item.user_id === userId
      );
      
      setIsInWishlist(!!wishlistItem);
      setWishlistData(wishlistItem || null);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleToggleWishlist = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);

      if (isInWishlist && wishlistData) {
        await axios.delete(`/wishlist/wishlist/destroy/${wishlistData.uuid}`);
        setIsInWishlist(false);
        setWishlistData(null);
        showNotification('Mobil berhasil dihapus dari wishlist');
      } else {
        await axios.post('/wishlist/store', {
          mobil_id: carId,
          user_id: userId,
          kota_id: kotaId
        });
        await checkWishlistStatus();
        showNotification('Mobil berhasil ditambahkan ke wishlist');
      }

      if (onWishlistChange) {
        onWishlistChange(isInWishlist);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleToggleWishlist}
        disabled={isLoading}
        className={`absolute top-4 left-4 rounded-full p-2 ${
          isInWishlist ? 'bg-red-50' : 'bg-white/70'
        }`}
      >
        <Icon
          name={isInWishlist ? 'heart' : 'heart-outline'}
          size={24}
          color={isInWishlist ? '#ef4444' : '#0255d6'}
        />
      </TouchableOpacity>

      <NotificationModal 
        modalVisible={showModal}
        message={modalMessage}
      />
    </>
  );
};

export default WishlistButton;