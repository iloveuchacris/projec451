import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

export default function RBMenuSelectionScreen({ route, navigation }) {
  // รับค่า tableId และ callback จากการ navigate
  const { tableId, onReload } = route?.params || {};
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('appetizer');

  const categories = [
    { id: 'appetizer', name: 'Appetizers', icon: 'food-apple' },
    { id: 'main', name: 'Main Course', icon: 'food-turkey' },
    { id: 'dessert', name: 'Desserts', icon: 'ice-cream' },
    { id: 'drink', name: 'Drinks', icon: 'glass-wine' },
  ];

  useEffect(() => {
    if (!tableId) {
      Alert.alert('Error', 'ไม่พบข้อมูลโต๊ะ');
      navigation.goBack();
      return;
    }
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('status', 'available');
      
      if (error) throw error;
      setMenus(data || []);
    } catch (error) {
      console.error('Fetch Menus Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเพิ่มอาหาร (Logic ตาม Schema: orders -> order_items)
  const handleAddToOrder = async (item) => {
    try {
      // 1. ค้นหาออเดอร์ที่ยัง 'pending' ของโต๊ะนี้
      let { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .eq('table_id', tableId)
        .eq('status', 'pending')
        .maybeSingle(); // ใช้ maybeSingle เพื่อไม่ให้ throw error ถ้าไม่เจอ

      let currentOrderId;

      if (!order) {
        // ถ้ายังไม่มีบิลค้างอยู่ ให้สร้างหัวบิลใหม่ในตาราง orders
        const { data: newOrder, error: createError } = await supabase
          .from('orders')
          .insert([{ 
            table_id: tableId, 
            status: 'pending', 
            total_amount: 0 
          }])
          .select()
          .single();
        
        if (createError) throw createError;
        currentOrderId = newOrder.id;
      } else {
        currentOrderId = order.id;
      }

      // 2. เพิ่มรายการอาหารลงในตาราง order_items (คอลัมน์ menu_name ตาม DB)
      const { error: itemError } = await supabase
        .from('order_items')
        .insert([
          {
            order_id: currentOrderId,
            menu_name: item.name, 
            price: item.price,
            quantity: 1
          }
        ]);

      if (itemError) throw itemError;
      
      Alert.alert('สำเร็จ', `เพิ่ม ${item.name} เรียบร้อย`);
      
      // เรียก Callback เพื่อให้หน้า TableDetail อัปเดตยอดรวมทันที
      if (onReload) onReload(); 

    } catch (error) {
      console.error('Order Error:', error.message);
      Alert.alert('Error', 'ไม่สามารถเพิ่มรายการได้: ' + error.message);
    }
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuCard} onPress={() => handleAddToOrder(item)}>
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDesc} numberOfLines={1}>{item.description}</Text>
        <Text style={styles.menuPrice}>฿ {item.price.toLocaleString()}</Text>
      </View>
      <View style={styles.addIcon}>
        <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <MaterialCommunityIcons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>เลือกรายการอาหาร</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.id} 
            style={[styles.tab, category === cat.id && styles.activeTab]}
            onPress={() => setCategory(cat.id)}
          >
            <MaterialCommunityIcons 
              name={cat.icon} 
              size={20} 
              color={category === cat.id ? '#FFF' : '#666'} 
            />
            <Text style={[styles.tabText, category === cat.id && styles.activeTabText]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color="#FF5252" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={menus.filter(m => m.category === category)}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>ไม่มีรายการในหมวดหมู่นี้</Text>
          }
        />
      )}
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
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    backgroundColor: '#000' 
  },
  closeBtn: { backgroundColor: '#1A1A1A', padding: 8, borderRadius: 12 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  tabContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 10, 
    backgroundColor: '#000',
    borderBottomWidth: 0.5,
    borderBottomColor: '#222'
  },
  tab: { alignItems: 'center', padding: 10, borderRadius: 15, width: '22%' },
  activeTab: { backgroundColor: '#FF5252' },
  tabText: { color: '#666', fontSize: 10, marginTop: 4 },
  activeTabText: { color: '#FFF', fontWeight: 'bold' },
  listContent: { padding: 15 },
  menuCard: { 
    flexDirection: 'row', 
    backgroundColor: '#111', 
    marginBottom: 12, 
    padding: 15, 
    borderRadius: 20, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A1A'
  },
  menuInfo: { flex: 1 },
  menuName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  menuDesc: { color: '#666', fontSize: 12, marginVertical: 4 },
  menuPrice: { color: '#FF5252', fontSize: 15, fontWeight: 'bold', marginTop: 5 },
  addIcon: { backgroundColor: '#222', padding: 8, borderRadius: 12 },
  emptyText: { color: '#444', textAlign: 'center', marginTop: 50, fontSize: 14 },
  bottomNavContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, backgroundColor: '#000', borderTopWidth: 0.5, borderTopColor: '#222' },
  navItem: { padding: 10 }
});