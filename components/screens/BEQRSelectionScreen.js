import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

const QRSelectionScreen = ({ navigation, route }) => {
  // 1. รับค่าจาก params (ตรวจสอบชื่อให้ตรงกับหน้า BookingScreen)
  const { restaurant, date, time, tableId, tableNumber, slotId } = route.params || {};
  const [loading, setLoading] = useState(false);

  const handleConfirmPayment = async () => {
  setLoading(true);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. สร้างตัวแปรเวลาให้ถูกต้อง (แก้ Error ReferenceError: dbTime)
    const formatTimeForDB = (t) => t.length === 5 ? t + ':00' : t;
    const dbTime = formatTimeForDB(time);

    // 2. บันทึกลง Database
    const { error: insertError } = await supabase
      .from('reservations')
      .insert([
        {
          user_id: user.id,
          restaurant_id: restaurant.id,
          slot_id: slotId,      // ตรวจสอบว่าหน้าก่อนส่งชื่อ slotId มาจริงไหม
          table_id: tableId,    // ตรวจสอบว่าหน้าก่อนส่งชื่อ tableId มาจริงไหม
          booking_date: date,
          booking_time: dbTime, 
          status: 'confirmed'
        }
      ]);

    if (insertError) throw insertError;

    // 3. จุดที่ทำให้เกิด Pop-up "เกิดข้อผิดพลาด" (เพราะตัวแปรด้านล่างนี้ไม่มีอยู่จริง)
    // แก้ไข: เปลี่ยนจาก selectedSlot.id เป็น slotId (หรือตัวแปรที่คุณรับมา)
    navigation.navigate('BookingSuccess', {
      restaurant,
      date,
      time,
      tableNumber // ใช้ค่าที่รับมาตรงๆ
    });

  } catch (err) {
    console.error("LOG:", err);
    Alert.alert('เกิดข้อผิดพลาด', err.message || 'กรุณาลองใหม่อีกครั้ง');
  } finally {
    setLoading(false);
  }

  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>สแกนจ่ายเงิน</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png' }} 
          style={styles.ppLogo}
          resizeMode="contain"
        />

        <View style={styles.qrCard}>
          <Text style={styles.merchantName}>RAS BOOKING</Text>
          
          <View style={styles.qrContainer}>
            {/* สามารถเปลี่ยนยอดเงินใน URL ได้ที่ช่อง 100.00 เป็น 500.00 */}
            <Image 
              source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021129370016A000000677010111011300666213198475802TH5406500.006304' }} 
              style={styles.qrImage}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>โต๊ะ {tableNumber} | ยอดที่ต้องชำระ</Text>
            <Text style={styles.amountText}>฿ 500.00</Text>
          </View>
        </View>

        <View style={styles.noticeBox}>
          <Ionicons name="information-circle-outline" size={18} color="#555" />
          <Text style={styles.noticeText}>
            เมื่อชำระเงินสำเร็จ ระบบจะยืนยันการจองอัตโนมัติ
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity 
          style={[styles.doneButton, loading && { opacity: 0.7 }]}
          onPress={handleConfirmPayment} // ✅ แก้เป็นฟังก์ชันนี้ เพื่อให้เซฟข้อมูลก่อนเปลี่ยนหน้า
          disabled={loading}             // ✅ ป้องกันการกดซ้ำตอนกำลังบันทึก
            >
            {loading ? (
          <ActivityIndicator color="#fff" /> // แสดงตัวโหลดตอนกำลังเซฟ
        ) : (
          <Text style={styles.doneButtonText}>แจ้งชำระเงินเรียบร้อย</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// ... สไตล์ (Styles) คงเดิมตามที่คุณออกแบบไว้ ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
  backButton: { padding: 10 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { alignItems: 'center', paddingVertical: 20 },
  ppLogo: { width: 140, height: 50, marginBottom: 20 },
  qrCard: { backgroundColor: '#fff', width: '85%', borderRadius: 30, padding: 25, alignItems: 'center' },
  merchantName: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  qrContainer: { width: 220, height: 220, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginBottom: 20 },
  qrImage: { width: 200, height: 200 },
  divider: { height: 1, backgroundColor: '#eee', width: '100%', marginVertical: 10 },
  amountBox: { alignItems: 'center', marginTop: 10 },
  amountLabel: { color: '#666', fontSize: 14 },
  amountText: { color: '#ff3030', fontSize: 32, fontWeight: 'bold' },
  noticeBox: { flexDirection: 'row', alignItems: 'center', marginTop: 30, paddingHorizontal: 40 },
  noticeText: { color: '#555', fontSize: 13, marginLeft: 8, textAlign: 'center' },
  footer: { padding: 25, paddingBottom: 40 },
  doneButton: { backgroundColor: '#ff3030', paddingVertical: 18, borderRadius: 15, alignItems: 'center' },
  doneButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default QRSelectionScreen;