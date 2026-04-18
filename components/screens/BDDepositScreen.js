import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DepositScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. Header: เพิ่มปุ่มย้อนกลับไปหน้าสรุปการจอง */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ width: 44 }} /> 
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="cash-outline" size={80} color="#ff3030" />
        </View>

        <Text style={styles.titleText}>ต้องชำระมัดจำ</Text>
        <Text style={styles.subText}>
          รับสิทธิ์ยกเลิกการรับประทานอาหาร{"\n"}ฟรีเมื่อแจ้งยกเลิกก่อนเวลาใช้บริการของคุณ
        </Text>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>จำนวนเงินมัดจำ</Text>
          <Text style={styles.amountValue}>฿100</Text>
        </View>
      </View>

      {/* 2. Footer: แก้ไข Logic ให้กดแล้วไปหน้า QR ทันที */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payButton}
          onPress={() => navigation.navigate('QRSelection')} 
        >
          <Text style={styles.payButtonText}>ชำระเงินมัดจำ</Text>
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
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    padding: 10,
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  iconContainer: { marginBottom: 30 },
  titleText: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  subText: { color: '#999', textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  amountCard: { 
    backgroundColor: '#1c1c1e', 
    padding: 40, 
    borderRadius: 25, 
    width: '85%', 
    alignItems: 'center' 
  },
  amountLabel: { color: '#999', fontSize: 16, marginBottom: 10 },
  amountValue: { color: '#ff3030', fontSize: 48, fontWeight: 'bold' },
  footer: { padding: 25, marginBottom: 20 },
  payButton: { 
    backgroundColor: '#ff3030', 
    paddingVertical: 18, 
    borderRadius: 15, 
    alignItems: 'center' 
  },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default DepositScreen;