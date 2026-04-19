import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ข้อมูลจำลองรายการจอง (Mock Data)
const initialBookings = [
  {
    id: '1',
    name: 'Eleanor Vance',
    type: 'VIP Customer • 3rd Visit',
    time: '8:30 PM',
    guests: '4 Guests',
    table: 'Auto-Assign',
    status: 'PENDING',
  },
  {
    id: '2',
    name: 'James Holden',
    type: 'Standard • First Visit',
    time: '9:00 PM',
    guests: '2 Guests',
    table: 'Table 12 (Window)',
    status: 'CONFIRMED',
  },
  {
    id: '3',
    name: 'Sarah Connor',
    type: 'Standard • 2nd Visit',
    time: '7:15 PM',
    guests: '3 Guests',
    table: 'Table 04',
    status: 'SEATED',
  }
];

export default function BBBookingRasScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Today');

  // ฟังก์ชันกำหนดสี Badge ตามสถานะ
  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return { bg: '#3D3521', text: '#FFCC00' };
      case 'CONFIRMED': return { bg: '#1A2E35', text: '#4FC3F7' };
      case 'SEATED': return { bg: '#222', text: '#888' };
      default: return { bg: '#333', text: '#FFF' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ส่วนหัวข้อหลัก */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
      </View>

      {/* 1. ส่วนเลือกช่วงเวลา (Tabs) */}
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
        {initialBookings.map((item) => {
          const statusStyle = getStatusStyle(item.status);
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.customerName}>{item.name}</Text>
                  <Text style={styles.customerType}>{item.type}</Text>
                </View>
                {/* Badge แสดงสถานะ */}
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <MaterialCommunityIcons 
                    name={item.status === 'PENDING' ? "clock-fast" : "check-circle"} 
                    size={14} 
                    color={statusStyle.text} 
                  />
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                </View>
              </View>

              {/* รายละเอียดเวลาและจำนวนแขก */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#FF6B6B" />
                  <Text style={styles.infoText}>{item.time}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="account-group-outline" size={20} color="#FF6B6B" />
                  <Text style={styles.infoText}>{item.guests}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="table-furniture" size={20} color="#FF6B6B" />
                <Text style={styles.infoText}>{item.table}</Text>
              </View>

              {/* 2. ส่วนปุ่มจัดการ (Action Buttons) */}
              <View style={styles.actionRow}>
                {item.status === 'PENDING' ? (
                  <>
                    <TouchableOpacity style={[styles.btn, styles.btnReject]}>
                      <Text style={styles.btnTextBold}>REJECT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, styles.btnAccept]}>
                      <Text style={styles.btnTextBold}>ACCEPT</Text>
                    </TouchableOpacity>
                  </>
                ) : item.status === 'CONFIRMED' ? (
                  <TouchableOpacity style={styles.btnArrived}>
                    <Text style={styles.btnTextArrived}>MARK ARRIVED</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* 3. แถบเมนูด้านล่าง (Bottom Navigation) - แก้ไขให้กลับไป HomeRas */}
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('HomeRas')} 
        >
          <MaterialCommunityIcons name="view-grid" size={26} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="calendar-check" size={26} color="#FF2A2A" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={26} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="cog-outline" size={26} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  header: { padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  tabButton: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, backgroundColor: '#1A1A1A', marginRight: 10 },
  tabActive: { backgroundColor: '#FF6B6B' },
  tabText: { color: '#888', fontWeight: 'bold' },
  tabTextActive: { color: '#FFF' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { backgroundColor: '#161618', borderRadius: 25, padding: 20, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  customerName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  customerType: { color: '#888', fontSize: 13 },
  
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 15 },
  statusText: { fontSize: 11, fontWeight: 'bold', marginLeft: 5 },

  infoRow: { flexDirection: 'row', marginBottom: 10 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 25, marginBottom: 5 },
  infoText: { color: '#AAA', marginLeft: 10, fontSize: 15 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  btn: { flex: 1, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  btnReject: { backgroundColor: '#262626', marginRight: 10 },
  btnAccept: { backgroundColor: '#FF6B6B' },
  btnTextBold: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  btnArrived: { flex: 1, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  btnTextArrived: { color: '#FF6B6B', fontWeight: 'bold' },

  bottomNavContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 15, 
    backgroundColor: '#000', 
    borderTopWidth: 1, 
    borderTopColor: '#1A1A1A',
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  navItem: { padding: 10 }
});