import React from 'react';
import { View, Dimensions } from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const { width } = Dimensions.get('window');

const CarLoader = () => {
  const skeletonItems = Array(3).fill(0);

  return (
    <>
      {skeletonItems.map((_, index) => (
        <View 
          key={index}
          className="bg-white rounded-xl p-4 mb-4 shadow-sm"
        >
          {/* Image placeholder */}
          <ShimmerPlaceholder
            style={{ 
              width: '100%',
              height: 160,
              borderRadius: 12,
              marginBottom: 12
            }}
            shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
          />
          
          <View className="flex-row justify-between items-start">
            {/* Left side content */}
            <View>
              {/* Car name placeholder */}
              <ShimmerPlaceholder
                style={{ 
                  width: width * 0.4,
                  height: 24,
                  borderRadius: 4,
                  marginBottom: 8
                }}
                shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
              />
              
              {/* Location placeholder */}
              <ShimmerPlaceholder
                style={{ 
                  width: width * 0.3,
                  height: 16,
                  borderRadius: 4
                }}
                shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
              />
            </View>

            {/* Price placeholder */}
            <ShimmerPlaceholder
              style={{ 
                width: width * 0.25,
                height: 20,
                borderRadius: 4
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