import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions  } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const PusatBantuan = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const FlowSection = ({ title, icon, content, color, warning }) => (
    <View className="bg-white rounded-lg mt-3 p-4">
      <View className="flex-row items-center mb-3">
        <View className={`w-10 h-10 rounded-full items-center justify-center`}
          style={{ backgroundColor: `${color}15` }}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text className="font-poppins-semibold text-[16px] text-gray-800 ml-3.5">
          {title}
        </Text>
      </View>
      <View className={`${warning ? 'bg-red-50' : 'bg-gray-50'} rounded-lg p-3.5`}>
        {content.map((item, index) => (
          <View key={index} className="flex-row items-start mb-2.5 last:mb-0">
            <View className={`w-1.5 h-1.5 rounded-full ${warning ? 'bg-red-400' : 'bg-gray-400'} mt-2 mr-2.5`} />
            <Text className={`font-poppins-regular text-[14px] ${warning ? 'text-red-600' : 'text-gray-600'} leading-5 flex-1`}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const sections = [
    {
      title: "Persyaratan Lepas Kunci",
      icon: "document-text",
      color: "#EF4444",
      warning: true,
      content: [
        "KTP asli yang masih berlaku",
        "SIM A aktif dan masih berlaku",
        "Dokumen asli akan diverifikasi saat pengambilan mobil",
        "Tidak dapat diwakilkan saat pengambilan"
      ]
    },
    {
      title: "Cara Menyewa Mobil",
      icon: "car",
      color: "#0372f5",
      content: [
        "Pilih mobil dan tekan tombol 'Sewa'",
        "Login/register jika belum memiliki akun",
        "Isi formulir tanggal sewa dan opsi lepas kunci/sopir",
        "Pilih metode pembayaran dan selesaikan transaksi"
      ]
    },
    {
      title: "Proses Penyewaan",
      icon: "checkmark-circle",
      color: "#10B981",
      content: [
        "Tunggu konfirmasi setelah pembayaran berhasil",
        "Terima detail mobil dan informasi durasi sewa",
        "Ambil mobil sesuai waktu dan lokasi yang disepakati",
        "Kembalikan mobil tepat waktu ke tempat rental"
      ]
    },
    {
      title: "Informasi Penting",
      icon: "alert-circle",
      color: "#F59E0B",
      content: [
        "Siapkan dokumen lengkap untuk pengambilan mobil",
        "Perhatikan batas waktu pengembalian untuk menghindari denda",
        "Segera laporkan jika terjadi kerusakan atau kecelakaan",
        "Pantau riwayat sewa melalui menu 'My Rent'"
      ]
    }
  ];

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
            Pusat Bantuan
          </Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 20
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-blue-50 rounded-lg p-4 mb-2">
          <View className="flex-row items-center">
            <Ionicons name="information-circle" size={22} color="#0372f5" />
            <Text className="font-poppins-medium text-[15px] text-blue-600 ml-2.5">
              Panduan Rental Mobil
            </Text>
          </View>
          <Text className="font-poppins-regular text-[13px] text-blue-600/80 mt-1 leading-5">
            Ikuti langkah-langkah berikut untuk menyewa mobil dengan mudah dan aman
          </Text>
        </View>

        {sections.map((section, index) => (
          <FlowSection key={index} {...section} />
        ))}
      </ScrollView>
    </View>
  );
};

export default PusatBantuan;