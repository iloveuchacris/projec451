import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

export default function SettingRasScreen({ route, navigation }) {
  const { restaurantId } = route.params || {};

  const handleLogout = async () => {
    Alert.alert(
      "ออกจากระบบ",
      "คุณต้องการออกจากระบบใช่หรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        { 
          text: "ตกลง", 
          style: "destructive", 
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              
              // ล้าง stack และกลับไปหน้า Login
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginRes' }],
              });
            } catch (error) {
              Alert.alert('Error', 'ไม่สามารถออกจากระบบได้: ' + error.message);
            }
          } 
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, color = "#FFF", showArrow = true }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.itemTitle, { color: color === '#FFF' ? '#FFF' : color }]}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && <MaterialCommunityIcons name="chevron-right" size={24} color="#333" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ตั้งค่าระบบ</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ร้านค้า</Text>
          <SettingItem 
            icon="storefront-outline" 
            title="ข้อมูลร้านค้า" 
            subtitle="แก้ไขชื่อร้านและรายละเอียด"
            onPress={() => {}} 
          />
          <SettingItem 
            icon="clock-outline" 
            title="เวลาเปิด-ปิด" 
            subtitle="ตั้งเวลาให้บริการของร้าน"
            onPress={() => {}} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>บัญชีและความปลอดภัย</Text>
          <SettingItem 
            icon="shield-check-outline" 
            title="เปลี่ยนรหัสผ่าน" 
            onPress={() => {}} 
          />
          <SettingItem 
            icon="bell-ring-outline" 
            title="การแจ้งเตือน" 
            onPress={() => {}} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>อื่นๆ</Text>
          <SettingItem 
            icon="help-circle-outline" 
            title="ศูนย์ช่วยเหลือ" 
            onPress={() => {}} 
          />
          <SettingItem 
            icon="logout" 
            title="ออกจากระบบ" 
            subtitle="ออกจากบัญชีปัจจุบัน"
            color="#FF5252"
            showArrow={false}
            onPress={handleLogout} 
          />
        </View>

        <Text style={styles.versionText}>Version 1.0.0 (BETA)</Text>
      </ScrollView>
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeRas', { restaurantId })}><MaterialCommunityIcons name="home" size={26} color="#666" /></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('BookingRas', { restaurantId })}><MaterialCommunityIcons name="calendar-check" size={26} color="#666" /></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MenuRas', { restaurantId })}><MaterialCommunityIcons name="silverware-fork-knife" size={26} color="#666" /></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SettingRas', { restaurantId })}><MaterialCommunityIcons name="cog-outline" size={26} color="#ff3030" /></TouchableOpacity>
    </View>
    
          </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 20, paddingTop: 10 },
  headerTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 30 },
  section: { marginBottom: 25, paddingHorizontal: 20 },
  sectionLabel: { color: '#555', fontSize: 13, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  item: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#0A0A0A', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#111'
  },
  iconContainer: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 15 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemSubtitle: { color: '#555', fontSize: 12, marginTop: 2 },
  versionText: { color: '#222', textAlign: 'center', marginTop: 10, fontSize: 12 },
  bottomNavContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, backgroundColor: '#000', borderTopWidth: 0.5, borderTopColor: '#222' },
  navItem: { padding: 10 }
});