import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BBBookingRasScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}><Text style={styles.headerTitle}>Bookings</Text></View>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Card Seated ตามรูปภาพ */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.customerName}>Eleanor Vance</Text>
                <Text style={styles.customerType}>VIP Customer • 3rd Visit</Text>
              </View>
              <View style={styles.statusBadge}><Text style={styles.statusText}>SEATED</Text></View>
            </View>

            <View style={styles.infoRowContainer}>
              <View style={styles.infoItem}><MaterialCommunityIcons name="clock-outline" size={18} color="#FF5252" /><Text style={styles.infoText}>8:30 PM</Text></View>
              <View style={styles.infoItem}><MaterialCommunityIcons name="account-group" size={18} color="#FF5252" /><Text style={styles.infoText}>4 Guests</Text></View>
              <View style={styles.infoItem}><MaterialCommunityIcons name="table-furniture" size={18} color="#FF5252" /><Text style={styles.infoText}>Table B1</Text></View>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.btnViewOrder} onPress={() => navigation.navigate('BCMenuRasScreen')}>
                <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#FFF" style={{marginRight: 8}} />
                <Text style={styles.btnTextWhite}>VIEW ORDER</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCheckBill} onPress={() => Alert.alert("Confirm Check Bill", "พิมพ์ใบแจ้งหนี้สำหรับโต๊ะ B1?")}>
                <MaterialCommunityIcons name="cash-register" size={20} color="#4CAF50" style={{marginRight: 8}} />
                <Text style={styles.btnTextGreen}>CHECK BILL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={styles.customTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BAHomeRasScreen')}><MaterialCommunityIcons name="view-dashboard" size={28} color="#888" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}><MaterialCommunityIcons name="calendar-check" size={28} color="#FF5252" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BCMenuRasScreen')}><MaterialCommunityIcons name="silverware-fork-knife" size={28} color="#888" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BDSettingsRasScreen')}><MaterialCommunityIcons name="cog" size={28} color="#888" /></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 25, paddingTop: 40 },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 15 },
  card: { backgroundColor: '#111', borderRadius: 25, padding: 20, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  customerName: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  customerType: { color: '#888', fontSize: 14, marginTop: 4 },
  statusBadge: { backgroundColor: 'rgba(76, 175, 80, 0.1)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  statusText: { color: '#4CAF50', fontSize: 12, fontWeight: 'bold' },
  infoRowContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoText: { color: '#FFF', marginLeft: 8, fontSize: 15 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  btnViewOrder: { flex: 1, backgroundColor: '#333', height: 55, borderRadius: 30, marginRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnCheckBill: { flex: 1, borderWidth: 1, borderColor: '#4CAF50', height: 55, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnTextWhite: { color: '#FFF', fontWeight: 'bold' },
  btnTextGreen: { color: '#4CAF50', fontWeight: 'bold' },
  customTabBar: { flexDirection: 'row', backgroundColor: '#000', height: 80, borderTopWidth: 1, borderTopColor: '#1A1A1A', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15 },
  tabItem: { padding: 10 }
});