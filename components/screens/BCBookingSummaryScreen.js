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
import { supabase } from '../data/supabase';

const BookingSummaryScreen = ({ navigation, route }) => {

  const { 
    restaurant, 
    date, 
    time, 
    tableNumber 
  } = route.params || {};

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>สรุปการจอง</Text>

        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        
        <View style={styles.iconContainer}>
          <Ionicons name="receipt-outline" size={60} color="#ff3030" />
          <Text style={styles.subTitleText}>ตรวจสอบรายละเอียด</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>

          <View style={styles.row}>
            <Text style={styles.label}>ร้าน</Text>
            <Text style={styles.value}>{restaurant?.name || '-'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>วันที่</Text>
            <Text style={styles.value}>{formatDate(date)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>เวลา</Text>
            <Text style={styles.value}>
              {time ? `${time} น.` : '-'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
          <Text style={styles.label}>โต๊ะที่จอง</Text>
          <Text style={styles.valueText}>
          {tableNumber ? `Table ${tableNumber}` : 'ไม่ได้เลือกโต๊ะ'}
        </Text>
          </View>

        </View>

        <Text style={styles.notice}>
          กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน
        </Text>

      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
navigation.navigate('Deposit', { ...route.params })       
            
          }}
        >
          <Text style={styles.buttonText}>ยืนยันการจอง</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default BookingSummaryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },

  content: {
    flex: 1,
    paddingHorizontal: 20
  },

  iconContainer: {
    alignItems: 'center',
    marginVertical: 30
  },

  subTitleText: {
    color: '#777',
    marginTop: 10
  },

  card: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 20
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12
  },

  label: {
    color: '#777'
  },

  value: {
    color: '#fff',
    fontWeight: 'bold'
  },

  divider: {
    height: 1,
    backgroundColor: '#222'
  },

  notice: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20
  },

  footer: {
    padding: 20
  },

  button: {
    backgroundColor: '#ff3030',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center'
  },


  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12
  },

  valueText: {
    color: '#ffffff',
    fontWeight: 'bold'
  }
});