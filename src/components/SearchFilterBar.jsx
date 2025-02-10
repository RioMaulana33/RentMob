import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';

const DEFAULT_FILTERS = {
  model: 'all',
  fuelType: 'all',
  capacity: 'all'
};

const SearchFilterBar = ({ searchQuery, onSearchChange, onFilterApply, initialFilters = DEFAULT_FILTERS }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const carTypeOptions = [
    { icon: 'car-estate', label: 'SUV', value: 'SUV' },
    { icon: 'car-sports', label: 'Sedan', value: 'Sedan' },
    { icon: 'car-side', label: 'MPV', value: 'MPV' },
    { icon: 'car', label: 'LCGC', value: 'LCGC' }
  ];

  const filterOptions = {
    fuelType: [
      { icon: 'gas-station', label: 'Semua', value: 'all' },
      { icon: 'gas-station', label: 'Bensin', value: 'Bensin' },
      { icon: 'gas-station', label: 'Solar', value: 'Solar' }
    ],
    capacity: [
      { icon: 'car-seat', label: 'Semua', value: 'all' },
      { icon: 'car-seat', label: '5 Orang', value: '5' },
      { icon: 'car-seat', label: '7 Orang', value: '7' }
    ]
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== 'all').length;
  };

  const handleReset = () => {
    const resetFilters = { ...DEFAULT_FILTERS };
    setFilters(resetFilters);
    onFilterApply(resetFilters);
  };

  const FilterSection = ({ title, children }) => (
    <View className="mb-6">
      <Text className="text-gray-800 text-base font-poppins-semibold mb-3">{title}</Text>
      {children}
    </View>
  );

  const CarTypeOption = ({ icon, label, isSelected, onSelect }) => (
    <TouchableOpacity
      onPress={onSelect}
      className={`items-center justify-center p-3 rounded-2xl ${isSelected ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border border-gray-200'
        }`}
      style={{ width: '23%' }}
    >
      <MaterialIcon
        name={icon}
        size={28}
        color={isSelected ? '#1D4ED8' : '#64748B'}
      />
      <Text className={`text-xs mt-2 font-poppins-medium ${isSelected ? 'text-blue-700' : 'text-gray-600'
        }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const FilterChip = ({ icon, label, isSelected, onSelect }) => (
    <TouchableOpacity
      onPress={onSelect}
      className={`flex-row items-center px-4 py-2.5 rounded-xl mr-2 mb-2 ${isSelected
          ? 'bg-blue-50 border-2 border-blue-500'
          : 'bg-gray-50 border border-gray-200'
        }`}
    >
      <MaterialIcon
        name={icon}
        size={20}
        color={isSelected ? '#1D4ED8' : '#64748B'}
        style={{ marginRight: 8 }}
      />
      <Text className={`font-poppins-medium ${isSelected ? 'text-blue-700' : 'text-gray-600'
        }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="bg-white border-b border-gray-100">
      <View className="flex-row items-center px-4 py-2 gap-2">
        <View className="flex-row items-center bg-gray-50 rounded-full flex-1 px-1.5 /py-1.5 border border-gray-200">
          <View className='mr-1 ml-2'>
            <IonIcons name="search" size={16} color="#0255d6" />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Cari mobil..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-sm font-poppins-regular text-gray-900"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => onSearchChange('')} className="mr-2">
              <MaterialIcon name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={() => setIsFilterVisible(true)}
          className="p-2 rounded-full bg-gray-50 border border-gray-200"
        >
          <View className="relative">
            <MaterialIcon name="tune-vertical" size={20} color="#0255d6" />
            {getActiveFilterCount() > 0 && (
              <View className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-poppins-bold">
                  {getActiveFilterCount()}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setIsFilterVisible(false)}
              className="p-2 -ml-2"
            >
              <MaterialIcon name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-lg font-poppins-semibold text-gray-900">Filter</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text className="text-blue-600 font-poppins-medium">Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <FilterSection title="Tipe Mobil">
              <View className="flex-row flex-wrap justify-between">
                {carTypeOptions.map((option) => (
                  <CarTypeOption
                    key={option.value}
                    icon={option.icon}
                    label={option.label}
                    isSelected={filters.model === option.value}
                    onSelect={() => setFilters(prev => ({ ...prev, model: option.value }))}
                  />
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Bahan Bakar">
              <View className="flex-row flex-wrap">
                {filterOptions.fuelType.map((option) => (
                  <FilterChip
                    key={option.value}
                    icon={option.icon}
                    label={option.label}
                    isSelected={filters.fuelType === option.value}
                    onSelect={() => setFilters(prev => ({ ...prev, fuelType: option.value }))}
                  />
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Kapasitas">
              <View className="flex-row flex-wrap">
                {filterOptions.capacity.map((option) => (
                  <FilterChip
                    key={option.value}
                    icon={option.icon}
                    label={option.label}
                    isSelected={filters.capacity === option.value}
                    onSelect={() => setFilters(prev => ({ ...prev, capacity: option.value }))}
                  />
                ))}
              </View>
            </FilterSection>
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={() => {
                onFilterApply(filters);
                setIsFilterVisible(false);
              }}
              className="bg-blue-500 py-3.5 rounded-xl items-center"
            >
              <Text className="text-white font-poppins-semibold text-base">
                Terapkan Filter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SearchFilterBar;