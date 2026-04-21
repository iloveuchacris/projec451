import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../data/supabase';

export default function OpeningHoursRasScreen({ route, navigation }) {
  const { restaurantId } = route.params || { restaurantId: '33edc2e8-0687-4993-a957-43efa7677127' };
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // เก็บสถานะเวลา (ใช้ Date Object เพื่อให้ Picker ทำงานได้)
  const [openTime, setOpenTime] = useState(new Date());
  const [closeTime, setCloseTime] = useState(new Date());
  
  // สถานะการเปิด/ปิดตัวเลือกเวลา
  const [showOpenPicker, setShowOpenPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select('open_time, close_time')
        .eq('id', restaurantId)
        .single();

      if (data) {
        // แปลง "HH:mm:ss" จาก DB ให้เป็น Date Object
        if (data.open_time) setOpenTime(new Date(`2024-01-01T${data.open_time}`));
        if (data.close_time) setCloseTime(new Date(`2024-01-01T${data.close_time}`));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      // แปลงกลับเป็น Format "HH:mm" เพื่อลงฐานข้อมูล
      const openStr = openTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const closeStr = closeTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      const { error } = await supabase
        .from('restaurants')
        .update({ open_time: openStr, close_time: closeStr })
        .eq('id', restaurantId);

      if (error) throw error;
      Alert.alert("สำเร็จ", "อัปเดตเวลาเปิด-ปิดร้านแล้ว");
      navigation.goBack();
    } catch (err) {
      Alert.alert("ล้มเหลว", err.message);
    } finally {
      setUpdating(false);
    }
  };

  const onOpenChange = (event, selectedDate) => {
    setShowOpenPicker(false);
    if (selectedDate) setOpenTime(selectedDate);
  };

  const onCloseChange = (event, selectedDate) => {
    setShowClosePicker(false);
    if (selectedDate) setCloseTime(selectedDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>เวลาทำการ</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#FF5252" /></View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.subLabel}>กำหนดเวลาเปิดและปิดให้บริการของร้านคุณ</Text>

          {/* ปุ่มเลือกเวลาเปิด */}
          <TouchableOpacity style={styles.timeCard} onPress={() => setShowOpenPicker(true)}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="clock-start" size={24} color="#FF5252" />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.cardLabel}>เวลาเปิดร้าน</Text>
              <Text style={styles.timeText}>
                {openTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} น.
              </Text>
            </View>
            <MaterialCommunityIcons name="pencil" size={20} color="#333" />
          </TouchableOpacity>

          {/* ปุ่มเลือกเวลาปิด */}
          <TouchableOpacity style={styles.timeCard} onPress={() => setShowClosePicker(true)}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(102,102,102,0.1)' }]}>
              <MaterialCommunityIcons name="clock-end" size={24} color="#666" />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.cardLabel}>เวลาปิดร้าน</Text>
              <Text style={styles.timeText}>
                {closeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} น.
              </Text>
            </View>
            <MaterialCommunityIcons name="pencil" size={20} color="#333" />
          </TouchableOpacity>

          {showOpenPicker && (
            <DateTimePicker value={openTime} mode="time" is24Hour={true} onChange={onOpenChange} />
          )}
          {showClosePicker && (
            <DateTimePicker value={closeTime} mode="time" is24Hour={true} onChange={onCloseChange} />
          )}

          <TouchableOpacity 
            style={[styles.saveButton, updating && { opacity: 0.7 }]} 
            onPress={handleUpdate}
            disabled={updating}
          >
            {updating ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>บันทึกข้อมูล</Text>}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  subLabel: { color: '#666', marginBottom: 30 },
  timeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D0D0D', padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#1A1A1A' },
  iconCircle: { width: 50, height: 50, borderRadius: 15, backgroundColor: 'rgba(255,82,82,0.1)', justifyContent: 'center', alignItems: 'center' },
  cardLabel: { color: '#666', fontSize: 12, marginBottom: 4 },
  timeText: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  saveButton: { backgroundColor: '#FF5252', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 30 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});