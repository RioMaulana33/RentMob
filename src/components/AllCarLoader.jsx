import React from 'react';
import { View, Dimensions } from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const { width } = Dimensions.get('window');

const AllCarLoader = () => {
    const skeletonItems = Array(5).fill(0);

    const renderSkeletonItem = (index) => (
        <View
            key={index}
            className="flex-row bg-white rounded-xl p-4 mx-5 mb-4 shadow-md"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 2,
                elevation: 3,
            }}
        >
            {/* Car Image Skeleton */}
            <ShimmerPlaceholder
                style={{
                    width: 96,
                    height: 96,
                    borderRadius: 8,
                    backgroundColor: '#e5e5e5'
                }}
                shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
            />

            {/* Car Details Skeleton */}
            <View className="ml-4 flex-1 my-2.5">
                {/* Car Name Skeleton */}
                <ShimmerPlaceholder
                    style={{
                        height: 24,
                        width: '90%',
                        borderRadius: 4,
                        marginBottom: 8
                    }}
                    shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
                />

                {/* Location Skeleton */}
                <ShimmerPlaceholder
                    style={{
                        height: 16,
                        width: '60%',
                        borderRadius: 4,
                        marginBottom: 8
                    }}
                    shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
                />

                {/* Price Skeleton */}
                <ShimmerPlaceholder
                    style={{
                        height: 16,
                        width: '40%',
                        borderRadius: 4
                    }}
                    shimmerColors={['#e5e5e5', '#f0f0f0', '#e5e5e5']}
                />
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50" style={{ paddingTop: 16 }}>
            {skeletonItems.map((_, index) => renderSkeletonItem(index))}
        </View>
    );
};

export default AllCarLoader;