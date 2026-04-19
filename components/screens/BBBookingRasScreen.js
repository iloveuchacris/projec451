import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BBBookingRasScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Today');

  // ข้อมูลจำลองที่ครอบคลุมทุกสถานะ
  const [bookings, setBookings] = useState([
    { id: '1', name: 'Eleanor Vance', type: 'VIP Customer • 3rd Visit', time: '8:30 PM', guests: '4 Guests', table: 'Auto-Assign', status: 'PENDING', date: 'Today' },
    { id: '2', name: 'James Holden', type: 'Standard • First Visit', time: '9:00 PM', guests: '2 Guests', table: 'Table 12 (Window)', status: 'CONFIRMED', date: 'Today' },
    { id: '3', name: 'Sarah Connor', type: 'Standard • 2nd Visit', time: '7:15 PM', guests: '3 Guests', table: 'Table 04', status: 'SEATED', date: 'Today' },
    { id: '4', name: 'John Doe', type: 'Standard', time: '12:00 PM', guests: '2 Guests', table: 'Table 05', status: 'CONFIRMED', date: 'Upcoming' }
  ]);

  // --- Functions จัดการ Flow ตามที่คุณต้องการ ---

  const handleReject = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id)); // ลบออกทันที
  };

  const handleAccept = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CONFIRMED' } : b));
    Alert.alert("ยอมรับการจองแล้ว", "คุณต้องการระบุโต๊ะให้ลูกค้าเลยหรือไม่?", [
      { text: "ภายหลัง" },
      { text: "เลือกโต๊ะ", onPress: () => navigation.navigate('HomeRas') }
    ]);
  };

  const handleMarkArrived = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'SEATED' } : b));
  };

  // กรองข้อมูลตาม Tab ที่เลือก
  const filteredBookings = bookings.filter(b => b.date === activeTab);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
      </View>

      {/* 1. Tab Bar */}
      <View style={styles.tabContainer}>
        {['Today', 'Upcoming', 'Past'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabButton, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredBookings.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.customerName}>{item.name}</Text>
                <Text style={styles.customerType}>{item.type}</Text>
              </View>
              {/* Status Badge */}
              <View style={[styles.statusBadge, 
                item.status === 'PENDING' ? styles.bgPending : 
                item.status === 'CONFIRMED' ? styles.bgConfirmed : styles.bgSeated]}>
                <Text style={[styles.statusText, 
                  item.status === 'PENDING' ? styles.textPending : 
                  item.status === 'CONFIRMED' ? styles.textConfirmed : styles.textSeated]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
               <MaterialCommunityIcons name="clock-outline" size={18} color="#FF6B6B" />
               <Text style={styles.infoText}>{item.time}</Text>
               <MaterialCommunityIcons name="account-group-outline" size={18} color="#FF6B6B" style={{marginLeft: 20}} />
               <Text style={styles.infoText}>{item.guests}</Text>
            </View>
            <View style={styles.infoRow}>
               <MaterialCommunityIcons name="table-furniture" size={18} color="#FF6B6B" />
               <Text style={styles.infoText}>{item.table}</Text>
            </View>

            {/* 2. Action Buttons Flow */}
            <View style={styles.actionRow}>
              {item.status === 'PENDING' && (
                <>
                  <TouchableOpacity style={styles.btnReject} onPress={() => handleReject(item.id)}>
                    <Text style={styles.btnTextWhite}>REJECT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnAccept} onPress={() => handleAccept(item.id)}>
                    <Text style={styles.btnTextWhite}>ACCEPT</Text>
                  </TouchableOpacity>
                </>
              )}

              {item.status === 'CONFIRMED' && (
                <TouchableOpacity style={styles.btnArrived} onPress={() => handleMarkArrived(item.id)}>
                  <Text style={styles.btnTextArrived}>MARK ARRIVED</Text>
                </TouchableOpacity>
              )}

              {item.status === 'SEATED' && (
                <TouchableOpacity style={styles.btnViewOrder} onPress={() => navigation.navigate('MenuRas')}>
                  <MaterialCommunityIcons name="silverware-fork-knife" size={16} color="#FFF" style={{marginRight: 8}} />
                  <Text style={styles.btnTextWhite}>VIEW ORDER / ADD MENU</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 3. Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeRas')}>
          <MaterialCommunityIcons name="view-grid" size={24} color="#666" />
          <Text style={styles.navLabel}>DASHBOARD</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItemActive}>
          <MaterialCommunityIcons name="calendar-check" size={24} color="#FF6B6B" />
          <Text style={[styles.navLabel, {color: '#FF6B6B'}]}>BOOKINGS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MenuRas')}>
          <View style={styles.menuIconBox}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#666" />
          </View>
          <Text style={styles.navLabel}>MENU</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="cog-outline" size={24} color="#666" />
          <Text style={styles.navLabel}>SETTINGS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  
  // Tab Styles
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  tabButton: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, backgroundColor: '#1A1A1A', marginRight: 10 },
  tabActive: { backgroundColor: '#FF6B6B' },
  tabText: { color: '#888', fontWeight: 'bold' },
  tabTextActive: { color: '#FFF' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },
  card: { backgroundColor: '#111', borderRadius: 20, padding: 20, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  customerName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  customerType: { color: '#888', fontSize: 12 },

  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
  bgPending: { backgroundColor: '#332b00' },
  textPending: { color: '#FFD700' },
  bgConfirmed: { backgroundColor: '#002b36' },
  textConfirmed: { color: '#00CCFF' },
  bgSeated: { backgroundColor: '#222' },
  textSeated: { color: '#888' },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoText: { color: '#AAA', marginLeft: 8 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  btnReject: { flex: 1, backgroundColor: '#222', height: 48, borderRadius: 24, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  btnAccept: { flex: 1, backgroundColor: '#FF6B6B', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  btnArrived: { flex: 1, borderWidth: 1, borderColor: '#444', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  btnViewOrder: { flex: 1, backgroundColor: '#333', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  btnTextWhite: { color: '#FFF', fontWeight: 'bold' },
  btnTextArrived: { color: '#FF6B6B', fontWeight: 'bold' },

  // Bottom Nav Styles
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    backgroundColor: '#1A1A1A', 
    paddingVertical: 10, 
    position: 'absolute', 
    bottom: 0, 
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navItemActive: { alignItems: 'center', justifyContent: 'center' },
  navLabel: { color: '#666', fontSize: 10, marginTop: 4, fontWeight: 'bold' },
  menuIconBox: { width: 40, height: 40, backgroundColor: '#222', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});