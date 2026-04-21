import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert, Modal, Platform, StatusBar 
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native'; 
import { supabase } from '../data/supabase';

export default function HomeRasScreen({ route, navigation }) {
  const { restaurantId } = route.params || {}; 
  const isFocused = useIsFocused(); 
  const [isOpen, setIsOpen] = useState(true);
  const [tables, setTables] = useState([]);
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats State
  const [todayBookingsCount, setTodayBookingsCount] = useState(0);

  // Panel State
  const [selectedTable, setSelectedTable] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tableOrders, setTableOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false); 

  useEffect(() => {
    if (!restaurantId) {
      Alert.alert('Error', 'ไม่พบข้อมูลร้านค้า กรุณาล็อกอินใหม่');
      navigation.replace('LoginRes');
      return;
    }
    if (isFocused) {
      fetchFloorPlan();
      fetchTodayBookings(); 
    }
  }, [isFocused, restaurantId]);

  // ✅ 1. ดึงข้อมูลแปลนร้าน
  const fetchFloorPlan = async () => {
    try {
      setLoading(true);
      const [tableRes, decorRes] = await Promise.all([
        supabase.from('restaurant_tables').select('*').eq('restaurant_id', restaurantId),
        supabase.from('restaurant_decorations').select('*').eq('restaurant_id', restaurantId)
      ]);

      if (tableRes.error) throw tableRes.error;
      if (decorRes.error) throw decorRes.error;

      setTables(tableRes.data || []);
      setDecorations(decorRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 2. ดึงจำนวนการจอง
  const fetchTodayBookings = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('reservations') 
        .select('*', { count: 'exact', head: true }) 
        .eq('restaurant_id', restaurantId)
        .eq('booking_date', today)
        .eq('status', 'confirmed'); 

      if (!error) setTodayBookingsCount(count || 0);
    } catch (error) {
      console.error('Error bookings count:', error.message);
    }
  };

  // ✅ แก้ไข handleLockTable ให้สะอาดและไม่มีตัวแปรซ้ำ
const handleLockTable = async (table) => {
  try {
    const now = new Date();
    // ตั้งเวลาหมดอายุ 2 ชม.
    const expiresAt = new Date(now.getTime() + (2 * 60 * 60 * 1000)).toISOString();

    // 1. อัปเดตสถานะโต๊ะเป็น occupied
    const { error: tableError } = await supabase
      .from('restaurant_tables')
      .update({ status: 'occupied' })
      .eq('id', table.id); 

    if (tableError) throw tableError;

    // 2. สร้างการจอง (Walk-in) โดยใช้ user_id: null
    const { error: resError } = await supabase
      .from('reservations')
      .insert([{
        restaurant_id: restaurantId,
        table_id: table.id, 
        user_id: null, // ✅ แก้บัค: ใส่ null แทน user.id เพื่อไม่ให้ไปชนกับเจ้าของร้าน
        booking_date: now.toISOString().split('T')[0],
        booking_time: now.toTimeString().split(' ')[0],
        status: 'confirmed', // ⚠️ เช็คใน DB อีกทีว่าใช้ 'confirmed' หรือ 'booked'
        expires_at: expiresAt 
      }]);

    if (resError) throw resError;

    setModalVisible(false);
    Alert.alert('สำเร็จ', `เปิดโต๊ะเรียบร้อย`);
    
    fetchFloorPlan();
    fetchTodayBookings();
    
    navigation.navigate('TableDetail', { restaurantId, tableId: table.id });
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

  const handleTablePress = async (table) => {
    
    setSelectedTable(table);
    setModalVisible(true);
    if (table.status === 'occupied') {
      try {
        setLoadingOrders(true);
        const { data, error } = await supabase
          .from('order_items')
          .select(`
            id, 
            menu_name, 
            price, 
            quantity, 
            orders!inner(id, table_id, status)
          `)
          .eq('orders.table_id', table.id) // ค้นหาด้วย UUID
          .eq('orders.status', 'pending');

        if (error) throw error;
        setTableOrders(data?.map(item => ({
          id: item.id,
          name: item.menu_name,
          qty: item.quantity,
          price: item.price
        })) || []);
      } catch (error) {
        console.error('Fetch Orders Error:', error.message);
      } finally {
        setLoadingOrders(false);
      }
    }
  };

  // Helpers
  const parseVal = (val) => {
    if (val === null || val === undefined || val === '') return undefined;
    return val.toString().includes('%') ? val : parseFloat(val);
  };

  const getTableStyle = (type) => {
    switch (type) {
      case 'sofaL': return styles.tableSofaL;
      case 'couple': return styles.tableCouple;
      case 'barSeat': return styles.barSeat;
      case 'king': return styles.tableKing;
      case 'long': return styles.tableLong;
      default: return styles.tableSquare;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied': return '#ff3030'; 
      case 'reserved': return '#dfc471'; 
      default: return '#161616'; 
    }
  };

  const getStatusTextTh = (status) => {
    switch (status) {
      case 'occupied': return 'มีลูกค้า';
      case 'reserved': return 'จองแล้ว';
      case 'available': return 'โต๊ะว่าง';
      default: return 'ไม่ระบุ';
    }
  };

  const handleCheckBill = async (tableId) => {
  Alert.alert(
    'ยืนยันเช็คบิล',
    'คุณต้องการเช็คบิลโต๊ะนี้ใช่หรือไม่?',
    [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ยืนยัน',
        onPress: async () => {
          try {
            // 1. ลบ reservation
            const { error: resError } = await supabase
              .from('reservations')
              .delete()
              .eq('table_id', tableId)
              .eq('status', 'confirmed');

            if (resError) throw resError;

            // 🔥 2. เปลี่ยนสถานะโต๊ะกลับเป็น available
            const { error: tableError } = await supabase
              .from('restaurant_tables')
              .update({ status: 'available' })
              .eq('id', tableId);

            if (tableError) throw tableError;

            Alert.alert('สำเร็จ', 'เช็คบิลเรียบร้อย');

            // 3. รีเฟรช UI
            fetchFloorPlan();
            fetchTodayBookings();

          } catch (error) {
            Alert.alert('Error', error.message);
          }
        }
      }
    ]
  );
};
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <Text style={styles.restaurantName}>Dashboard</Text>
              <TouchableOpacity style={styles.notificationBtn}>
                <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.subText}>สถานะโต๊ะอาหารแบบ Real-time</Text>

            <View style={styles.statusToggleContainer}>
              <TouchableOpacity style={[styles.toggleBtn, isOpen && styles.toggleActive]} onPress={() => setIsOpen(true)}>
                <Text style={[styles.toggleText, isOpen && styles.textWhite]}>เปิดร้าน</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, !isOpen && styles.toggleActiveGray]} onPress={() => setIsOpen(false)}>
                <Text style={[styles.toggleText, !isOpen && styles.textWhite]}>ปิดร้าน</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>จำนวนโต๊ะ</Text>
              <Text style={styles.summaryValue}>{tables.length}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Booking วันนี้</Text>
              <Text style={[styles.summaryValue, { color: '#FFC107' }]}>{todayBookingsCount}</Text>
            </View>
          </View>

          <Text style={styles.legendTitle}>ROOFTOP FLOOR PLAN</Text>

          <View style={styles.floorPlanCard}>
            {loading ? (
              <ActivityIndicator color="#ff3030" size="large" style={{ marginTop: '50%' }} />
            ) : (
              <View style={styles.canvas}>
                {decorations.map((item) => {
                  const dynamicLayout = {
                    position: 'absolute',
                    top: parseVal(item.top_position),
                    bottom: parseVal(item.bottom_position),
                    left: parseVal(item.left_position),
                    right: parseVal(item.right_position),
                    width: parseVal(item.width),
                    height: parseVal(item.height),
                  };
                  if (item.type === 'view') return <View key={item.id} style={[styles.decorView, dynamicLayout]}><Text style={styles.viewText}>{item.label}</Text></View>;
                  if (item.type === 'stage') return <View key={item.id} style={[styles.decorStage, dynamicLayout]}><View style={styles.stageLine} /><Text style={styles.stageText}>{item.label}</Text></View>;
                  if (item.type === 'bar') return <View key={item.id} style={[styles.decorBar, dynamicLayout]}><Text style={styles.viewText}>{item.label}</Text></View>;
                  if (item.type === 'wc') return (
                    <View key={item.id} style={[styles.decorWC, dynamicLayout]}>
                      <View style={styles.wcBox}><Ionicons name="man" size={14} color="#ff3030" /></View>
                      <View style={[styles.wcBox, { borderTopWidth: 1, borderColor: '#333' }]}><Ionicons name="woman" size={14} color="#ff3030" /></View>
                    </View>
                  );
                  if (item.type === 'door') return <View key={item.id} style={[styles.decorDoor, dynamicLayout]}><Text style={styles.doorText}>{item.label}</Text></View>;
                  return null;
                })}

                {tables.map((table) => {
                  const isSelected = selectedTable?.id === table.id;
                  return (
                    <TouchableOpacity
                      key={table.id}
                      onPress={() => handleTablePress(table)}
                      style={[
                        styles.tableBase,
                        getTableStyle(table.type),
                        { 
                          top: parseVal(table.top_position), 
                          left: parseVal(table.left_position),
                          backgroundColor: getStatusColor(table.status) 
                        },
                        table.status === 'occupied' && styles.tableOccupiedGlow,
                        isSelected && styles.selectedTableActive
                      ]}
                    >
                      <Text style={[styles.tableIdText, isSelected && { color: '#000' }]}>{table.id}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* 🧾 Bottom Sheet Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.bottomSheetContent}>
            <View style={styles.bsHeader}>
              <View>
              <Text style={styles.bsTitle}>โต๊ะ {selectedTable?.table_number || selectedTable?.id}</Text>
                <View style={styles.bsSubInfo}>
                  <MaterialCommunityIcons name="account-group" size={16} color="#888" />
                  <View style={styles.verticalDivider} />
                  <Text style={[styles.bsSubText, { color: getStatusColor(selectedTable?.status) }]}>
                 {getStatusTextTh(selectedTable?.status)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.bsCloseBtn}>
                <MaterialCommunityIcons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 250 }}>
              <Text style={styles.sectionTitle}>
                {selectedTable?.status === 'occupied' ? 'รายการอาหารที่สั่ง' : 'โต๊ะว่าง (พร้อมให้บริการ)'}
              </Text>
              {loadingOrders ? <ActivityIndicator color="#ff3030" /> : (
                tableOrders.length > 0 ? tableOrders.map((item, i) => (
                  <View key={i} style={styles.orderItem}>
                    <Text style={styles.orderItemName}>{item.qty}x {item.name}</Text>
                    <Text style={styles.orderItemPrice}>฿{item.price}</Text>
                  </View>
                )) : (
                  selectedTable?.status === 'occupied' && <Text style={styles.emptyOrderText}>ไม่มีรายการที่กำลังสั่ง</Text>
                )
              )}
            </ScrollView>

            <View style={styles.bsActionRow}>
              {selectedTable?.status === 'available' ? (
                // ปุ่มเปิดโต๊ะใหม่: ล็อกโต๊ะใน DB ทันที
                <TouchableOpacity 
                  style={[styles.btnAddFood, { backgroundColor: '#4CAF50' }]} 
                  onPress={() => handleLockTable(selectedTable)} 
                >
                  <Text style={styles.textWhite}>เปิดโต๊ะ (ล็อกสถานะ)</Text>
                </TouchableOpacity>
              ) : (
                // ปุ่มเพิ่มอาหาร: ไปที่หน้ารายละเอียดโต๊ะ
                <TouchableOpacity 
                  style={[styles.btnAddFood, { backgroundColor: '#2196F3' }]} 
                  onPress={() => { setModalVisible(false); navigation.navigate('TableDetail', { restaurantId, tableId: selectedTable?.id }); }}
                >
                  <Text style={styles.textWhite}>เพิ่มอาหาร / ดูรายละเอียด</Text>
                </TouchableOpacity>
              )}

              
              <TouchableOpacity 
                style={[styles.btnCheckBill, selectedTable?.status !== 'occupied' && { opacity: 0.3 }]} 
                disabled={selectedTable?.status !== 'occupied'}
                onPress={() => {
  setModalVisible(false);
  handleCheckBill(selectedTable?.id);
}}
              >
                <Text style={styles.textWhite}>เช็คบิล</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tab Bar */}
      <View style={styles.customTabBar}>
              <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('HomeRas', { restaurantId })}>
                <MaterialCommunityIcons name="view-dashboard" size={28} color="#ff3030" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BookingRas', { restaurantId })}>
                <MaterialCommunityIcons name="calendar-check" size={28} color="#888" />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { paddingBottom: 100 },
  headerSection: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  restaurantName: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  subText: { color: '#AAA', fontSize: 14, marginTop: 4 },
  statusToggleContainer: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderRadius: 25, marginTop: 15, padding: 4, width: 160 },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 20 },
  toggleActive: { backgroundColor: '#FF3030' },
  toggleActiveGray: { backgroundColor: '#333' },
  toggleText: { color: '#666', fontWeight: 'bold', fontSize: 12 },
  textWhite: { color: '#FFF', fontWeight: 'bold' },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 },
  summaryCard: { flex: 1, backgroundColor: '#111', padding: 15, borderRadius: 15, alignItems: 'center', marginHorizontal: 5, borderWidth: 1, borderColor: '#222' },
  summaryLabel: { color: '#888', fontSize: 12, marginBottom: 5 },
  summaryValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  legendTitle: { color: '#ff3030', fontSize: 13, fontWeight: 'bold', marginTop: 25, marginLeft: 20, marginBottom: 15, letterSpacing: 2 },
  floorPlanCard: { backgroundColor: '#0a0a0a', marginHorizontal: 15, borderRadius: 25, height: 500, position: 'relative', borderWidth: 1, borderColor: '#1a1a1a', overflow: 'hidden' },
  canvas: { flex: 1 },
  decorView: { backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#333' },
  decorBar: { backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: '#333' },
  viewText: { color: '#555', fontSize: 10, transform: [{ rotate: '-90deg' }], width: 200, textAlign: 'center', letterSpacing: 4 },
  decorStage: { justifyContent: 'center', alignItems: 'center' },
  stageLine: { width: '90%', height: 6, backgroundColor: '#5f2424', borderRadius: 5, marginBottom: 4 },
  stageText: { color: '#444', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  decorWC: { backgroundColor: '#111', borderLeftWidth: 2, borderColor: '#333' },
  wcBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  decorDoor: { backgroundColor: '#333', borderTopLeftRadius: 5, borderTopRightRadius: 5, alignItems: 'center', justifyContent: 'center' },
  doorText: { color: '#ff3030', fontSize: 8, fontWeight: 'bold' },
  tableBase: { position: 'absolute', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#333' },
  tableSofaL: { width: 80, height: 60, borderTopLeftRadius: 40, borderBottomLeftRadius: 40 },
  tableCouple: { width: 40, height: 40, borderRadius: 20 },
  tableSquare: { width: 45, height: 45, borderRadius: 8 },
  tableKing: { width: 50, height: 100, borderRadius: 10 },
  tableLong: { width: 50, height: 100, borderRadius: 10 },
  barSeat: { width: 28, height: 28, borderRadius: 6 },
  tableIdText: { color: '#666', fontSize: 10, fontWeight: 'bold' },
  selectedTableActive: { backgroundColor: '#ff3030', borderColor: '#fff', shadowColor: '#ff3030', shadowOpacity: 0.8, shadowRadius: 10, elevation: 10 },
  tableOccupiedGlow: { shadowColor: '#FF3030', shadowRadius: 15, shadowOpacity: 1, elevation: 10, borderColor: '#FFF', borderWidth: 2 },
  bottomSheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  bottomSheetContent: { backgroundColor: '#161616', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
  bsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  bsTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  bsSubInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  bsSubText: { color: '#888', fontSize: 14, marginLeft: 5 },
  verticalDivider: { width: 1, height: 15, backgroundColor: '#333', marginHorizontal: 10 },
  sectionTitle: { color: '#FFF', fontSize: 15, fontWeight: 'bold', marginBottom: 12, marginTop: 10 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, backgroundColor: '#222', borderRadius: 12, marginBottom: 8 },
  orderItemName: { color: '#FFF', fontSize: 14 },
  orderItemPrice: { color: '#FF3030', fontWeight: 'bold' },
  emptyOrderText: { color: '#555', textAlign: 'center', marginVertical: 20 },
  bsActionRow: { flexDirection: 'row', gap: 12, marginTop: 25 },
  btnAddFood: { flex: 1, backgroundColor: '#333', padding: 16, borderRadius: 15, alignItems: 'center' },
  btnCheckBill: { flex: 1, backgroundColor: '#FF3030', padding: 16, borderRadius: 15, alignItems: 'center' },
  bsCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  customTabBar: { flexDirection: 'row', backgroundColor: '#000', height: 65, borderTopWidth: 1, borderTopColor: '#1A1A1A', position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'space-around', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 15 : 0 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }
});