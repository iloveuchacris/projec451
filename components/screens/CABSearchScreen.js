import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../data/supabase';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 ดึงข้อมูลจาก database
  const fetchRestaurants = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('restaurants')
        .select('*');

      if (error) {
        console.log('ERROR:', error);
        return;
      }

      setRestaurants(data || []);

    } catch (err) {
      console.log('CATCH:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 🔍 search filter
  const filteredRestaurants = restaurants.filter(item => {
    const text = searchQuery.toLowerCase();

    return (
      item.name?.toLowerCase().includes(text) ||
      item.category?.toLowerCase().includes(text) ||
      item.location?.toLowerCase().includes(text)
    );
  });

  // loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ff3030" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ค้นหา</Text>

        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#666" />

          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาร้านอาหาร"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery
              ? `ผลการค้นหา (${filteredRestaurants.length})`
              : 'ร้านทั้งหมด'}
          </Text>

          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.recommendCard}
                onPress={() =>
                  navigation.navigate('Booking', { restaurant: item })
                }
              >

                <Image
                  source={{ uri: item.image_url }}
                  style={styles.recommendImage}
                />

                <View style={styles.recommendInfo}>
                  <Text style={styles.recommendName}>
                    {item.name}
                  </Text>

                  <Text style={styles.recommendSub}>
                    {item.category} • {item.location}
                  </Text>

                  <Text style={styles.ratingText}>
                    ⭐ {item.rating}
                  </Text>
                </View>

              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.notFoundContainer}>
              <Ionicons name="search-outline" size={60} color="#333" />
              <Text style={styles.notFoundText}>
                ไม่พบร้านอาหาร
              </Text>
            </View>
          )}

        </View>

      </ScrollView>
      {/* Bottom Tab */}
      <View style={styles.tab}>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Ionicons name="home" size={24} color="#666" />
              </TouchableOpacity>
      
              <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                <Ionicons name="search" size={24} color="#ff3030" />
              </TouchableOpacity>
      
              <TouchableOpacity onPress={() => navigation.navigate('MyBookings')}> 
                <Ionicons name="calendar" size={24} color="#666" />
              </TouchableOpacity>
      
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="person" size={24} color="#666" />
              </TouchableOpacity>
            </View>
      
      

    </SafeAreaView>
  );
};

export default SearchScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },

  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  recommendCard: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
  },

  recommendImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: '#333',
  },

  recommendInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },

  recommendName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  recommendSub: {
    color: '#999',
    fontSize: 13,
    marginTop: 4,
  },

  ratingText: {
    color: '#fff',
    marginTop: 6,
    fontSize: 13,
    fontWeight: 'bold',
  },

  notFoundContainer: {
    alignItems: 'center',
    marginTop: 60,
  },

  notFoundText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
  },

  tab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#333'
  }
});