import React from 'react';
import { View } from 'react-native';

const MyRentSkeletonLoader = () => {
  const skeletonItems = Array(5).fill(0);

  const shadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  };

  return (
    <>
      {skeletonItems.map((_, index) => (
        <View 
          key={index}
          className="bg-white rounded-xl p-4 mx-5 mb-4 shadow-md"
          style={shadowStyle}
        >
          <View className="flex-row justify-between items-center mb-2">
            <View>
              <View className="h-5 bg-gray-200 rounded-md w-3/4 mb-2" />
              <View className="border-b border-gray-200 my-3"/>
              <View className="h-4 bg-gray-200 rounded-md w-1/2" />
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <View>
              <View className="h-4 bg-gray-200 rounded-md w-16 mb-1" />
              <View className="h-5 bg-gray-200 rounded-md w-24" />
            </View>
            <View>
              <View className="h-4 bg-gray-200 rounded-md w-16 mb-1" />
              <View className="h-5 bg-gray-200 rounded-md w-24" />
            </View>
            <View className="h-8 w-20 bg-gray-200 rounded-full" />
          </View>
        </View>
      ))}
    </>
  );
};

export default MyRentSkeletonLoader;