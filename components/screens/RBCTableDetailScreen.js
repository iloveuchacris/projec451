import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

export default function RATableDetailScreen({ route, navigation }) {
  // 1. รับค่า table และ restaurantId (ส่งมาจากหน้า Home)
  const { table, restaurantId } = route.params || {}; 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTableStatus, setCurrentTableStatus] = useState(table?.status); // สร้าง state เพื่ออัปเดต UI ทันที

  useEffect(() => {
    if (!table?.id) {
      navigation.goBack();
      return;
    }

    if (currentTableStatus === 'occupied') {
      fetchOrders();
    }
  }, [currentTableStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          menu_name,
          price,
          quantity,
          orders!inner(id, table_id, status)
        `)
        .eq('orders.table_id', table.id)
        .eq('orders.status', 'pending');

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Fetch Orders Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    Alert.alert('ยืนยันการลบ', 'ลบรายการอาหารนี้ใช่หรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      { 
        text: 'ลบ', 
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase
            .from('order_items')
            .delete()
            .eq('id', itemId);
          
          if (!error) {
            setOrders(prev => prev.filter(item => item.id !== itemId));
          }
        }
      }
    ]);
  };

  // 2. ฟังก์ชันเปิดโต๊ะ (handleOpenBill)
  const handleOpenBill = async () => {
    try {
      const { error } = await supabase
        .from('restaurant_tables')
        .update({ status: 'occupied' })
        .eq('id', table.id);

      if (error) throw error;
      
      setCurrentTableStatus('occupied'); // อัปเดตสถานะในหน้าจอ
      Alert.alert('สำเร็จ', 'เปิดโต๊ะเรียบร้อยแล้ว');
    } catch (error) {
      Alert.alert('Error', 'ไม่สามารถเปิดโต๊ะได้');
    }
  };

  const handleCloseBill = async () => {
    try {
      const { data: currentOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('table_id', table.id)
        .eq('status', 'pending')
        .single();

      if (currentOrder) {
        await supabase.from('orders').update({ status: 'paid' }).eq('id', currentOrder.id);
      }

      await supabase.from('restaurant_tables').update({ status: 'available' }).eq('id', table.id);

      Alert.alert('สำเร็จ', 'เช็คบิลเรียบร้อย');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'เกิดข้อผิดพลาดในการเช็คบิล');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={32} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Table {table?.label || table?.id}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.content}>
        {currentTableStatus === 'occupied' ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>รายการอาหาร</Text>
              {/* ส่ง restaurantId และ tableId ไปที่หน้า MenuSelection */}
              <TouchableOpacity 
                style={styles.addFoodBtn}
                onPress={() => navigation.navigate('MenuSelection', { 
                  tableId: table.id, 
                  restaurantId: restaurantId, 
                  onReload: fetchOrders 
                })}
              >
                <MaterialCommunityIcons name="plus-circle" size={20} color="#FFF" />
                <Text style={styles.addFoodText}>เพิ่มรายการ</Text>
              </TouchableOpacity>
            </View>

            {loading ? <ActivityIndicator color="#FF5252" style={{ marginTop: 20 }} /> : (
              orders.length > 0 ? (
                orders.map((item) => (
                    <View key={item.id} style={styles.orderItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.orderName}>{item.menu_name}</Text>
                        <Text style={styles.orderPrice}>฿{(item.price * item.quantity).toLocaleString()} (x{item.quantity})</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                        <MaterialCommunityIcons name="trash-can-outline" size={22} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  ))
              ) : (
                <Text style={styles.noOrderText}>ยังไม่มีรายการอาหาร</Text>
              )
            )}
            
            {orders.length > 0 && (
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>ราคารวมทั้งสิ้น</Text>
                    <Text style={styles.totalAmount}>฿ {orders.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()}</Text>
                </View>
            )}

            <TouchableOpacity 
              style={[styles.closeBillBtn, orders.length === 0 && { opacity: 0.5 }]} 
              onPress={handleCloseBill}
            >
              <Text style={styles.btnText}>เช็คบิล / เคลียร์โต๊ะ</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-plus-outline" size={80} color="#333" />
            <Text style={styles.emptyText}>โต๊ะนี้สถานะว่าง</Text>
            {/* เพิ่มปุ่มเปิดโต๊ะกลับคืนมา */}
            <TouchableOpacity style={styles.openBillBtn} onPress={handleOpenBill}>
              <Text style={styles.btnText}>เปิดโต๊ะ (Walk-in)</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeRas', { restaurantId })}><MaterialCommunityIcons name="home" size={26} color="#ff3030" /></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('BookingRas', { restaurantId })}><MaterialCommunityIcons name="calendar-check" size={26} color="#666" /></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MenuRas', { restaurantId })}><MaterialCommunityIcons name="silverware-fork-knife" size={26} color="#666" /></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SettingRas', { restaurantId })}><MaterialCommunityIcons name="cog-outline" size={26} color="#666" /></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10 },
  backBtn: { backgroundColor: '#1A1A1A', borderRadius: 12, padding: 4 },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  content: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { color: '#AAA', fontSize: 16, fontWeight: '600' },
  addFoodBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  addFoodText: { color: '#FFF', marginLeft: 5, fontSize: 14, fontWeight: 'bold' },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: '#222' },
  orderName: { color: '#FFF', fontSize: 16, fontWeight: '500', marginBottom: 4 },
  orderPrice: { color: '#666', fontSize: 14 },
  noOrderText: { color: '#444', textAlign: 'center', marginTop: 40, fontSize: 16, fontStyle: 'italic' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, paddingTop: 20, borderTopWidth: 2, borderTopColor: '#333' },
  totalLabel: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  totalAmount: { color: '#FF5252', fontSize: 24, fontWeight: 'bold' },
  closeBillBtn: { backgroundColor: '#FF5252', padding: 18, borderRadius: 15, marginTop: 40, alignItems: 'center' },
  openBillBtn: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 15, marginTop: 20, width: '100%', alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#666', fontSize: 18, marginVertical: 20 },
  bottomNavContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, backgroundColor: '#000', borderTopWidth: 0.5, borderTopColor: '#222' },
  navItem: { padding: 10 }
});