import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BCMenuRasScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('Food');

  // ข้อมูลเมนูอาหารตามรูปภาพ
  const [menuItems, setMenuItems] = useState([
    { 
      id: '1', 
      name: 'Truffle Risotto', 
      price: '$34', 
      desc: 'Arborio rice, wild mushrooms, aged parmesan, fresh black truffle.', 
      status: 'AVAILABLE', 
      category: 'Food',
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400' 
    },
    { 
      id: '2', 
      name: 'Wagyu Ribeye', 
      price: '$85', 
      desc: 'A5 grade Wagyu, charred asparagus, smoked garlic butter.', 
      status: 'AVAILABLE', 
      category: 'Food',
      image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400' 
    },
    { 
      id: '3', 
      name: 'Lobster Thermidor', 
      price: '$65', 
      desc: 'Fresh catch, cognac cream sauce, gruyere crust.', 
      status: 'OUT OF STOCK', 
      category: 'Food',
      image: 'https://images.unsplash.com/photo-1553163112-8221c22d616c?w=400' 
    }
  ]);

  // ฟังก์ชันสลับสถานะเปิด-ปิดเมนู
  const toggleSwitch = (id) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === 'AVAILABLE' ? 'OUT OF STOCK' : 'AVAILABLE' } : item
    ));
  };

  // ฟังก์ชันลบเมนู
  const handleDelete = (id) => {
    Alert.alert("ลบรายการ", "คุณต้องการลบเมนูนี้ใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      { text: "ลบ", style: "destructive", onPress: () => setMenuItems(prev => prev.filter(item => item.id !== id)) }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.brandName}><Text style={{color: '#FF4D4D'}}>Res</Text>Booking</Text>
          <Text style={styles.statusOpen}>OPEN</Text>
        </View>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.titleText}>Menu</Text>
            <Text style={styles.subTitleText}>Manage your offerings.</Text>
          </View>
          <TouchableOpacity style={styles.searchCircle}>
            <MaterialCommunityIcons name="magnify" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabBar}>
        {['Food', 'Drinks', 'Dessert'].map((cat) => (
          <TouchableOpacity 
            key={cat} 
            style={[styles.tabBtn, activeCategory === cat && styles.tabBtnActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {menuItems.filter(i => i.category === activeCategory).map((item) => (
          <View key={item.id} style={[styles.menuCard, item.status === 'OUT OF STOCK' && { opacity: 0.6 }]}>
            <Image source={{ uri: item.image }} style={styles.menuImg} />
            <View style={styles.menuInfo}>
              <View style={styles.menuHeaderRow}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuPrice}>{item.price}</Text>
              </View>
              <Text style={styles.menuDesc} numberOfLines={2}>{item.desc}</Text>
              
              <View style={styles.menuActionRow}>
                <View style={styles.statusBox}>
                  <View style={[styles.statusDot, { backgroundColor: item.status === 'AVAILABLE' ? '#4CAF50' : '#888' }]} />
                  <Text style={[styles.statusLabel, { color: item.status === 'AVAILABLE' ? '#4CAF50' : '#888' }]}>{item.status}</Text>
                </View>
                
                <View style={styles.controlGroup}>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={{marginRight: 15}}>
                    <MaterialCommunityIcons name="trash-can-outline" size={22} color="#FF4D4D" />
                  </TouchableOpacity>
                  <Switch
                    value={item.status === 'AVAILABLE'}
                    onValueChange={() => toggleSwitch(item.id)}
                    trackColor={{ false: '#333', true: '#FF4D4D' }}
                    thumbColor={'#FFF'}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="plus" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeRas')} style={styles.navItem}>
          <MaterialCommunityIcons name="view-grid" size={24} color="#666" />
          <Text style={styles.navText}>DASHBOARD</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('BookingRas')} style={styles.navItem}>
          <MaterialCommunityIcons name="calendar-check" size={24} color="#666" />
          <Text style={styles.navText}>BOOKINGS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <View style={styles.activeIconBg}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#FF4D4D" />
          </View>
          <Text style={[styles.navText, {color: '#FF4D4D'}]}>MENU</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="cog-outline" size={24} color="#666" />
          <Text style={styles.navText}>SETTINGS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  brandName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  statusOpen: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  subTitleText: { color: '#888', fontSize: 14 },
  searchCircle: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  
  tabBar: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 },
  tabBtn: { paddingVertical: 10, paddingHorizontal: 25, borderRadius: 20, backgroundColor: '#1A1A1A', marginRight: 10 },
  tabBtnActive: { backgroundColor: '#FF4D4D' },
  tabText: { color: '#888', fontWeight: 'bold' },
  tabTextActive: { color: '#FFF' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  menuCard: { backgroundColor: '#111', borderRadius: 20, padding: 12, flexDirection: 'row', marginBottom: 15 },
  menuImg: { width: 90, height: 90, borderRadius: 15 },
  menuInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  menuHeaderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  menuName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  menuPrice: { color: '#FF4D4D', fontSize: 16, fontWeight: 'bold' },
  menuDesc: { color: '#666', fontSize: 12, marginTop: 4 },
  
  menuActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  statusBox: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusLabel: { fontSize: 10, fontWeight: 'bold' },
  controlGroup: { flexDirection: 'row', alignItems: 'center' },

  fab: { position: 'absolute', right: 20, bottom: 100, width: 60, height: 60, borderRadius: 30, backgroundColor: '#FF4D4D', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#111', paddingVertical: 10, position: 'absolute', bottom: 0, width: '100%', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  navItem: { alignItems: 'center' },
  navItemActive: { alignItems: 'center', marginTop: -5 },
  activeIconBg: { backgroundColor: '#222', padding: 8, borderRadius: 12, marginBottom: 2 },
  navText: { color: '#666', fontSize: 10, fontWeight: 'bold', marginTop: 4 }
});