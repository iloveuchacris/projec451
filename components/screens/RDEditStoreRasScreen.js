import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, ScrollView, TextInput, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // สำหรับเลือกรูป
import { supabase } from '../data/supabase'; 

export default function EditStoreRasScreen({ route, navigation }) {
  const { restaurantId } = route.params || { restaurantId: '33edc2e8-0687-4993-a957-43efa7677127' };
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    total_tables: '',
    image_url: ''
  });

  useEffect(() => {
    fetchStoreData();
  }, [restaurantId]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurants') 
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (error) throw error;
      if (data) {
        setForm({
          name: data.name || '',
          location: data.location || '',
          description: data.description || '',
          total_tables: String(data.total_tables || 0),
          image_url: data.image_url || ''
        });
      }
    } catch (error) {
      Alert.alert("Error", "ดึงข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเลือกรูปภาพ
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      // ในที่นี้สมมติว่าคุณเก็บ URL รูป หรือจะอัปโหลดไป Supabase Storage ก่อน
      // สำหรับตอนนี้ขอยกตัวอย่างการเปลี่ยนค่าใน State ก่อนครับ
      setForm({ ...form, image_url: result.assets[0].uri });
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('restaurants')
        .update({
          name: form.name,
          location: form.location,
          description: form.description,
          total_tables: parseInt(form.total_tables),
          image_url: form.image_url // อย่าลืมจัดการเรื่องการ upload ไฟล์จริงถ้าจำเป็น
        })
        .eq('id', restaurantId);

      if (error) throw error;
      Alert.alert("สำเร็จ", "อัปเดตข้อมูลร้านค้าเรียบร้อย");
      navigation.goBack();
    } catch (error) {
      Alert.alert("ล้มเหลว", error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>จัดการข้อมูลร้าน</Text>
        <TouchableOpacity onPress={handleUpdate} disabled={updating}>
          {updating ? <ActivityIndicator color="#FF5252" /> : <Text style={styles.saveBtn}>บันทึก</Text>}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#FF5252" /></View>
      ) : (
        <ScrollView>
          {/* ส่วนจัดการรูปภาพ */}
          <TouchableOpacity style={styles.imageSection} onPress={pickImage}>
            {form.image_url ? (
              <Image source={{ uri: form.image_url }} style={styles.storeImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialCommunityIcons name="camera-plus" size={40} color="#333" />
                <Text style={{color: '#333', marginTop: 10}}>เพิ่มรูปภาพร้านค้า</Text>
              </View>
            )}
            <View style={styles.editIconBadge}>
              <MaterialCommunityIcons name="pencil" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <InputBox label="ชื่อร้านค้า" value={form.name} onChange={(v) => setForm({...form, name: v})} />
            <InputBox label="รายละเอียดร้าน" value={form.description} onChange={(v) => setForm({...form, description: v})} multiline />
            <InputBox label="ที่อยู่ร้าน" value={form.location} onChange={(v) => setForm({...form, location: v})} icon="map-marker" />
            <InputBox label="จำนวนโต๊ะทั้งหมด" value={form.total_tables} onChange={(v) => setForm({...form, total_tables: v})} keyboard="numeric" icon="table-chair" />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Component ย่อยสำหรับ Input
const InputBox = ({ label, value, onChange, multiline, keyboard, icon }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputRow, multiline && { alignItems: 'flex-start' }]}>
      {icon && <MaterialCommunityIcons name={icon} size={20} color="#FF5252" style={{marginRight: 10, marginTop: multiline ? 15 : 0}} />}
      <TextInput 
        style={[styles.input, multiline && { height: 100, paddingTop: 15 }]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        keyboardType={keyboard || 'default'}
        placeholderTextColor="#333"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  saveBtn: { color: '#FF5252', fontSize: 18, fontWeight: 'bold' },
  imageSection: { width: '100%', height: 200, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  storeImage: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center' },
  editIconBadge: { position: 'absolute', bottom: 15, right: 15, backgroundColor: '#FF5252', padding: 8, borderRadius: 20 },
  formContainer: { padding: 20 },
  inputWrapper: { marginBottom: 20 },
  label: { color: '#666', fontSize: 13, marginBottom: 8, fontWeight: 'bold' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#222' },
  input: { flex: 1, color: '#FFF', fontSize: 16, paddingVertical: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});