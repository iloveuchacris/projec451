import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QRSelectionScreen = ({ navigation, route }) => { // ✅ เพิ่มการรับ route

  const handleConfirmPayment = () => {
    // ✅ นำทางไปหน้า BookingSuccess ทันทีโดยไม่แสดง Alert
    navigation.navigate('BookingSuccess', { ...route.params });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>สแกนจ่ายเงิน</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 2. PromptPay Logo */}
        <Image 
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png' }} 
          style={styles.ppLogo}
          resizeMode="contain"
        />

        {/* 3. QR Code Card */}
        <View style={styles.qrCard}>
          <Text style={styles.merchantName}>RAS BOOKING</Text>
          
          <View style={styles.qrContainer}>
            <Image 
              source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021129370016A000000677010111011300666213198475802TH5406100.006304' }} 
              style={styles.qrImage}
            />
          </View>

        

          <View style={styles.divider} />

          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>ยอดที่ต้องชำระ</Text>
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

      {/* 4. Footer: เพิ่มปุ่มกดยืนยันที่หายไปกลับมา */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.doneButton}
          onPress={handleConfirmPayment}
        >
          <Text style={styles.doneButtonText}>แจ้งชำระเงินเรียบร้อย</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15,
    paddingVertical: 10 
  },
  backButton: { padding: 10 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { alignItems: 'center', paddingVertical: 20 },
  ppLogo: { width: 140, height: 50, marginBottom: 20 },
  qrCard: { 
    backgroundColor: '#fff', 
    width: '85%', 
    borderRadius: 30, 
    padding: 25, 
    alignItems: 'center'
  },
  merchantName: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  qrContainer: { 
    width: 220, 
    height: 220, 
    backgroundColor: '#f9f9f9', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20
  },
  qrImage: { width: 200, height: 200 },
  accountDetail: { alignItems: 'center', marginBottom: 15 },
  infoLabel: { color: '#666', fontSize: 14 },
  infoValue: { color: '#000', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#eee', width: '100%', marginVertical: 10 },
  amountBox: { alignItems: 'center', marginTop: 10 },
  amountLabel: { color: '#666', fontSize: 14 },
  amountText: { color: '#ff3030', fontSize: 32, fontWeight: 'bold' },
  noticeBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 30, 
    paddingHorizontal: 40 
  },
  noticeText: { color: '#555', fontSize: 13, marginLeft: 8, textAlign: 'center' },
  footer: { padding: 25, paddingBottom: 40 },
  doneButton: { 
    backgroundColor: '#ff3030', 
    paddingVertical: 18, 
    borderRadius: 15, 
    alignItems: 'center' 
  },
  doneButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default QRSelectionScreen;