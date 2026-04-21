import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, 
  Image, Switch, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../data/supabase';

export default function BCMenuRasScreen({ route, navigation }) {
  const { restaurantId } = route.params || {};

  // หมวดหมู่
  const categories = ['main', 'drink', 'appetizer', 'dessert'];
  const [activeCategory, setActiveCategory] = useState('main');

  const categoryMap = {
    'main': 'main',
    'drink': 'drink',
    'appetizer': 'appetizer',
    'dessert': 'dessert'
  };

  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  // Form States
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('อาหาร'); // ค่าเริ่มต้นตอนเพิ่มเมนู
  const [newItemImage, setNewItemImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, [restaurantId]);

  const fetchMenus = async () => {
    if (!restaurantId) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.log("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) setNewItemImage(result.assets[0].uri);
  };

  const handleSaveNewItem = async () => {
    if (!newItemName || !newItemPrice) {
      Alert.alert("เตือน", "กรุณาใส่ชื่อและราคา");
      return;
    }
    setIsUploading(true);
    let imageUrl = null;
    try {
      if (newItemImage) {
        const fileExt = newItemImage.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${restaurantId}/${fileName}`;
        const response = await fetch(newItemImage);
        const blob = await response.blob();
        
        // อย่าลืมตรวจสอบว่ามี bucket ชื่อ 'menu_images' และตั้งเป็น Public ใน Supabase นะครับ
        const { error: uploadError } = await supabase.storage.from('menu_images').upload(filePath, blob);
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage.from('menu_images').getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }
      
      const { data, error } = await supabase
        .from('menus')
        .insert([{
          restaurant_id: restaurantId,
          name: newItemName,
          price: parseFloat(newItemPrice),
          description: newItemDesc, // ส่งคำอธิบาย
          category: categoryMap[newItemCategory], // ส่งประเภท (main, drink, ฯลฯ)
          status: 'AVAILABLE',
          image_url: imageUrl
        }]).select();
        
      if (error) throw error;
      
      setMenuItems([data[0], ...menuItems]);
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert("ผิดพลาด", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setNewItemName(''); 
    setNewItemPrice(''); 
    setNewItemDesc('');
    setNewItemImage(null); 
    setNewItemCategory('อาหาร');
  };

  const toggleSwitch = async (id, currentStatus) => {
    const newStatus = currentStatus === 'AVAILABLE' ? 'OUT OF STOCK' : 'AVAILABLE';
    const { error } = await supabase.from('menus').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setMenuItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    }
  };

  const handleDelete = (id) => {
    Alert.alert("ลบรายการ", "ยืนยันการลบเมนูนี้?", [
      { text: "ยกเลิก", style: "cancel" },
      { text: "ลบ", style: "destructive", onPress: async () => {
          await supabase.from('menus').delete().eq('id', id);
          setMenuItems(prev => prev.filter(item => item.id !== id));
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
        </View>

        {/* Tab Categories */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.tabButton, activeCategory === cat && styles.tabActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu List */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#FF3030" style={{ marginTop: 50 }} />
          ) : (
            menuItems.filter(i => i.category === categoryMap[activeCategory]).map((item) => (
              <View key={item.id} style={[styles.card, item.status === 'OUT OF STOCK' && { opacity: 0.6 }]}>
                <View style={{ flexDirection: 'row' }}>
                  <Image 
                    source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' }} 
                    style={styles.menuImg} 
                  />
                  <View style={styles.menuInfo}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.menuName}>{item.name}</Text>
                      <Text style={styles.menuPrice}>฿{item.price}</Text>
                    </View>
                    <Text style={styles.menuDesc} numberOfLines={2}>{item.description || 'ไม่มีรายละเอียด'}</Text>
                    
                    <View style={styles.actionRow}>
                      <View style={styles.statusBox}>
                        <View style={[styles.statusDot, { backgroundColor: item.status === 'AVAILABLE' ? '#4CAF50' : '#888' }]} />
                        <Text style={{color: '#888', fontSize: 11}}>{item.status}</Text>
                      </View>
                      <View style={styles.controlGroup}>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={{marginRight: 15}}>
                          <MaterialCommunityIcons name="trash-can-outline" size={22} color="#FF3030" />
                        </TouchableOpacity>
                        <Switch
                          value={item.status === 'AVAILABLE'}
                          onValueChange={() => toggleSwitch(item.id, item.status)}
                          trackColor={{ false: '#333', true: '#FF3030' }}
                          thumbColor="#FFF"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Floating Plus Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="plus" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* --- Bottom Tab Bar --- */}
      <View style={styles.customTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('HomeRas', { restaurantId })}>
          <MaterialCommunityIcons name="view-dashboard" size={28} color="#888" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BookingRas', { restaurantId })}>
          <MaterialCommunityIcons name="calendar-check" size={28} color="#888" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} activeOpacity={1}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={28} color="#FF3030" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('SettingRas', { restaurantId })}>
          <MaterialCommunityIcons name="cog" size={28} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Modal เพิ่มเมนู */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>เพิ่มเมนูใหม่</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* เลือกรูป */}
              <TouchableOpacity style={styles.imageUploadBtn} onPress={pickImage}>
                {newItemImage ? (
                  <Image source={{uri: newItemImage}} style={styles.uploadedImage} />
                ) : (
                  <View style={{alignItems: 'center'}}>
                    <MaterialCommunityIcons name="camera-plus" size={30} color="#666" style={{marginBottom: 5}}/>
                    <Text style={{color:'#666'}}>เลือกรูปภาพ</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {/* ชื่อและราคา */}
              <TextInput style={styles.input} placeholder="ชื่อเมนู" placeholderTextColor="#666" value={newItemName} onChangeText={setNewItemName} />
              <TextInput style={styles.input} placeholder="ราคา" placeholderTextColor="#666" keyboardType="numeric" value={newItemPrice} onChangeText={setNewItemPrice} />
              
              {/* คำอธิบาย */}
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="คำอธิบายอาหาร (เช่น วัตถุดิบ, รสชาติ)" 
                placeholderTextColor="#666" 
                multiline={true} 
                numberOfLines={3} 
                value={newItemDesc} 
                onChangeText={setNewItemDesc} 
              />

              {/* เลือกประเภทอาหาร */}
              <Text style={styles.label}>ประเภทอาหาร</Text>
              <View style={styles.categoryRowModal}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryBtn, newItemCategory === cat && styles.categoryBtnActive]}
                    onPress={() => setNewItemCategory(cat)}
                  >
                    <Text style={[styles.categoryBtnText, newItemCategory === cat && styles.textWhite]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActionGroup}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => { setModalVisible(false); resetForm(); }}>
                <Text style={{color:'#888', fontWeight: 'bold'}}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btnSave, isUploading && { opacity: 0.6 }]} 
                onPress={handleSaveNewItem}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={{color:'#FFF', fontWeight: 'bold'}}>บันทึก</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 25, paddingTop: 40 },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  tabButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#1A1A1A', marginRight: 10 },
  tabActive: { backgroundColor: '#FF3030' },
  tabText: { color: '#666', fontWeight: 'bold' },
  tabTextActive: { color: '#FFF' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { backgroundColor: '#121212', borderRadius: 25, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#1A1A1A' },
  menuImg: { width: 80, height: 80, borderRadius: 15 },
  menuInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  menuName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  menuPrice: { color: '#FF3030', fontSize: 18, fontWeight: 'bold' },
  menuDesc: { color: '#666', fontSize: 12, marginTop: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  statusBox: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  controlGroup: { flexDirection: 'row', alignItems: 'center' },
  fab: { position: 'absolute', right: 20, bottom: 85, width: 56, height: 56, borderRadius: 28, backgroundColor: '#FF5252', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  
  customTabBar: { 
    flexDirection: 'row', 
    backgroundColor: '#000', 
    height: 65, 
    borderTopWidth: 1, 
    borderTopColor: '#1A1A1A', 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    justifyContent: 'space-around', 
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 15 : 0 
  },
  tabItem: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100%' 
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', maxHeight: '85%', backgroundColor: '#1A1A1A', borderRadius: 25, padding: 25 },
  modalTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  imageUploadBtn: { width: '100%', height: 160, backgroundColor: '#222', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15, overflow: 'hidden' },
  uploadedImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  input: { backgroundColor: '#222', color: '#FFF', borderRadius: 12, padding: 15, marginBottom: 12, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  
  // Style สำหรับหมวดหมู่ใน Modal
  label: { color: '#888', marginBottom: 10, marginLeft: 5 },
  categoryRowModal: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  categoryBtn: { backgroundColor: '#222', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15, marginRight: 8, marginBottom: 8 },
  categoryBtnActive: { backgroundColor: '#FF3030' },
  categoryBtnText: { color: '#888', fontSize: 13, fontWeight: 'bold' },
  textWhite: { color: '#FFF' },

  modalActionGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  btnCancel: { flex: 1, padding: 15, alignItems: 'center' },
  btnSave: { flex: 1.5, backgroundColor: '#FF3030', padding: 15, borderRadius: 15, alignItems: 'center' }
});