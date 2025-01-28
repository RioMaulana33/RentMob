import React from 'react';
import { View, Dimensions } from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const CarLoader = () => {
  const screenWidth = Dimensions.get('window').width;
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
          className="flex-row bg-white rounded-xl p-4 mb-4"
          style={shadowStyle}
        >
          <ShimmerPlaceholder
            style={{ 
              width: 96, 
              height: 96, 
              borderRadius: 8 
            }}
            shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
          />
          
          <View className="ml-4 my-2.5 flex-1">
            <ShimmerPlaceholder
              style={{ 
                height: 20, 
                borderRadius: 4,
                width: screenWidth * 0.5,
                marginBottom: 8 
              }}
              shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
            />
            
            <ShimmerPlaceholder
              style={{ 
                height: 16, 
                borderRadius: 4,
                width: screenWidth * 0.4,
                marginBottom: 8 
              }}
              shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
            />
            
            <ShimmerPlaceholder
              style={{ 
                height: 16, 
                borderRadius: 4,
                width: screenWidth * 0.3 
              }}
              shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
            />
          </View>
        </View>
      ))}
    </>
  );
};

export default CarLoader;