import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BookingSuccessScreen = ({ navigation, route }) => {
  const { restaurantName, date, time, guests } = route.params || {};

  // ✅ สร้าง Unique ID และ QR Data (ใช้ useMemo เพื่อไม่ให้ค่าเปลี่ยนตอน Re-render)
  const { bookingID, qrUrl } = useMemo(() => {
    const id = `RES${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
    const data = JSON.stringify({ id, restaurantName, date, time });
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`;
    return { bookingID: id, qrUrl: url };
  }, []);

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        {/* 1. Success Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={60} color="#ff3030" />
        </View>

        {/* 2. Success Message */}
        <Text style={styles.successText}>
          เราได้รับข้อมูลการจองของคุณ{"\n"}
          เรียบร้อยแล้ว เตรียมตัวสัมผัส{"\n"}
          ประสบการณ์สุดพิเศษได้เลย
        </Text>

        {/* 3. QR Code Card */}
        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>QR การจอง</Text>
          <View style={styles.qrContent}>
            <Image source={{ uri: qrUrl }} style={styles.qrImage} />
          </View>
          <Text style={styles.idText}>รหัสการจอง: {bookingID}</Text>
        </View>
      </View>

      {/* 4. Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
          <Text style={styles.homeButtonText}>กลับสู่หน้าหลัก</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ff3030' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  iconCircle: {
    width: 100, height: 100, backgroundColor: '#fff', borderRadius: 50,
    justifyContent: 'center', alignItems: 'center', marginBottom: 30,
    elevation: 10, shadowOpacity: 0.3, shadowRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }
  },
  successText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', lineHeight: 28, marginBottom: 30 },
  qrCard: { backgroundColor: 'rgba(0, 0, 0, 0.2)', width: '100%', borderRadius: 30, padding: 25, alignItems: 'center' },
  qrTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  qrContent: { backgroundColor: '#fff', padding: 10, borderRadius: 15, marginBottom: 15 },
  qrImage: { width: 180, height: 180 },
  idText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'monospace' },
  footer: { padding: 30, paddingBottom: 40 },
  homeButton: { backgroundColor: '#fff', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  homeButtonText: { color: '#ff3030', fontSize: 18, fontWeight: 'bold' },
});

export default BookingSuccessScreen;