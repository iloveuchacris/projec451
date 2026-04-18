import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const RestaurantCard = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: restaurant.image || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      
      {/* ✅ เปลี่ยนจาก <div> เป็น <View> */}
      <View style={styles.info}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.details}>{restaurant.type} • {restaurant.rating} ⭐</Text>
        <Text style={styles.location}>{restaurant.location}</Text>
      </View>
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    // shadow สำหรับ Android
    elevation: 3, 
    // shadow สำหรับ iOS
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#FF4757',
    marginVertical: 4,
  },
  location: {
    fontSize: 12,
    color: '#999',
  },
});

export default RestaurantCard;