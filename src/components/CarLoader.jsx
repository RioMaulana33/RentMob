import React from 'react';
import { View } from 'react-native';

const CarLoader = () => {
  const skeletonItems = Array(5).fill(0);

  // Define shadow styles for React Native
  const shadowStyle = {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // This is for Android
  };

  return (
    <>
      {skeletonItems.map((_, index) => (
        <View 
          key={index}
          className="flex-row bg-white rounded-xl p-4 mb-4"
          style={shadowStyle}  // Apply shadow through style prop
        >
          {/* Image skeleton */}
          <View 
            className="w-24 h-24 rounded-lg bg-gray-200"
          />
          
          {/* Content */}
          <View className="ml-4 flex-1 justify-center">
            {/* Title */}
            <View className="h-5 bg-gray-200 rounded-md w-3/4 mb-2" />
            
            {/* Lokasi*/}
            <View className="h-4 bg-gray-200 rounded-md w-1/2 mb-2" />
            
            {/* Harga*/}
            <View className="h-4 bg-gray-200 rounded-md w-2/3" />
          </View>
        </View>
      ))}
    </>
  );
};

export default CarLoader;