import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image,
  TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

import CalendarPicker from '../booking/CalendarPicker';
import nonphotooo from '../../assets/photohome/nonphoto.jpg';

const { width } = Dimensions.get('window');

// 🍽️ 10 MAIN TABLES + 4 BAR SEATS
const tableLayout = [
  // Center - Main Dining (VVIP)
  { id: 'T1', seats: 8, type: 'king', top: '15%', left: '33%' },
  { id: 'T2', seats: 6, type: 'long', top: '50%', left: '33%' },

  // Mid-Section (Standard 4 Seats)
  { id: 'T3', seats: 4, type: 'square', top: '15%', left: '55%' },
  { id: 'T4', seats: 4, type: 'square', top: '35%', left: '55%' },

  // Rear-Section (Couple 2 Seats)
  { id: 'T5', seats: 2, type: 'couple', top: '75%', left: '5%' },
  { id: 'T6', seats: 2, type: 'couple', top: '90%', left: '5%' },
  { id: 'T7', seats: 2, type: 'couple', top: '55%', left: '55%' },

  // Side Tables (Mixed)
  { id: 'T8', seats: 4, type: 'square', top: '10%', left: '80%' },
  { id: 'T9', seats: 4, type: 'square', top: '5%', left: '5%' },
  { id: 'T10', seats: 6, type: 'sofaL', top: '75%', left: '75%' },

  // 🔥 BAR ZONE SEATS (Left Side)
  { id: 'B1', seats: 1, type: 'barSeat', top: '22%', left: '15%' },
  { id: 'B2', seats: 1, type: 'barSeat', top: '35%', left: '15%' },
  { id: 'B3', seats: 1, type: 'barSeat', top: '48%', left: '15%' },
  { id: 'B4', seats: 1, type: 'barSeat', top: '61%', left: '15%' },
];

const BookingScreen = ({ route, navigation }) => {
  const { restaurant } = route.params || {};
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  if (!restaurant) return <View style={styles.container}><Text style={{ color: '#fff' }}>ไม่พบข้อมูล</Text></View>;

  const { id, name, image_url } = restaurant;
  const imageToShow = image_url ? { uri: image_url } : nonphotooo;

  useEffect(() => { fetchSlots(); }, [selectedDate]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    const { data, error } = await supabase
      .from('restaurant_slots')
      .select('*')
      .eq('restaurant_id', id)
      .eq('available_date', selectedDate)
      .eq('is_available', true)
      .order('start_time', { ascending: true });
    if (!error) setSlots(data);
    setLoadingSlots(false);
  };

  const handleBooking = async () => {
    if (!selectedTable || !selectedSlot) return Alert.alert('แจ้งเตือน', 'กรุณาเลือกโต๊ะและเวลา');
    // ... (Logic การจองเหมือนเดิม)
    Alert.alert('สำเร็จ 🎉', `จองโต๊ะ ${selectedTable.id} เรียบร้อยแล้ว`);
    navigation.goBack();
  };

  const getTableStyle = (type) => {
    switch (type) {
      case 'king': return styles.tableKing;
      case 'long': return styles.tableLong;
      case 'sofaL': return styles.tableSofaL; // เพิ่มเคสนี้
      case 'couple': return styles.tableCouple;
      case 'barSeat': return styles.barSeat;
      default: return styles.tableSquare;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageHeader}>
        <Image source={imageToShow} style={styles.mainImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.nameText}>{name}</Text>
          
          <Text style={styles.sectionTitle}>FLOOR PLAN</Text>

          {/* 🎞️ CINEMA STYLE MAP */}
          <View style={styles.mapContainer}>
            {/* Stage Screen */}
            <View style={styles.screenIndicator}>
                <View style={styles.screenLine} />
                <Text style={styles.screenText}>STAGE / PERFORMANCE</Text>
            </View>

            {/* 🍸 BAR ZONE (Left) */}
            <View style={styles.barArea}>
                <Text style={styles.verticalLabel}>BAR AREA</Text>
            </View>

            {/* 🚻 RESTROOMS (Right) */}
            <View style={styles.wcArea}>
                <View style={styles.wcBox}>
                    <Ionicons name="man" size={14} color="#FFD700" />
                </View>
                <View style={[styles.wcBox, { borderTopWidth: 1, borderColor: '#333' }]}>
                    <Ionicons name="woman" size={14} color="#FFD700" />
                </View>
            </View>

            {/* 🚪 ENTRANCE DOOR (Bottom) */}
            <View style={styles.doorArea}>
                <Ionicons name="exit-outline" size={18} color="#ffffff" style={{ transform: [{ rotate: '180deg' }] }} />
                <Text style={styles.doorText}>DOOR</Text>
            </View>

            {/* TABLES RENDER */}
            {tableLayout.map((table) => {
              const isSelected = selectedTable?.id === table.id;
              return (
                <TouchableOpacity
                  key={table.id}
                  onPress={() => setSelectedTable(table)}
                  style={[
                    styles.tableBase,
                    getTableStyle(table.type),
                    { top: table.top, left: table.left },
                    isSelected && styles.selectedTableActive
                  ]}
                >
                  <Text style={[styles.tableIdText, isSelected && { color: '#000' }]}>{table.id}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* DateTime Pickers */}
          <Text style={styles.sectionTitle}>SELECT DATE & TIME</Text>
          <CalendarPicker selectedDate={selectedDate} onDateSelect={setSelectedDate} />

          {loadingSlots ? (
            <ActivityIndicator color="#ff5100" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.slotGrid}>
              {slots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => setSelectedSlot(slot)}
                  style={[styles.slotCard, selectedSlot?.id === slot.id && styles.selectedSlotCard]}
                >
                  <Text style={[styles.slotText, selectedSlot?.id === slot.id && { color: '#000' }]}>{slot.start_time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
            <Text style={styles.summaryLabel}>Selected:</Text>
            <Text style={styles.summaryValue}>{selectedTable ? `Table ${selectedTable.id}` : 'None'}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  imageHeader: { 
    height: 220 
  },
  mainImage: { 
    width: '100%', 
    height: '100%', 
    opacity: 0.7 
  },
  backButton: { 
    position: 'absolute', 
    top: 50, left: 20, 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: { 
    flex: 1, 
    marginTop: -25, 
    backgroundColor: '#000', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    paddingHorizontal: 20 
  },
  nameText: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 20 
  },
  sectionTitle: { 
    color: '#FFD700', 
    fontSize: 13, 
    fontWeight: 'bold', 
    marginTop: 25, 
    marginBottom: 15, 
    letterSpacing: 2 
  },

  // Map Components
  mapContainer: { height: 420, backgroundColor: '#080808', borderRadius: 20, borderWidth: 1, borderColor: '#1a1a1a', position: 'relative', overflow: 'hidden' },
  screenIndicator: { alignItems: 'center', marginTop: 15 },
  screenLine: { 
    width: '60%', 
    height: 10, 
    backgroundColor: '#5f2424', 
    borderRadius: 10, 
    shadowColor: '#f69898', 
    shadowOpacity: 0.8, 
    shadowRadius: 10, 
    elevation: 10 
  },
  screenText: { 
    color: '#333', 
    fontSize: 10, 
    marginTop: 5, 
    letterSpacing: 2 },

  // Bar Zone (Left)
  barArea: { position: 'absolute', left: 0, top: '20%', bottom: '30%', width: 50, backgroundColor: '#111', borderRightWidth: 2, borderColor: '#ff3030', justifyContent: 'center', alignItems: 'center' },
  verticalLabel: { color: '#ff3030', fontSize: 8, transform: [{ rotate: '-90deg' }], fontWeight: 'bold', width: 100, textAlign: 'center' },

  //sofaL
  tableSofaL: {
    width: 90,
    height: 100,
    backgroundColor: '#1a1a1a',
    borderColor: '#333', // สีแดงตามธีมที่คุณชอบ
    borderWidth: 2,
    borderTopLeftRadius: 70,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 0, 
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  // WC Area (Right)
  wcArea: { 
    position: 'absolute', 
    right: 0, 
    top: '30%', 
    width: 40, 
    height: 100, 
    backgroundColor: '#111', 
    borderLeftWidth: 2, 
    borderColor: '#333' },
  wcBox: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  // Door (Bottom)
  doorArea: { position: 'absolute', bottom: 0, left: '40%', width: 80, height: 40, backgroundColor: '#151515', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderWidth: 1, borderColor: '#ff3030', borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' },
  doorText: { color: '#ff3030', fontSize: 10, fontWeight: 'bold', marginTop: 2 },

  // Tables
  tableBase: { position: 'absolute', backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#333', borderRadius: 20 },
  tableKing: { width: 50, height: 100, borderColor: '#333', borderRadius: 10 },
  tableLong: { width: 50, height: 100, borderColor: '#333', borderRadius: 10 },
  tableSquare: { width: 45, height: 45 },
  tableCouple: { width: 40, height: 40, borderRadius: 20 },
  barSeat: { width: 30, height: 30, borderRadius: 10, borderColor: '#333' },

  selectedTableActive: { backgroundColor: '#FFD700', borderColor: '#fff', elevation: 15, shadowColor: '#FFD700', shadowOpacity: 0.5, shadowRadius: 10 },
  tableIdText: { color: '#888', fontSize: 11, fontWeight: 'bold' },

  // Slots & Footer
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotCard: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#111', borderWidth: 1, borderColor: '#222' },
  selectedSlotCard: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
  slotText: { color: '#888', fontSize: 14 },

  footer: { padding: 20, backgroundColor: '#0a0a0a', borderTopWidth: 1, borderColor: '#1a1a1a', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryLabel: { color: '#555', fontSize: 12 },
  summaryValue: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' },
  bookButton: { backgroundColor: '#FFD700', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 12 },
  bookButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
});