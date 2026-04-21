import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NotificationsRasScreen({ navigation }) {
  // สร้าง State สำหรับเก็บค่าการเปิด-ปิดแจ้งเตือน
  const [notis, setNotis] = useState({
    newBooking: true,
    cancelBooking: true,
    marketing: false,
    systemUpdate: true,
  });

  const toggleSwitch = (key) => {
    setNotis({ ...notis, [key]: !notis[key] });
  };

  const NotiItem = ({ title, sub, value, onToggle, icon }) => (
    <View style={styles.notiCard}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name={icon} size={24} color="#FF5252" />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.notiTitle}>{title}</Text>
        <Text style={styles.notiSub}>{sub}</Text>
      </View>
      <Switch
        trackColor={{ false: "#333", true: "#FF5252" }}
        thumbColor={value ? "#FFF" : "#666"}
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>การแจ้งเตือน</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>การจอง</Text>
        <NotiItem 
          title="รายการจองใหม่"
          sub="แจ้งเตือนทันทีเมื่อมีลูกค้าจองโต๊ะเข้ามา"
          icon="calendar-plus"
          value={notis.newBooking}
          onToggle={() => toggleSwitch('newBooking')}
        />
        <NotiItem 
          title="การยกเลิกจอง"
          sub="แจ้งเตือนเมื่อลูกค้าทำการยกเลิกการจอง"
          icon="calendar-remove"
          value={notis.cancelBooking}
          onToggle={() => toggleSwitch('cancelBooking')}
        />

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>ระบบและข่าวสาร</Text>
        <NotiItem 
          title="อัปเดตระบบ"
          sub="รับข้อมูลการอัปเดตฟีเจอร์ใหม่ๆ"
          icon="cellphone-arrow-down"
          value={notis.systemUpdate}
          onToggle={() => toggleSwitch('systemUpdate')}
        />
        <NotiItem 
          title="โปรโมชั่นและข่าวสาร"
          sub="รับข่าวสารกิจกรรมพิเศษจากทางแอป"
          icon="bullhorn-outline"
          value={notis.marketing}
          onToggle={() => toggleSwitch('marketing')}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>* การปิดแจ้งเตือนบางประเภทอาจทำให้คุณพลาดข้อมูลสำคัญได้</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  sectionLabel: { color: '#444', fontSize: 13, fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase' },
  notiCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D0D0D', padding: 18, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#1A1A1A' },
  iconCircle: { width: 45, height: 45, borderRadius: 14, backgroundColor: 'rgba(255,82,82,0.1)', justifyContent: 'center', alignItems: 'center' },
  notiTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  notiSub: { color: '#666', fontSize: 12, marginTop: 2 },
  footer: { marginTop: 20, paddingHorizontal: 10 },
  footerText: { color: '#333', fontSize: 12, fontStyle: 'italic' }
});