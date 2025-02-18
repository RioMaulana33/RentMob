import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from '../libs/axios';
import Modal from 'react-native-modal';

const MapLocationPicker = ({ 
  onLocationSelect, 
  initialLatitude,
  initialLongitude,
  kotaId,
  deliveryRate, 
  onAddressSelect  
}) => {
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(0);
  const [kotaDetails, setKotaDetails] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const webViewRef = useRef(null);
  const fullscreenWebViewRef = useRef(null);

  useEffect(() => {
    const fetchKotaDetails = async () => {
      try {
        const response = await axios.get(`/kota/get`);
        const selectedKota = response.data.data.find(kota => kota.id === kotaId);
        
        if (!selectedKota) {
          throw new Error('Kota not found');
        }
        
        setKotaDetails(selectedKota);
      } catch (error) {
        console.error('Error fetching kota details:', error);
        setMapError('Failed to load location data');
      } finally {
        setLoading(false);
      }
    };

    if (kotaId) {
      fetchKotaDetails();
    }
  }, [kotaId]);

  // Function to update marker on map
  const updateMapMarker = (location) => {
    const script = `
      if (deliveryMarker) {
        map.removeLayer(deliveryMarker);
      }
      if (deliveryLine) {
        map.removeLayer(deliveryLine);
      }
      
      deliveryMarker = L.marker([${location.latitude}, ${location.longitude}], {
        title: 'Lokasi Pengantaran'
      }).addTo(map);
      
      deliveryLine = L.polyline([
        [${kotaDetails?.latitude}, ${kotaDetails?.longitude}],
        [${location.latitude}, ${location.longitude}]
      ], {
        color: '#0255d6',
        weight: 3,
        opacity: 0.5,
        dashArray: '10, 10'
      }).addTo(map);

      const distance = calculateDistance(
        ${kotaDetails?.latitude},
        ${kotaDetails?.longitude},
        ${location.latitude},
        ${location.longitude}
      );

      // Perform reverse geocoding using Nominatim
      fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&addressdetails=1\`)
        .then(response => response.json())
        .then(data => {
          const address = data.display_name;
          window.ReactNativeWebView.postMessage(JSON.stringify({
            latitude: ${location.latitude},
            longitude: ${location.longitude},
            distance: distance,
            address: address
          }));
          
          deliveryMarker.bindPopup(
            '<div class="custom-popup">' +
            '<strong>Lokasi Pengantaran</strong><br>' +
            '<small>' + address + '</small><br>' +
            '<small>Jarak: ' + distance.toFixed(1) + ' km</small>' +
            '</div>'
          ).openPopup();
        });

      map.fitBounds(deliveryLine.getBounds(), { padding: [50, 50] });
    `;

    webViewRef.current?.injectJavaScript(script);
    if (isMapFullscreen) {
      fullscreenWebViewRef.current?.injectJavaScript(script);
    }
  };

  // Effect to restore marker when toggling fullscreen
  useEffect(() => {
    if (selectedLocation) {
      setTimeout(() => {
        updateMapMarker(selectedLocation);
      }, 500);
    }
  }, [isMapFullscreen]);

  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    const { latitude, longitude, distance, address } = data;
    
    setSelectedLocation({ latitude, longitude });
    setDistance(distance);
    
    onLocationSelect({
      latitude,
      longitude,
      distance,
      deliveryCost: Math.ceil(distance) * deliveryRate
    });
    
    if (address && onAddressSelect) {
      onAddressSelect(address);
    }
  };

  if (loading) {
    return (
      <View className="w-full h-[300px] rounded-xl bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0255d6" />
      </View>
    );
  }

  if (mapError) {
    return (
      <View className="w-full h-[300px] rounded-xl bg-white justify-center items-center">
        <Text className="text-red-500">{mapError}</Text>
      </View>
    );
  }

  const rentalLat = kotaDetails?.latitude || initialLatitude;
  const rentalLng = kotaDetails?.longitude || initialLongitude;

  if (!rentalLat || !rentalLng) {
    return (
      <View className="w-full h-[300px] rounded-xl bg-white justify-center items-center">
        <Text className="text-red-500 font-poppins-medium">Lokasi Kota tidak ditemukan</Text>
      </View>
    );
  }

  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
          .custom-popup { text-align: center; }
          .leaflet-control-zoom {
            margin-top: ${isMapFullscreen ? '60px' : '10px'} !important;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          let deliveryMarker;
          let deliveryLine;

          const map = L.map('map', {
            zoomControl: true,
            scrollWheelZoom: true,
            dragging: true,
            touchZoom: true,
            doubleClickZoom: true,
            boxZoom: true
          }).setView([${rentalLat}, ${rentalLng}], 13);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          const rentalIcon = L.divIcon({
            html: '<div style="background-color: #0255d6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
            className: 'custom-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          const rentalMarker = L.marker([${rentalLat}, ${rentalLng}], {
            icon: rentalIcon,
            title: "${kotaDetails?.nama || 'Lokasi Rental'}"
          }).addTo(map);
          
          rentalMarker.bindPopup(
            '<div class="custom-popup">' +
            '<strong>${kotaDetails?.nama || 'Lokasi Rental'}</strong><br>' +
            '<small>Lokasi Rental</small>' +
            '</div>'
          ).openPopup();

          map.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            if (deliveryMarker) {
              map.removeLayer(deliveryMarker);
            }
            
            if (deliveryLine) {
              map.removeLayer(deliveryLine);
            }
            
            deliveryMarker = L.marker([lat, lng], {
              title: 'Lokasi Pengantaran'
            }).addTo(map);
            
            deliveryLine = L.polyline([
              [${rentalLat}, ${rentalLng}],
              [lat, lng]
            ], {
              color: '#0255d6',
              weight: 3,
              opacity: 0.5,
              dashArray: '10, 10'
            }).addTo(map);

            const distance = calculateDistance(
              ${rentalLat},
              ${rentalLng},
              lat,
              lng
            );

            deliveryMarker.bindPopup(
              '<div class="custom-popup">' +
              '<strong>Lokasi Pengantaran</strong><br>' +
              '<small>Jarak: ' + distance.toFixed(1) + ' km</small>' +
              '</div>'
            ).openPopup();

            window.ReactNativeWebView.postMessage(JSON.stringify({
              latitude: lat,
              longitude: lng,
              distance: distance
            }));
          });

          function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371;
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) *
              Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View className="w-full rounded-xl overflow-hidden">
      <TouchableOpacity 
        className="w-full h-[300px] rounded-xl overflow-hidden relative"
        onPress={() => setIsMapFullscreen(true)}
      >
        <WebView
          ref={webViewRef}
          source={{ html: mapHTML }}
          onMessage={handleMessage}
          scrollEnabled={false}
          className="rounded-xl"
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            setMapError('Failed to load map');
          }}
        />
        <View className="absolute top-3 right-3 w-3/4 bg-white rounded-lg p-3 flex-row items-center shadow-sm">
          <MaterialIcons name="zoom-in" size={20} color="#6B7280" />
          <Text className="text-gray-400 ml-2 font-poppins-regular text-sm">Ketuk untuk membuka peta lengkap...</Text>
        </View>
      </TouchableOpacity>
      
      {distance > 0 && (
        <View className="bg-blue-50 p-3 mt-2 rounded-lg flex-row items-center">
          <MaterialIcon name="map-marker-distance" size={20} color="#0255d6" />
          <Text className="text-blue-600 font-poppins-medium ml-2">
            Jarak: {distance.toFixed(1)} km
          </Text>
        </View>
      )}

      <Modal
        isVisible={isMapFullscreen}
        style={{ margin: 0 }}
        onBackdropPress={() => setIsMapFullscreen(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
      >
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View className="bg-white py-4 px-4 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => setIsMapFullscreen(false)}
              className="p-2"
            >
              <MaterialIcon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-poppins-semibold text-black">Pilih Lokasi</Text>
            <View style={{ width: 40 }} />
          </View>
          <WebView
            ref={fullscreenWebViewRef}
            source={{ html: mapHTML }}
            onMessage={handleMessage}
            scrollEnabled={true}
            style={{ flex: 1 }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
              setMapError('Failed to load map');
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default MapLocationPicker;