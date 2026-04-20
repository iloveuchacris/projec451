import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

const { width } = Dimensions.get('window');

const BookingSuccessScreen = ({ navigation, route }) => {
  const { restaurant, date, time, tableNumber } = route.params || {};
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const name = data.user?.user_metadata?.name || 'Guest';
      setUsername(name);
    };
    fetchUser();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* Success Icon Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-sharp" size={50} color="#ff3030" />
          </View>
          <Text style={styles.successTitle}>จองโต๊ะสำเร็จ!</Text>
          <Text style={styles.successSubtitle}>เราได้เตรียมโต๊ะไว้รอคุณแล้ว</Text>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>รายละเอียดการจอง</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>ชื่อผู้จอง</Text>
              <Text style={styles.value}>{username}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="restaurant-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>ร้านอาหาร</Text>
              <Text style={styles.value}>{restaurant?.name || 'ไม่ระบุ'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>วันที่และเวลา</Text>
              <Text style={styles.value}>{formatDate(date)} • {time} น.</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="grid-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>เลขโต๊ะ</Text>
              <Text style={styles.value}>Table {tableNumber}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>กลับหน้าหลัก</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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

export default BookingSuccessScreen;