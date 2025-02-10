import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from '../libs/axios';

const WishlistButton = ({ carId, kotaId, userId, onWishlistChange }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistData, setWishlistData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkWishlistStatus();
  }, [carId]);

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
    if (isLoading) return; // Prevent multiple clicks while processing
    
    try {
      setIsLoading(true);

      if (isInWishlist && wishlistData) {
        // Remove from wishlist
        await axios.delete(`/wishlist/wishlist/destroy/${wishlistData.uuid}`);
        setIsInWishlist(false);
        setWishlistData(null);
      } else {
        // Add to wishlist
        const response = await axios.post('/wishlist/store', {
          mobil_id: carId,
          user_id: userId,
          kota_id: kotaId
        });
        
        await checkWishlistStatus();
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
  );
};

export default WishlistButton;