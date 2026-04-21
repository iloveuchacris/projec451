import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, 
  ActivityIndicator, SafeAreaView, FlatList, Modal
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

export default function RATableDetailScreen({ route, navigation }) {
  const { tableId, restaurantId } = route.params || {}; 

  const [table, setTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [menuItems, setMenuItems] = useState([]); // เก็บรายการเมนูจาก DB
  
  const [loading, setLoading] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [currentTableStatus, setCurrentTableStatus] = useState(null);

  useEffect(() => {
    if (!tableId) {
      Alert.alert('Error', 'ไม่พบข้อมูลโต๊ะ');
      navigation.goBack();
      return;
    }
    fetchAllData();
    fetchMenu(); // โหลดเมนูรอไว้
  }, [tableId]);

  const fetchAllData = async () => {
    await fetchTableInfo();
    await fetchReservation();
  };

  // ✅ ดึงรายการเมนูของร้าน
  const fetchMenu = async () => {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('restaurant_id', restaurantId);
    if (!error) setMenuItems(data);
  };

  const fetchTableInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .eq('id', tableId)
        .single();
      if (error) throw error;
      setTable(data);
      setCurrentTableStatus(data.status);
      if (data.status === 'occupied') fetchOrders();
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchReservation = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('table_id', tableId)
        .eq('status', 'confirmed')
        .maybeSingle();
      if (!error) setReservation(data);
    } catch (error) { setReservation(null); }
  };

// ... ส่วนบนคงเดิม ...

const fetchOrders = async () => {
  setLoading(true);
  try {
    // ดึง OrderItems โดย Join กับ Orders ที่สถานะ pending
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        id, menu_name, price, quantity,
        orders!inner(id, table_id, status)
      `)
      .eq('orders.table_id', tableId)
      .eq('orders.status', 'pending'); // ต้องเป็น pending เท่านั้นถึงจะขึ้นในหน้านี้

    if (error) throw error;
    setOrders(data || []);
  } catch (error) {
    console.error("Fetch Orders Error:", error.message);
  } finally {
    setLoading(false);
  }
};

const handleAddOrderItem = async (menu) => {
  try {
    setLoading(true);

    // 1. ตรวจสอบบิล (Order) ของโต๊ะนี้ที่ยัง 'pending' อยู่ 
    // เราใช้ tableId ที่ได้จาก params เพื่อล็อกเป้าหมายให้ตรงโต๊ะ
    let { data: currentOrder, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('table_id', tableId) // ล็อก ID โต๊ะ
      .eq('status', 'pending')
      .maybeSingle();

    if (orderError) throw orderError;

    let targetOrderId;

    // 2. ถ้ายังไม่มีบิล (เปิดโต๊ะใหม่หรือยังไม่เคยสั่ง) ให้สร้าง Order โดยระบุ table_id ชัดเจน
    if (!currentOrder) {
      const { data: newOrder, error: createError } = await supabase
        .from('orders')
        .insert([{ 
          table_id: tableId,        // บันทึก ID โต๊ะลง Database
          restaurant_id: restaurantId, 
          status: 'pending', 
          total_amount: 0,
          user_id: null             // สำหรับ Walk-in/พนักงานสั่งให้
        }])
        .select()
        .single();

      if (createError) throw createError;
      targetOrderId = newOrder.id;
    } else {
      targetOrderId = currentOrder.id;
    }

    // 3. บันทึกรายการอาหาร (order_items) โดยผูกกับ Order ID ของโต๊ะนั้นๆ
    const { error: itemError } = await supabase
      .from('order_items')
      .insert([{
        order_id: targetOrderId,    // เชื่อมกับบิลของโต๊ะนี้
        menu_name: menu.name, 
        price: menu.price,
        quantity: 1
      }]);

    if (itemError) throw itemError;

    // 4. อัปเดตสถานะโต๊ะในตาราง restaurant_tables ให้เป็น 'occupied' ทันที
    // เพื่อให้หน้า Home ทราบว่าโต๊ะนี้ไม่ว่างแล้ว
    const { error: updateTableError } = await supabase
      .from('restaurant_tables')
      .update({ status: 'occupied' })
      .eq('id', tableId);

    if (updateTableError) throw updateTableError;

    // 5. อัปเดตสถานะในหน้าจอ (Local State) และรีเฟรชรายการ
    setCurrentTableStatus('occupied');
    Alert.alert('สำเร็จ', `เพิ่ม ${menu.name} ลงโต๊ะ ${table?.table_number || ''} เรียบร้อย`);
    
    await fetchOrders(); // ดึงรายการอาหารใหม่มาแสดงในบิลบนหน้าจอ
    
  } catch (error) {
    console.error("Add Item Error:", error.message);
    Alert.alert('Error', 'ไม่สามารถบันทึกข้อมูลได้: ' + error.message);
  } finally {
    setLoading(false);
  }
};

const handleCloseBill = async () => {
  Alert.alert('ยืนยันการเช็คบิล', 'ยอดชำระทั้งหมด ฿' + totalPrice, [
    { text: 'ยกเลิก', style: 'cancel' },
    {
      text: 'ยืนยัน',
      onPress: async () => {
        setLoading(true);
        try {
          // 1. ปิดบิล (Orders)
          const { error: orderErr } = await supabase
            .from('orders')
            .update({ status: 'paid' }) // หรือ 'completed'
            .eq('table_id', tableId)
            .eq('status', 'pending');
          if (orderErr) throw orderErr;

          // 2. คืนสถานะโต๊ะ (Tables)
          const { error: tableErr } = await supabase
            .from('restaurant_tables')
            .update({ status: 'available' })
            .eq('id', tableId);
          if (tableErr) throw tableErr;

          // 3. ลบหรือปิดการจอง (Reservations)
          // แนะนำให้ delete เพื่อให้หน้า Home อัปเดต Floor Plan ทันที
          await supabase.from('reservations').delete().eq('table_id', tableId);

          Alert.alert('สำเร็จ', 'เช็คบิลเรียบร้อยแล้ว');
          navigation.goBack(); // กลับไปหน้า Home เพื่อรีเฟรช Floor Plan
        } catch (error) {
          Alert.alert('Error', error.message);
        } finally {
          setLoading(false);
        }
      }
    }
  ]);
};
  const totalPrice = orders.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={32} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>โต๊ะ {table?.table_number || '...'}</Text>
        <TouchableOpacity onPress={fetchAllData}>
          <MaterialCommunityIcons name="refresh" size={26} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {currentTableStatus === 'occupied' ? (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>รายการอาหาร</Text>
              <TouchableOpacity style={styles.addFoodBtn} onPress={() => setMenuModalVisible(true)}>
                <MaterialCommunityIcons name="plus-circle" size={20} color="#FFF" />
                <Text style={{color:'#FFF', marginLeft:5}}>สั่งอาหาร</Text>
              </TouchableOpacity>
            </View>

            {orders.length > 0 ? orders.map((item) => (
              <View key={item.id} style={styles.orderCard}>
                <Text style={styles.orderName}>{item.menu_name}</Text>
                <Text style={styles.orderPrice}>฿{item.price} x {item.quantity}</Text>
              </View>
            )) : <Text style={styles.emptyText}>ยังไม่มีรายการอาหาร</Text>}

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>ยอดรวมทั้งหมด</Text>
              <Text style={styles.totalValue}>฿{totalPrice}</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={handleCloseBill}>
              <Text style={styles.btnText}>เช็คบิลและปิดโต๊ะ</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="table-chair" size={80} color="#333" />
            <Text style={{color: '#888', marginTop: 10}}>โต๊ะนี้ยังไม่ได้เปิดใช้งาน</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal เลือกเมนูอาหาร */}
      <Modal visible={menuModalVisible} animationType="slide" transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {/* Header */}
      <View style={styles.modalHeader}>
        <View>
          <Text style={styles.modalTitle}>เมนูอาหาร</Text>
          <Text style={{ color: '#ffffff', fontSize: 12 }}>เลือกรายการเพื่อเพิ่มลงในโต๊ะ</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuModalVisible(false)} style={styles.bsCloseBtn}>
          <MaterialCommunityIcons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* List รายการเมนู */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.menuItemCard} 
            onPress={() => handleAddOrderItem(item)}
          >
            <View style={styles.menuInfo}>
              <Text style={styles.menuNameText}>{item.name}</Text>
              <Text style={styles.menuCategoryTag}>{item.category || 'ทั่วไป'}</Text>
            </View>
            <View style={styles.menuPriceSection}>
              <Text style={styles.menuPriceText}>฿{item.price}</Text>
              <View style={styles.plusIconCircle}>
                <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={<Text style={styles.emptyText}>ไม่พบรายการเมนู</Text>}
      />
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  content: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { color: '#888', fontSize: 16, fontWeight: 'bold' },
  addFoodBtn: { flexDirection: 'row', backgroundColor: '#2196F3', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center' },
  orderCard: { backgroundColor: '#111', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
  orderName: { color: '#FFF', fontSize: 16 },
  orderPrice: { color: '#888' },
  totalContainer: { marginTop: 30, padding: 20, backgroundColor: '#1A1A1A', borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: '#FFF', fontSize: 16 },
  totalValue: { color: '#FF3030', fontSize: 24, fontWeight: 'bold' },
  closeBtn: { backgroundColor: '#FF3030', padding: 18, borderRadius: 12, marginTop: 25 },
  btnText: { color: '#FFF', textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#444', textAlign: 'center', marginTop: 20 },
  // Modal Styles
  menuItemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#fffefe' },
  menuInfo: { flexDirection: 'row', alignItems: 'center' },
  menuNameText: { color: '#FFF', fontSize: 16 },
  menuCategoryTag: { color: '#888', fontSize: 12, backgroundColor: '#333', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 10 },
  menuPriceSection: { flexDirection: 'row', alignItems: 'center' },
  menuPriceText: { color: '#2196F3', fontSize: 16, fontWeight: 'bold', marginRight: 15 },
  plusIconCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#161616', height: '70%', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  menuItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#222', flexDirection: 'row', justifyContent: 'space-between' },
  menuName: { color: '#FFF', fontSize: 16 },
  menuPrice: { color: '#2196F3', fontWeight: 'bold' }
});