import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

const HomeScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

const fetchRestaurants = async () => {
  setLoading(true);

  const { data, error } = await supabase
    .from('restaurants')
    .select('id,name,image_url,rating')
    .eq('is_recommended', true)
    .order('rating', { ascending: false });

  if (error) {
    console.log(error.message);
    Alert.alert('Error', 'โหลดข้อมูลไม่สำเร็จ');
  } else {
    console.log('restaurants:', JSON.stringify(data, null, 2)); // เพิ่มตรงนี้
    setRestaurants(data);
  }

  setLoading(false);
};


  // ✅ Loading เต็มจอ
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff3030" />
      </View>
    );
  }

  // ✅ Card
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.featuredCard}
      onPress={() => navigation.navigate('Booking', { restaurant: item })}
    >
      <Image 
        source={{ uri: item.image_url || 'https://via.placeholder.com/300' }}
        style={styles.featuredImage}
      />

      <View style={styles.overlay}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>RECOMMENDED</Text>
        </View>

        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#ff3030" />
          <Text style={styles.rating}>
            {item.rating ? item.rating.toFixed(1) : 'N/A'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}

        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={20} color="#ff3030" />
                <Text style={styles.locationText}>กรุงเทพมหานคร</Text>
              </View>

              <TouchableOpacity style={styles.notiBtn}>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <View style={styles.titleBox}>
              <Text style={styles.title}>
                ค้นหาร้านโปรด{"\n"}ของคุณ
              </Text>
            </View>

            {/* Search */}
            <TouchableOpacity 
              style={styles.searchWrap}
              onPress={() => navigation.navigate('Search')}
            >
              <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color="#666" />
                <Text style={styles.searchText}>
                  ชื่อร้าน หรือประเภทอาหาร...
                </Text>
              </View>
            </TouchableOpacity>

            {/* Section */}
            <View style={styles.section}>
              <Text style={styles.sectionText}>แนะนำสำหรับคุณ</Text>
            </View>
          </>
        }
      />

      {/* Bottom Tab */}
      <View style={styles.tab}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#ff3030" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color="#666" />
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

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center'
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  locationText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600'
  },

  notiBtn: {
    backgroundColor: '#1c1c1e',
    padding: 8,
    borderRadius: 10
  },

  titleBox: {
    paddingHorizontal: 20,
    marginTop: 30
  },

  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold'
  },

  searchWrap: {
    paddingHorizontal: 20,
    marginTop: 20
  },

  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center'
  },

  searchText: {
    color: '#666',
    marginLeft: 10
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 15
  },

  sectionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },

  featuredCard: {
    marginHorizontal: 20,
    height: 250,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20
  },

  featuredImage: {
    width: '100%',
    height: '100%'
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },

  badge: {
    backgroundColor: '#ff3030',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 8
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },

  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold'
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },

  rating: {
    color: '#fff',
    marginLeft: 5
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