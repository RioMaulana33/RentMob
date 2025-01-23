import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const CustomDatePicker = ({
  visible,
  onClose,
  value = new Date(),
  onChange,
  minimumDate,
  maximumDate
}) => {
  const currentYear = new Date().getFullYear(); // Get current year
  const [selectedDate, setSelectedDate] = useState(value);
  const [currentMonth, setCurrentMonth] = useState(value.getMonth());
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

  const isSelectedDate = (day) => {
    if (!day.current) return false;
    const date = new Date(currentYear, currentMonth, day.day);
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDateSelect = (day) => {
    if (day.disabled || !day.current) return;
    const newDate = new Date(currentYear, currentMonth, day.day);
    setSelectedDate(newDate);
  };

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    // Previous month days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        disabled: true,
        current: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      days.push({
        day: i,
        disabled: (minimumDate && date < minimumDate) || 
                 (maximumDate && date > maximumDate),
        current: true
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        disabled: true,
        current: false
      });
    }

    return days;
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigateMonth('prev')}>
              <MaterialIcon name="chevron-left" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <TouchableOpacity 
                style={styles.monthYearButton}
              >
                <Text style={styles.monthText}>
                  {MONTHS[currentMonth]}
                </Text>
              </TouchableOpacity>
              
              <View style={[styles.monthYearButton, styles.yearButton]}>
                <Text style={styles.yearText}>
                  {currentYear}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => navigateMonth('next')}>
              <MaterialIcon name="chevron-right" size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendar}>
            {/* Day headers */}
            <View style={styles.weekDays}>
              {DAYS.map(day => (
                <View key={day} style={styles.weekDayContainer}>
                  <Text style={styles.weekDayText}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Calendar days */}
            <View style={styles.daysGrid}>
              {generateCalendarDays().map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    isSelectedDate(day) && styles.selectedDay,
                    day.disabled && styles.disabledDay
                  ]}
                  onPress={() => handleDateSelect(day)}
                  disabled={day.disabled}
                >
                  <Text style={[
                    styles.dayText,
                    isSelectedDate(day) && styles.selectedDayText,
                    !day.current && styles.otherMonthText,
                    day.disabled && styles.disabledDayText
                  ]}>
                    {day.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                onChange(selectedDate);
                onClose();
              }}
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthYearButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  yearButton: {
    marginLeft: 8,
  },
  monthText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1a1a1a',
  },
  yearText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1a1a1a',
  },
  calendar: {
    marginBottom: 16,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDayContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  dayButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#0255d6',
  },
  disabledDay: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#1a1a1a',
  },
  selectedDayText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  otherMonthText: {
    color: '#999',
  },
  disabledDayText: {
    color: '#ccc',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
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
});

export default CustomDatePicker;