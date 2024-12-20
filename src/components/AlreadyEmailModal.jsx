import React from 'react';
import { View, Text, Modal, Image } from 'react-native';

const AlreadyEmailModal = ({ isVisible, message, onClose }) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
    >
      <View 
      className="flex-1 bg-black/50 justify-center items-center"
      >
        <View 
         className="bg-white rounded-2xl p-6 w-10/12 max-w-md shadow-lg"
        >
          <Image 
            source={require('../assets/image/already-vector.png')} 
            style={{ 
              width: 100, 
              height: 100, 
              marginBottom: 20 
            }} 
            resizeMode="contain"
          />
          
          <Text 
            style={{ 
              fontSize: 16, 
              fontFamily: 'Poppins-SemiBold', 
              textAlign: 'center' 
            }}
          >
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default AlreadyEmailModal;