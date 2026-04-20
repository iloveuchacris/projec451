import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

const CheckinScreen = ({ navigation, route }) => {
  // รับ bookingId จากหน้า MyBookings
  const { bookingId } = route.params || {};
  
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [isExpired, setIsExpired] = useState(false); // ✅ เพิ่ม State สำหรับเช็คหมดอายุ

  useEffect(() => {
    fetchBookingDetail();
  }, [bookingId]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      
      // 1. ดึงข้อมูล User
      const { data: userData } = await supabase.auth.getUser();
      setUsername(userData.user?.user_metadata?.display_name || userData.user?.user_metadata?.name || 'ลูกค้าผู้มีเกียรติ');

      // 2. ดึงรายละเอียดการจองแบบ Join ข้อมูลร้าน
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          id,
          booking_date,
          booking_time,
          table_id,
          status,
          restaurants (
            name,
            image_url
          )
        `)
        .eq('id', bookingId)
        .single(); // ดึงแค่แถวเดียว

      if (error) throw error;
      setBookingData(data);
      
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('ผิดพลาด', 'ไม่สามารถโหลดข้อมูลการจองได้');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatDateThai = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const handleMarkAsUsed = () => {
    Alert.alert(
      "ยืนยันการใช้งาน",
      "คุณต้องการยืนยันว่าเข้าใช้งานโต๊ะนี้แล้วใช่หรือไม่? (ข้อมูลการจองจะถูกลบทันที)",
      [
        { text: "ยกเลิก", style: "cancel" },
        { 
          text: "ยืนยัน", 
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('reservations')
                .delete()
                .eq('id', bookingId);

              if (error) throw error;

              Alert.alert("สำเร็จ", "ขอบคุณที่ใช้บริการครับ");
              navigation.navigate('MyBookings'); // กลับไปหน้าสรุป
            } catch (err) {
              Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกสถานะได้");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ปุ่มย้อนกลับ */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="ticket-sharp" size={50} color="#ff3030" />
          </View>
          <Text style={styles.successTitle}>ข้อมูลการจอง</Text>
          <Text style={styles.successSubtitle}>รหัสการจอง: #{bookingData?.id.toString().slice(0, 8)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>รายละเอียดบัตร</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#ff3030" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>ชื่อผู้เข้าใช้</Text>
              <Text style={styles.value}>{username}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="restaurant-outline" size={20} color="#ff3030" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>สถานที่</Text>
              <Text style={styles.value}>{bookingData?.restaurants?.name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#ff3030" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>วันที่และเวลา</Text>
              <Text style={styles.value}>
                {formatDateThai(bookingData?.booking_date)} • {bookingData?.booking_time.slice(0, 5)} น.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="grid-outline" size={20} color="#ff3030" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>หมายเลขโต๊ะ</Text>
              <Text style={styles.value}>Table {bookingData?.table_id}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        {!isExpired && (
          <TouchableOpacity
            style={styles.useButton}
            activeOpacity={0.8}
            onPress={handleMarkAsUsed}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color="#fff" style={{marginRight: 8}} />
            <Text style={styles.useButtonText}>เช็คอิน / ใช้งานแล้ว</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('MyBookings')}
        >
          <Text style={styles.homeButtonText}>กลับไปหน้ารายการ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CheckinScreen;
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ff3030' 
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 25 
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 90, 
    height: 90, 
    backgroundColor: '#fff', 
    borderRadius: 45,
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 8,
  },
  successTitle: { 
    color: '#fff', 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  successSubtitle: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 16 
  },
  card: { 
    backgroundColor: '#fff', 
    width: '100%', 
    borderRadius: 25, 
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5
  },
  cardHeader: {
    fontSize: 14,
    color: '#999',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
    textAlign: 'center'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  infoTextContainer: {
    marginLeft: 15
  },
  label: { 
    color: '#888', 
    fontSize: 12,
    marginBottom: 2
  },
  value: { 
    color: '#333', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    marginLeft: 35
  },
  footer: { 
    padding: 25, 
    paddingBottom: 40 
  },
  homeButton: { 
    backgroundColor: '#fff', 
    paddingVertical: 18, 
    borderRadius: 16, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  homeButtonText: { 
    color: '#ff3030', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
