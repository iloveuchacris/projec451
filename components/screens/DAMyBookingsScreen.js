import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

const MyBookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('reservations')
          .select(`
            id,
            booking_date,
            booking_time,
            status,
            table_id,
            restaurants (
              name
            )
          `)
          .eq('user_id', user.id)
          .order('booking_date', { ascending: false });

        if (error) throw error;

        const now = new Date();
        const validBookings = [];

        // วนลูปเช็คเงื่อนไขเวลาของแต่ละรายการ
        for (let item of data) {
          const bookingDateTime = new Date(`${item.booking_date}T${item.booking_time}`);
          const diffInMinutes = (now - bookingDateTime) / (1000 * 60);

          if (diffInMinutes > 60) {
            // ❌ เกิน 1 ชม. -> ลบออกจาก Database
            await supabase.from('reservations').delete().eq('id', item.id);
          } else {
            // ✅ ยังไม่ถึง 1 ชม. -> เก็บไว้แสดงผล (รวมถึงพวกที่เกิน 15 นาทีด้วย)
            validBookings.push(item);
          }
        }
        
        setBookings(validBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  const renderItem = ({ item }) => {
    // คำนวณสถานะ 15 นาทีเพื่อแสดงผล UI
    const now = new Date();
    const bookingDateTime = new Date(`${item.booking_date}T${item.booking_time}`);
    const diffInMinutes = (now - bookingDateTime) / (1000 * 60);
    const isExpired = diffInMinutes > 15;

    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => {
          if (isExpired) {
            Alert.alert('บัตรหมดอายุ', 'การจองนี้เกินกำหนดเวลา 15 นาที ไม่สามารถใช้งานได้');
          } else {
            navigation.navigate('Checkin', { bookingId: item.id });
          }
        }}
      >
        <View style={[styles.card, isExpired && styles.expiredCard]}>
          <View style={[styles.leftIndicator, isExpired && styles.expiredIndicator]} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={[styles.statusText, isExpired && styles.expiredText]}>
                {isExpired ? 'หมดอายุ' : 'ใช้งานได้'}
              </Text>
              <Ionicons 
                name={isExpired ? "close-circle-outline" : "qr-code-outline"} 
                size={24} 
                color={isExpired ? "#666" : "#fff"} 
              />
            </View>
            
            <Text style={[styles.restaurantName, isExpired && styles.expiredText]}>
              {item.restaurants?.name || 'ไม่ระบุชื่อร้าน'}
            </Text>
            
            <View style={styles.dateTimeRow}>
              <Ionicons name="calendar-outline" size={16} color={isExpired ? "#444" : "#888"} />
              <Text style={[styles.dateTimeText, isExpired && styles.expiredSubText]}>
                {formatDate(item.booking_date)} • {item.booking_time.slice(0, 5)} น.
                {item.table_id ? ` • Table ${item.table_id}` : ''}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>การจองของฉัน</Text>
        <TouchableOpacity onPress={fetchMyBookings} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={24} color="#ff3030" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#ff3030" style={{ flex: 1 }} />
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-clear-outline" size={80} color="#333" />
          <Text style={styles.emptyText}>ยังไม่มีรายการจอง</Text>
        </View>
      )}

      {/* Bottom Tab Navigation */}
      <View style={styles.tab}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MyBookings')}> 
          <Ionicons name="calendar" size={24} color="#ff3030" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyBookingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 },
  headerTitle: { 
    color: '#fff', fontSize: 28, fontWeight: 'bold', 
    paddingHorizontal: 20, paddingVertical: 15, marginTop: 10 
  },
  refreshBtn: { marginTop: 10 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 120 },
  card: {
    backgroundColor: '#1c1c1e', borderRadius: 15, flexDirection: 'row',
    marginBottom: 15, overflow: 'hidden', height: 120,
  },
  expiredCard: { backgroundColor: '#111', opacity: 0.8 },
  leftIndicator: { width: 5, backgroundColor: '#ff3030' },
  expiredIndicator: { backgroundColor: '#444' },
  cardContent: { flex: 1, padding: 15, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusText: { color: '#ff3030', fontSize: 14, fontWeight: '600' },
  expiredText: { color: '#666' },
  restaurantName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  dateTimeRow: { flexDirection: 'row', alignItems: 'center' },
  dateTimeText: { color: '#888', fontSize: 14, marginLeft: 8 },
  expiredSubText: { color: '#444' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#555', fontSize: 18, marginTop: 10 },
  tab: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: '#000', flexDirection: 'row', justifyContent: 'space-around', 
    paddingVertical: 15, borderTopWidth: 0.5, borderTopColor: '#333', paddingBottom: 30 
  }
});