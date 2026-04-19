import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BBBookingRasScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Today');

  // ข้อมูลจำลอง (จำลองสถานะต่างๆ เพื่อดูปุ่มที่เปลี่ยนไป)
  const [bookings, setBookings] = useState([
    { id: '1', name: 'Eleanor Vance', type: 'VIP Customer • 3rd Visit', time: '8:30 PM', guests: '4 Guests', table: 'Table B1', status: 'PENDING', date: 'Today' },
    { id: '2', name: 'James Holden', type: 'Standard • First Visit', time: '9:00 PM', guests: '2 Guests', table: 'Table 12', status: 'CONFIRMED', date: 'Today' },
    { id: '3', name: 'Sarah Connor', type: 'Standard • 2nd Visit', time: '7:15 PM', guests: '3 Guests', table: 'Table 04', status: 'SEATED', date: 'Today' },
  ]);

  // --- Functions จัดการ Flow ---
  const handleReject = (id) => {
    Alert.alert("Confirm", "Reject this booking?", [
      { text: "Cancel" },
      { text: "Confirm", onPress: () => setBookings(prev => prev.filter(b => b.id !== id)) }
    ]);
  };

  const handleAccept = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CONFIRMED' } : b));
  };

  const handleMarkArrived = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'SEATED' } : b));
  };

  const handleCheckBill = (name, table) => {
    Alert.alert("Check Bill", `ต้องการเช็คบิลโต๊ะ ${table} (${name}) ใช่หรือไม่?`, [
      { text: "ยังไม่เช็ค" },
      { text: "ยืนยันเช็คบิล", onPress: () => Alert.alert("Success", "พิมพ์ใบแจ้งหนี้เรียบร้อย") }
    ]);
  };

  const filteredBookings = bookings.filter(b => b.date === activeTab);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bookings</Text>
        </View>

        {/* Tab Bar */}
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

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

              <View style={styles.infoGrid}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#FF5252" />
                  <Text style={styles.infoText}>{item.time}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="account-group-outline" size={16} color="#FF5252" />
                  <Text style={styles.infoText}>{item.guests}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="table-furniture" size={16} color="#FF5252" />
                  <Text style={styles.infoText}>{item.table}</Text>
                </View>
              </View>

              {/* Action Buttons Flow */}
              <View style={styles.actionRow}>
                {/* สถานะ 1: PENDING */}
                {item.status === 'PENDING' && (
                  <>
                    <TouchableOpacity style={styles.btnReject} onPress={() => handleReject(item.id)}>
                      <Text style={styles.btnTextReject}>REJECT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnAccept} onPress={() => handleAccept(item.id)}>
                      <Text style={styles.btnTextWhite}>ACCEPT</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* สถานะ 2: CONFIRMED */}
                {item.status === 'CONFIRMED' && (
                  <TouchableOpacity style={styles.btnArrived} onPress={() => handleMarkArrived(item.id)}>
                    <Text style={styles.btnTextArrived}>MARK ARRIVED</Text>
                  </TouchableOpacity>
                )}

                {/* สถานะ 3: SEATED (เพิ่มปุ่ม View Order และ Check Bill) */}
                {item.status === 'SEATED' && (
                  <View style={styles.seatedActionGroup}>
                    <TouchableOpacity 
                        style={styles.btnViewOrder} 
                        onPress={() => navigation.navigate('BCMenuRasScreen')}
                    >
                      <MaterialCommunityIcons name="silverware" size={18} color="#FFF" style={{marginRight: 6}} />
                      <Text style={styles.btnTextWhite}>VIEW ORDER</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.btnCheckBill} 
                        onPress={() => handleCheckBill(item.name, item.table)}
                    >
                      <MaterialCommunityIcons name="cash-register" size={18} color="#4CAF50" style={{marginRight: 6}} />
                      <Text style={styles.btnTextCheckBill}>CHECK BILL</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Tab Bar (Icons Only) */}
      <View style={styles.customTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BAHomeRasScreen')}>
          <MaterialCommunityIcons name="view-dashboard" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="calendar-check" size={28} color="#FF5252" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BCMenuRasScreen')}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="cog" size={28} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 25, paddingTop: 40 },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  tabButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#1A1A1A', marginRight: 10 },
  tabActive: { backgroundColor: '#FF5252' },
  tabText: { color: '#666', fontWeight: 'bold' },
  tabTextActive: { color: '#FFF' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },
  card: { backgroundColor: '#121212', borderRadius: 25, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#1A1A1A' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  customerName: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  customerType: { color: '#888', fontSize: 13, marginTop: 4 },
  statusBadge: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 10 },
  bgPending: { backgroundColor: 'rgba(255, 215, 0, 0.1)' },
  textPending: { color: '#FFD700', fontSize: 11, fontWeight: 'bold' },
  bgConfirmed: { backgroundColor: 'rgba(0, 204, 255, 0.1)' },
  textConfirmed: { color: '#00CCFF', fontSize: 11, fontWeight: 'bold' },
  bgSeated: { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
  textSeated: { color: '#4CAF50', fontSize: 11, fontWeight: 'bold' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginRight: 20, marginBottom: 10 },
  infoText: { color: '#AAA', marginLeft: 8, fontSize: 14 },
  actionRow: { marginTop: 15 },
  
  // Seated Status Buttons
  seatedActionGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  btnViewOrder: { flex: 1, backgroundColor: '#333', height: 50, borderRadius: 25, marginRight: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  btnCheckBill: { flex: 1, borderWidth: 1, borderColor: '#4CAF50', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  
  // Standard Buttons
  btnReject: { flex: 0.8, backgroundColor: '#1A1A1A', height: 50, borderRadius: 25, marginRight: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  btnAccept: { flex: 1.2, backgroundColor: '#FF5252', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  btnArrived: { width: '100%', borderWidth: 1, borderColor: '#FF5252', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  
  btnTextWhite: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  btnTextReject: { color: '#888', fontWeight: 'bold' },
  btnTextArrived: { color: '#FF5252', fontWeight: 'bold' },
  btnTextCheckBill: { color: '#4CAF50', fontWeight: 'bold', fontSize: 13 },

  customTabBar: { flexDirection: 'row', backgroundColor: '#000', height: 75, borderTopWidth: 1, borderTopColor: '#222', position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});