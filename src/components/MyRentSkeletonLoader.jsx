import React from 'react';
import { View, Dimensions } from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MyRentSkeletonLoader = () => {
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
    <View className="px-5">
      {skeletonItems.map((_, index) => (
        <View 
          key={index}
          className="bg-white rounded-xl p-4 mb-4"
          style={shadowStyle}
        >
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-1">
              <ShimmerPlaceholder
                style={{ 
                  height: 20, 
                  borderRadius: 10,
                  marginBottom: 8,
                  width: screenWidth * 0.6 
                }}
                shimmerColors={['#e1e1e1', '#f0f0f0', '#e1e1e1']}
              />
              <View className="border-b border-gray-200 my-3"/>
              <ShimmerPlaceholder
                style={{ 
                  height: 16, 
                  borderRadius: 8,
                  width: screenWidth * 0.4 
                }}
                shimmerColors={['#e1e1e1', '#f0f0f0', '#e1e1e1']}
              />
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <View>
              <ShimmerPlaceholder
                style={{ 
                  height: 16, 
                  borderRadius: 8,
                  marginBottom: 4,
                  width: 80 
                }}
                shimmerColors={['#e1e1e1', '#f0f0f0', '#e1e1e1']}
              />
              <ShimmerPlaceholder
                style={{ 
                  height: 20, 
                  borderRadius: 10,
                  width: 100 
                }}
                shimmerColors={['#e1e1e1', '#f0f0f0', '#e1e1e1']}
              />
            </View>
            <View>
              <ShimmerPlaceholder
                style={{ 
                  height: 16, 
                  borderRadius: 8,
                  marginBottom: 4,
                  width: 80 
                }}
                shimmerColors={['#e1e1e1', '#f0f0f0', '#e1e1e1']}
              />
              <ShimmerPlaceholder
                style={{ 
                  height: 20, 
                  borderRadius: 10,
                  width: 100 
                }}
                shimmerColors={['#e1e1e1', '#f0f0f0', '#e1e1e1']}
              />
            </View>
            <ShimmerPlaceholder
              style={{ 
                height: 32, 
                borderRadius: 16,
                width: 90 
              }}
              shimmerColors={['#e1e1e1', '#f0f0f0', '#e1e1e1']}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default MyRentSkeletonLoader;