import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const initialMenu = [
  {
    id: '1',
    name: 'Truffle Risotto',
    price: '$34',
    description: 'Arborio rice, wild mushrooms, aged parmesan, fresh black truffle.',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=200&auto=format&fit=crop',
    available: true,
    category: 'Food'
  },
  {
    id: '2',
    name: 'Wagyu Ribeye',
    price: '$85',
    description: 'A5 grade Wagyu, charred asparagus, smoked garlic butter.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=200&auto=format&fit=crop',
    available: true,
    category: 'Food'
  },
  {
    id: '3',
    name: 'Lobster Thermidor',
    price: '$65',
    description: 'Fresh catch, cognac cream sauce, gruyere crust.',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=200&auto=format&fit=crop',
    available: false,
    category: 'Food'
  }
];

export default function BCMenuRasScreen({ navigation }) {
  const [menuItems, setMenuItems] = useState(initialMenu);
  const [activeCategory, setActiveCategory] = useState('Food');

  // ฟังก์ชันสลับสถานะเมนูหมด/พร้อมขาย
  const toggleSwitch = (id) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  // ฟังก์ชันลบเมนู
  const deleteItem = (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
        setMenuItems(prev => prev.filter(item => item.id !== id));
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header ตามดีไซน์ภาพที่ 4 */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.brandName}>ResBooking</Text>
          <Text style={styles.openStatus}>OPEN</Text>
        </View>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.headerTitle}>Menu</Text>
            <Text style={styles.headerSub}>Manage your offerings.</Text>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <MaterialCommunityIcons name="magnify" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        {['Food', 'Drinks', 'Dessert'].map((cat) => (
          <TouchableOpacity 
            key={cat} 
            style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {menuItems.map((item) => (
          <View key={item.id} style={[styles.menuCard, !item.available && styles.disabledCard]}>
            <Image source={{ uri: item.image }} style={styles.menuImage} />
            <View style={styles.menuInfo}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuPrice}>{item.price}</Text>
              </View>
              <Text style={styles.menuDesc} numberOfLines={2}>{item.description}</Text>
              
              <View style={styles.cardFooter}>
                <View style={styles.statusRow}>
                  <View style={[styles.dot, { backgroundColor: item.available ? '#4CAF50' : '#888' }]} />
                  <Text style={[styles.statusLabel, { color: item.available ? '#4CAF50' : '#888' }]}>
                    {item.available ? 'AVAILABLE' : 'OUT OF STOCK'}
                  </Text>
                </View>
                
                <View style={styles.actionControls}>
                  <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteBtn}>
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#FF3030" />
                  </TouchableOpacity>
                  <Switch
                    trackColor={{ false: "#333", true: "#FF3030" }}
                    thumbColor={item.available ? "#FFF" : "#666"}
                    onValueChange={() => toggleSwitch(item.id)}
                    value={item.available}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="plus" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Bottom Nav ตามโทนสีที่กำหนด */}
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeRas')}>
          <MaterialCommunityIcons name="view-grid" size={26} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('BookingRas')}>
          <MaterialCommunityIcons name="calendar-check" size={26} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={26} color="#FF3030" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="cog-outline" size={26} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  brandName: { color: '#FF3030', fontSize: 18, fontWeight: 'bold' },
  openStatus: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  headerSub: { color: '#888', fontSize: 14 },
  searchBtn: { backgroundColor: '#1A1A1A', padding: 12, borderRadius: 50 },

  categoryContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  catBtn: { paddingVertical: 10, paddingHorizontal: 25, borderRadius: 12, backgroundColor: '#1A1A1A', marginRight: 10 },
  catBtnActive: { backgroundColor: '#FF3030' },
  catText: { color: '#888', fontWeight: 'bold' },
  catTextActive: { color: '#FFF' },

  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  menuCard: { backgroundColor: '#161618', borderRadius: 20, flexDirection: 'row', padding: 12, marginBottom: 15 },
  disabledCard: { opacity: 0.6 },
  menuImage: { width: 90, height: 90, borderRadius: 15 },
  menuInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  menuName: { color: '#FFF', fontSize: 16, fontWeight: 'bold', width: '70%' },
  menuPrice: { color: '#FF3030', fontSize: 16, fontWeight: 'bold' },
  menuDesc: { color: '#888', fontSize: 12, marginVertical: 4 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusLabel: { fontSize: 10, fontWeight: 'bold' },
  
  actionControls: { flexDirection: 'row', alignItems: 'center' },
  deleteBtn: { marginRight: 15 },

  fab: { position: 'absolute', right: 25, bottom: 100, backgroundColor: '#FF3030', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },

  bottomNavContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 15, 
    backgroundColor: '#111', 
    borderTopWidth: 1, 
    borderTopColor: '#222',
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  navItem: { padding: 10 }
});