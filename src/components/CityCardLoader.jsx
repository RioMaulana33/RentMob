import React from 'react';
import { View, Dimensions } from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const { width } = Dimensions.get('window');

const CityCardLoader = () => {
  const skeletonItems = Array(6).fill(0);

  return (
    <View style={{ 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      justifyContent: 'space-between' 
    }}>
      {skeletonItems.map((_, index) => (
        <View 
          key={index}
          className="bg-white rounded-xl mb-3 overflow-hidden"
          style={{ 
            width: '48%', 
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8
          }}
        >
          {/* Image placeholder */}
          <ShimmerPlaceholder
            style={{
              width: '100%',
              height: 140,
              backgroundColor: '#f3f4f6'
            }}
            shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
          />
          
          <View className="p-3">
            {/* City name placeholder */}
            <ShimmerPlaceholder
              style={{ 
                width: '70%',
                height: 18,
                borderRadius: 4,
                marginBottom: 8
              }}
              shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
            />
            
            {/* Address placeholder */}
            <View className="flex-row items-start">
              <ShimmerPlaceholder
                style={{ 
                  width: '80%',
                  height: 14,
                  borderRadius: 4
                }}
                shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default CityCardLoader;