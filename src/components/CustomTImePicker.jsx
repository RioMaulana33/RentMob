import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  FlatList
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const CustomTimePicker = ({
  visible,
  onClose,
  value = new Date(),
  onChange,
  is24Hour = true,
  minuteInterval = 30,
  selectedDate = new Date() // Tambah prop untuk tanggal yang dipilih
}) => {
  const [selectedTime, setSelectedTime] = useState(value);
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);

  // Fungsi yang sebelumnya hilang
  const isTimeEqual = (time1, time2) => {
    return time1.getHours() === time2.getHours() && 
           time1.getMinutes() === time2.getMinutes();
  };

  // Fungsi untuk mengecek apakah waktu valid berdasarkan aturan
  const isTimeValid = (time) => {
    // If the selected date is not today, all times are valid
    if (!isToday(selectedDate)) {
      return true;
    }
    
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    
    // Jam 1 malam (01:00) hingga jam 4:30 tidak tersedia hanya untuk hari ini
    if (timeInMinutes >= 60 && timeInMinutes < 270) {
      return false;
    }
  
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Waktu yang sudah lewat tidak bisa dipilih
    if (timeInMinutes < currentTimeInMinutes) {
      return false;
    }
  
    return true;
  };

  // Helper function untuk mengecek apakah tanggal yang dipilih adalah hari ini
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += minuteInterval) {
        const time = new Date();
        time.setHours(hour, minute, 0);
        
        // Hanya tambahkan slot waktu jika valid
        if (isTimeValid(time)) {
          const formattedHour = is24Hour ? hour : (hour % 12 || 12);
          const period = hour < 12 ? 'AM' : 'PM';
          const formattedTime = is24Hour
            ? `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
            : `${formattedHour}:${String(minute).padStart(2, '0')} ${period}`;

          slots.push({
            time: time,
            display: formattedTime
          });
        }
      }
    }
    return slots;
  };

  const renderTimeSlot = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        isTimeEqual(item.time, selectedTime) && styles.selectedTimeSlot,
        !isTimeValid(item.time) && styles.disabledTimeSlot
      ]}
      onPress={() => isTimeValid(item.time) && setSelectedTime(item.time)}
      disabled={!isTimeValid(item.time)}
    >
      <Text style={[
        styles.timeText,
        isTimeEqual(item.time, selectedTime) && styles.selectedTimeText,
        !isTimeValid(item.time) && styles.disabledTimeText
      ]}>
        {item.display}
      </Text>
    </TouchableOpacity>
  );

  const handleConfirm = () => {
    onChange(selectedTime);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Select Time</Text>
            <Text style={styles.selectedTimeDisplay}>
              {selectedTime.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: !is24Hour
              })}
            </Text>
          </View>

          <View style={styles.timeList}>
            <FlatList
              data={generateTimeSlots()}
              renderItem={renderTimeSlot}
              keyExtractor={(item) => item.display}
              showsVerticalScrollIndicator={false}
              initialScrollOffset={
                (selectedTime.getHours() * (60 / minuteInterval) + 
                Math.floor(selectedTime.getMinutes() / minuteInterval)) * 56
              }
              getItemLayout={(data, index) => ({
                length: 56,
                offset: 56 * index,
                index,
              })}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxWidth: 360,
    maxHeight: '80%',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  selectedTimeDisplay: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#0255d6',
  },
  timeList: {
    maxHeight: 400,
    paddingVertical: 8,
  },
  timeSlot: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  selectedTimeSlot: {
    backgroundColor: '#0255d6',
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  selectedTimeText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  confirmButtonText: {
    color: '#0255d6',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  disabledTimeSlot: {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  disabledTimeText: {
    color: '#999',
  },
});

export default CustomTimePicker;