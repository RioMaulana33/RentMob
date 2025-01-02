import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const Hubungi = ({ navigation }) => {
  const handleEmail = () => {
    Linking.openURL('mailto:blucarra552@gmail.com');
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=YOUR_PHONE_NUMBER');
  };

  const ContactCard = ({ icon, color, title, description, platform, onPress }) => (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3.5 shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      }}
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 mr-4 bg-opacity-10 rounded-full items-center justify-center"
          style={{ backgroundColor: `${color}15` }}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View className="flex-1">
          <Text className="font-poppins-medium text-[15.5px] text-gray-800">
            {title}
          </Text>
          <Text className="font-poppins-regular text-[13px] text-gray-500 mt-0.5">
            {description}
          </Text>
        </View>
        <View className="items-end justify-center ml-2">
          <Text className="font-poppins-regular text-[13px] text-gray-400">
            {platform}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white border-b border-gray-100"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        <View className="px-4 py-3 flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="font-poppins-medium text-[18px] text-gray-800 ml-2 top-0.5">
            Hubungi Kami
          </Text>
        </View>
      </View>

      <View className="px-5 py-5">
        <Text className="font-poppins-semibold text-[16px] text-gray-800 mb-1.5">
          Ada yang bisa kami bantu?
        </Text>
        <Text className="font-poppins-regular text-[13.5px] text-gray-500 leading-[20px]">
          Kami siap membantu menjawab pertanyaan Anda. Pilih metode kontak yang nyaman untuk Anda.
        </Text>
      </View>

      <View className="px-5">
        <ContactCard 
          icon="mail"
          title="Email"
          description="Kirim email"
          platform="blucarra552@gmail.com"
          color="#EA4335"
          onPress={handleEmail}
        />
        
        <ContactCard 
          icon="logo-whatsapp"
          title="WhatsApp"
          description="Respon via chat WhatsApp"
          platform="Chat with Us"
          color="#25D366"
          onPress={handleWhatsApp}
        />
        
        <ContactCard 
          icon="logo-instagram"
          title="Instagram"
          description="Ikuti update terbaru kami"
          platform="@blucarra"
          color="#E4405F"
          onPress={() => Linking.openURL('https://instagram.com/blucarra')}
        />
        
        <ContactCard 
          icon="logo-facebook"
          title="Facebook"
          description="Bergabung dengan komunitas kami"
          platform="BluCarra"
          color="#1877F2"
          onPress={() => Linking.openURL('https://facebook.com/blucarra')}
        />
      </View>
    </View>
  );
};

export default Hubungi;