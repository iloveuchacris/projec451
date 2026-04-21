import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, 
  StatusBar, Platform, ActivityIndicator, FlatList 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { supabase } from '../data/supabase';

export default function BookingRasScreen({ route, navigation }) {
  const { restaurantId } = route.params || {};
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dates, setDates] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateDates();
  }, []);

  useEffect(() => {
    if (restaurantId) {
      fetchBookings();
    }
  }, [restaurantId, selectedDate]);

  const generateDates = () => {
    const dateArray = [];
    for (let i = 0; i < 15; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dateArray.push(d.toISOString().split('T')[0]);
    }
    setDates(dateArray);
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      
      // ✅ กรองเฉพาะรายการที่ลูกค้าจอง (user_id ไม่เป็น null)
      // ✅ ใช้ profiles!left เพื่อป้องกัน Error กรณี Relationship ยังไม่สมบูรณ์
      const { data, error } = await supabase
        .from('reservations') 
        .select(`
          *,
          profiles(full_name) 
        `)
        .eq('restaurant_id', restaurantId)
        .eq('booking_date', selectedDate)
        .not('user_id', 'is', null) // 🔥 กรองเอาเฉพาะลูกค้าที่จองผ่านแอปเท่านั้น
        .order('booking_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.log("Fetch Booking Error:", error.message);
      // หากยังมีปัญหาเรื่อง Join ให้ดึงแบบง่ายมาเช็คก่อน
      fetchBookingsSimple(); 
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookingsSimple = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('booking_date', selectedDate)
        .not('user_id', 'is', null) // 🔥 กรองเอาเฉพาะลูกค้า
        .order('booking_time', { ascending: true });
      
      if (!error) setBookings(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const updateBookingStatus = async (item, newStatus) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus }) 
        .eq('id', item.id);

      if (error) throw error;

      if (newStatus === 'SEATED' && item.table_id) {
        await supabase
          .from('restaurant_tables')
          .update({ status: 'occupied' })
          .eq('id', item.table_id);
      }
      
      Alert.alert("สำเร็จ", `เปลี่ยนสถานะเป็น ${newStatus} แล้ว`);
      fetchBookings(); 
    } catch (error) {
      Alert.alert("Error", error.message || "ไม่สามารถอัปเดตสถานะได้");
    } finally {
      setIsLoading(false);
    }
  };

  const renderDateItem = ({ item }) => {
    const dateObj = new Date(item);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = dateObj.getDate();
    const isSelected = selectedDate === item;

    return (
      <TouchableOpacity 
        style={[styles.dateCard, isSelected && styles.dateCardActive]}
        onPress={() => setSelectedDate(item)}
      >
        <Text style={[styles.dateDay, isSelected && styles.textWhite]}>{dayName}</Text>
        <Text style={[styles.dateNum, isSelected && styles.textWhite]}>{dayNum}</Text>
        {isSelected && <View style={styles.activeDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Customer Bookings</Text>
          <Text style={styles.headerSub}>
            {new Date(selectedDate).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
          </Text>
        </View>

        <View style={styles.dateSelectorContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={dates}
            keyExtractor={(item) => item}
            renderItem={renderDateItem}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#FF3030" style={{ marginTop: 50 }} />
          ) : bookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="calendar-remove" size={60} color="#333" />
              <Text style={styles.emptyText}>ไม่มีการจองจากลูกค้าสำหรับวันนี้</Text>
            </View>
          ) : (
            bookings.map((item) => {
              // ดัก Null ป้องกันแอปเด้ง
              const displayTime = item.booking_time ? item.booking_time.slice(0, 5) : "00:00";
              const displayUser = item.user_id ? item.user_id.slice(0, 8) : "GUEST";
              const customerName = item.profiles?.full_name || `Customer (${displayUser})`;

              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.timeContainer}>
                      <MaterialCommunityIcons name="clock-outline" size={16} color="#FF3030" />
                      <Text style={styles.bookingTime}>{displayTime} น.</Text>
                    </View>
                    
                    <View style={[styles.statusBadge, 
                      item.status === 'PENDING' ? styles.bgPending : 
                      item.status === 'CONFIRMED' ? styles.bgConfirmed : styles.bgSeated]}>
                      <Text style={[styles.statusText, 
                        item.status === 'PENDING' ? styles.textPending : 
                        item.status === 'CONFIRMED' ? styles.textConfirmed : styles.textSeated]}>
                        {(item.status || 'UNKNOWN').toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>{customerName}</Text>
                    <Text style={styles.guestsText}>
                      <MaterialCommunityIcons name="table-chair" size={14} /> โต๊ะ: {item.table_id || 'ยังไม่ระบุ'} | 
                      <MaterialCommunityIcons name="account-group" size={14} /> {item.people_count || 0} ท่าน
                    </Text>
                  </View>

                  <View style={styles.actionRow}>
                    {item.status === 'PENDING' && (
                      <TouchableOpacity style={styles.btnAccept} onPress={() => updateBookingStatus(item, 'CONFIRMED')}>
                        <Text style={styles.btnTextWhite}>ยืนยันการจอง (ACCEPT)</Text>
                      </TouchableOpacity>
                    )}

                    {item.status === 'CONFIRMED' && (
                      <TouchableOpacity style={styles.btnArrived} onPress={() => updateBookingStatus(item, 'SEATED')}>
                        <Text style={styles.btnTextArrived}>ลูกค้ามาถึงแล้ว (MARK ARRIVED)</Text>
                      </TouchableOpacity>
                    )}

                    {item.status === 'SEATED' && (
                      <View style={styles.seatedBadge}>
                        <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                        <Text style={styles.seatedText}>ลูกค้าเข้าใช้บริการเรียบร้อยแล้ว</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>

      <View style={styles.customTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('HomeRas', { restaurantId })}>
          <MaterialCommunityIcons name="view-dashboard" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} activeOpacity={1}>
          <MaterialCommunityIcons name="calendar-check" size={28} color="#FF3030" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('MenuRas', { restaurantId })}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('SettingRas', { restaurantId })}>
          <MaterialCommunityIcons name="cog" size={28} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... styles เหมือนเดิม ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 25, paddingTop: 10 },
  headerTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  headerSub: { color: '#888', fontSize: 16, marginTop: 5 },
  dateSelectorContainer: { marginVertical: 20 },
  dateCard: { width: 60, height: 80, backgroundColor: '#111', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#222' },
  dateCardActive: { backgroundColor: '#FF3030', borderColor: '#FF3030' },
  dateDay: { color: '#666', fontSize: 12, fontWeight: '600' },
  dateNum: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  activeDot: { width: 5, height: 5, backgroundColor: '#FFF', borderRadius: 2.5, marginTop: 5 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { backgroundColor: '#111', borderRadius: 20, padding: 18, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#FF3030' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  timeContainer: { flexDirection: 'row', alignItems: 'center' },
  bookingTime: { color: '#FF3030', fontWeight: 'bold', fontSize: 16, marginLeft: 5 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  bgPending: { backgroundColor: 'rgba(255, 193, 7, 0.1)' },
  textPending: { color: '#FFC107', fontSize: 10, fontWeight: 'bold' },
  bgConfirmed: { backgroundColor: 'rgba(33, 150, 243, 0.1)' },
  textConfirmed: { color: '#2196F3', fontSize: 10, fontWeight: 'bold' },
  bgSeated: { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
  textSeated: { color: '#4CAF50', fontSize: 10, fontWeight: 'bold' },
  customerInfo: { marginBottom: 15 },
  customerName: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  guestsText: { color: '#888', fontSize: 13, marginTop: 4 },
  actionRow: { borderTopWidth: 1, borderTopColor: '#222', paddingTop: 15 },
  btnAccept: { backgroundColor: '#FF3030', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnArrived: { borderWidth: 1, borderColor: '#FF3030', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnTextWhite: { color: '#FFF', fontWeight: 'bold' },
  btnTextArrived: { color: '#FF3030', fontWeight: 'bold' },
  seatedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  seatedText: { color: '#4CAF50', marginLeft: 8, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#444', marginTop: 10 },
  textWhite: { color: '#FFF' },
  customTabBar: { flexDirection: 'row', backgroundColor: '#000', height: 65, borderTopWidth: 1, borderTopColor: '#1A1A1A', position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'space-around', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 15 : 0 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
});