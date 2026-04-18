import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BookingSummaryScreen = ({ navigation, route }) => {
  // ✅ 1. รับข้อมูลที่ส่งมาจากหน้า BookingScreen
  // ต้องสะกดชื่อตัวแปรให้ตรงกับหน้า Booking (restaurant, date, time, guests)
  const { 
    restaurant, 
    date, 
    time, 
    guests 
  } = route.params || {};

  // ✅ 2. ฟังก์ชันแปลงรูปแบบวันที่ (ทางเลือก: เพื่อให้แสดงผลสวยขึ้น)
  const formatDate = (dateString) => {
    if(!dateString) return 'ไม่ได้ระบุวันที่';
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>สรุปการจอง</Text>
        <View style={{ width: 44 }} /> 
      </View>

      <View style={styles.content}>
        {/* ไอคอนแสดงความสำเร็จ/สรุป */}
        <View style={styles.iconContainer}>
          <Ionicons name="receipt-outline" size={60} color="#ff3030" />
          <Text style={styles.subTitleText}>ตรวจสอบรายละเอียดการจอง</Text>
        </View>

        {/* Card แสดงข้อมูลการจอง */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>ร้านอาหาร</Text>
            </View>
            <Text style={styles.valueText}>{restaurant?.name || 'ไม่ได้ระบุชื่อร้าน'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>วันที่จอง</Text>
            </View>
            {/* ใช้ formatDate เพื่อความสวยงาม หรือใช้ date ตรงๆ ก็ได้ */}
            <Text style={styles.valueText}>{formatDate(date)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>เวลา</Text>
            </View>
            <Text style={styles.valueText}>{time} น.</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>จำนวนที่นั่ง</Text>
            <Text style={styles.valueText}>{guests} ท่าน</Text>
          </View>
        </View>

        <View style={styles.noticeContainer}>
          <Ionicons name="information-circle-outline" size={16} color="#555" style={{marginBottom: 5}} />
          <Text style={styles.noticeText}>
            กรุณาตรวจสอบข้อมูลการจองของท่าน{"\n"}ให้เรียบร้อยก่อนกดยืนยันเพื่อชำระเงินมัดจำ
          </Text>
        </View>
      </View>

      {/* Footer ปุ่มกดยืนยัน */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => navigation.navigate('Deposit', { ...route.params })} // ส่งข้อมูลต่อไปหน้ามัดจำด้วย
        >
          <Text style={styles.confirmButtonText}>ยืนยันข้อมูลการจอง</Text>
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
    paddingVertical: 15,
  },
  backButton: { padding: 5 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 25, paddingTop: 20 },
  iconContainer: { alignItems: 'center', marginBottom: 30 },
  subTitleText: { color: '#999', marginTop: 15, fontSize: 16 },
  card: { 
    backgroundColor: '#1c1c1e', 
    borderRadius: 30, 
    padding: 25, 
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#333' 
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 12 
  },
  label: { color: '#999', fontSize: 15 },
  valueText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#2c2c2e', marginVertical: 5 },
  noticeContainer: { alignItems: 'center', marginTop: 10 },
  noticeText: { color: '#555', textAlign: 'center', fontSize: 13, lineHeight: 20 },
  footer: { padding: 25, paddingBottom: 40 },
  confirmButton: { 
    backgroundColor: '#ff3030', 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center',
    shadowColor: '#ff3030',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  confirmButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default BookingSummaryScreen;