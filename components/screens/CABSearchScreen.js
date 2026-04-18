import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ✅ 1. ดึงข้อมูลร้านอาหารมาจากไฟล์ Data
import { RESTAURANTS } from '../data/restaurants'; 

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ 2. ระบบค้นหา: กรองข้อมูลจาก RESTAURANTS ตามชื่อร้าน หรือ ประเภทอาหาร
  const filteredRestaurants = RESTAURANTS.filter(item => {
    const itemData = `${item.name.toUpperCase()} ${item.category?.toUpperCase()}`;
    const textData = searchQuery.toUpperCase();
    return itemData.indexOf(textData) > -1;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* ส่วนหัวและช่องค้นหา */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ค้นหา</Text>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาร้านอาหาร หรือประเภทอาหาร"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            autoFocus={true} // ให้คีย์บอร์ดเด้งขึ้นมาทันทีเมื่อเข้าหน้านี้
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* ส่วนแสดงผลลัพธ์การค้นหา */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `ผลการค้นหา (${filteredRestaurants.length})` : 'แนะนำสำหรับคุณ'}
          </Text>
          
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.recommendCard}
                onPress={() => navigation.navigate('Booking', { restaurant: item })}
              >
                <Image 
                  source={item.image} 
                  style={styles.recommendImage} 
                />
                <View style={styles.recommendInfo}>
                  <View style={styles.recommendHeaderRow}>
                    <Text style={styles.recommendName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={14} color="#ff3030" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.recommendSub}>{item.category} • {item.location}</Text>
                  <Text style={styles.recommendDistance}>
                    <Ionicons name="location" size={12} color="#666" /> 1.2 กม.
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.notFoundContainer}>
              <Ionicons name="search-outline" size={80} color="#1c1c1e" />
              <Text style={styles.notFoundText}>ไม่พบร้านที่คุณค้นหา</Text>
            </View>
          )}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Tab (เพื่อความต่อเนื่องในการใช้งาน) */}
      <View style={styles.bottomTab}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color="#ff3030" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="calendar" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#fff', fontSize: 16 },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  recommendCard: { flexDirection: 'row', backgroundColor: '#1c1c1e', borderRadius: 20, padding: 12, marginBottom: 15 },
  recommendImage: { width: 90, height: 90, borderRadius: 15 },
  recommendInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  recommendHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recommendName: { color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: '#fff', marginLeft: 4, fontWeight: 'bold' },
  recommendSub: { color: '#999', fontSize: 13, marginVertical: 4 },
  recommendDistance: { color: '#666', fontSize: 12 },
  notFoundContainer: { alignItems: 'center', marginTop: 50 },
  notFoundText: { color: '#666', fontSize: 16, marginTop: 10 },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#000',
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
  }
});

export default SearchScreen;