import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MyBookingsScreen = ({ route, navigation }) => {
  // 1. กำหนด State เป็นค่าว่าง (Empty Array) เพื่อให้หน้าว่างในตอนเริ่มต้น
  const [bookings, setBookings] = useState([]);

  // 2. รับข้อมูลการจองใหม่จาก BookingSuccessScreen ผ่านการ Navigation
  useEffect(() => {
    if (route.params?.newBooking) {
      const { newBooking } = route.params;
      
      setBookings((prev) => {
        // ตรวจสอบเพื่อป้องกันข้อมูลซ้ำจากรหัสการจอง (bookingID)
        const isExist = prev.some(b => b.bookingID === newBooking.bookingID);
        if (isExist) return prev;
        
        // เพิ่มข้อมูลการจองใหม่ไว้ด้านบนสุด
        return [newBooking, ...prev];
      });
    }
  }, [route.params?.newBooking]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>รายการจองของฉัน</Text>
      </View>

      {/* 3. เงื่อนไขการแสดงผล: ถ้าไม่มีข้อมูลการจองให้แสดงหน้าว่าง หรือไอคอนแจ้งเตือน */}
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color="#1c1c1e" />
          <Text style={styles.emptyText}>คุณยังไม่มีรายการจองในขณะนี้</Text>
          <TouchableOpacity 
            style={styles.bookNowButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.bookNowText}>ค้นหาร้านอาหาร</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 4. ถ้ามีข้อมูลการจอง ให้แสดงรายการ Card ตามดีไซน์
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {bookings.map((item) => (
            <View 
              key={item.bookingID} 
              style={[
                styles.bookingCard, 
                item.status === 'เร็วๆ นี้' ? styles.activeCard : styles.pastCard
              ]}
            >
              {/* แถบสถานะด้านบนของการ์ด */}
              <Text style={[
                styles.statusLabel, 
                { color: item.status === 'เร็วๆ นี้' ? '#ff3030' : '#888' }
              ]}>
                {item.status}
              </Text>

              <View style={styles.cardMainContent}>
                <View style={styles.textGroup}>
                  <Text style={styles.restaurantNameText}>{item.restaurantName}</Text>
                  <View style={styles.dateRow}>
                    <Ionicons name="time-outline" size={16} color="#999" />
                    <Text style={styles.dateText}>{item.date} • {item.time}</Text>
                  </View>
                </View>

                {/* ไอคอน QR Code เล็กๆ */}
                {item.status === 'เร็วๆ นี้' && (
                  <View style={styles.smallQRBox}>
                    <Ionicons name="qr-code-outline" size={24} color="#fff" />
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomTab}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="calendar" size={24} color="#ff3030" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 20, paddingTop: 10, marginBottom: 10 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  
  // Empty State Styles
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  emptyText: { color: '#666', fontSize: 16, marginTop: 15, marginBottom: 20 },
  bookNowButton: { backgroundColor: '#1c1c1e', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12 },
  bookNowText: { color: '#ff3030', fontWeight: 'bold' },

  // Card Styles
  bookingCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff3030',
  },
  pastCard: { opacity: 0.6 },
  statusLabel: { fontSize: 13, fontWeight: 'bold', marginBottom: 12 },
  cardMainContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textGroup: { flex: 1 },
  restaurantNameText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  dateText: { color: '#999', marginLeft: 8, fontSize: 15 },
  smallQRBox: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 12,
  },

  // Navigation Tab
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#000',
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
    position: 'absolute',
    bottom: 0, left: 0, right: 0
  }
});

export default MyBookingsScreen;