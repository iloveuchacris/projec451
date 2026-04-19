import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BDSettingsRasScreen({ navigation }) {
  const [isAutoAccept, setIsAutoAccept] = useState(false);
  const [isNotification, setIsNotification] = useState(true);

  // ฟังก์ชันสร้างเมนูแบบแถว
  const SettingItem = ({ icon, title, subtitle, type = 'arrow', value, onValueChange }) => (
    <TouchableOpacity style={styles.settingRow} disabled={type === 'switch'}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={icon} size={24} color="#FF5252" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {type === 'arrow' && (
        <MaterialCommunityIcons name="chevron-right" size={24} color="#444" />
      )}
      {type === 'switch' && (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: "#333", true: "#FF5252" }}
          thumbColor="#FFF"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.sectionBox}>
            <SettingItem icon="storefront-outline" title="Restaurant Profile" subtitle="ชื่อร้าน, ที่อยู่, เบอร์โทรศัพท์" />
            <SettingItem icon="clock-outline" title="Opening Hours" subtitle="ตั้งค่าเวลา เปิด-ปิด ของแต่ละวัน" />
          </View>

          <Text style={styles.sectionLabel}>SYSTEM CONFIG</Text>
          <View style={styles.sectionBox}>
            <SettingItem 
              icon="robot-outline" 
              title="Auto-Accept Booking" 
              subtitle="ยืนยันการจองอัตโนมัติเมื่อโต๊ะว่าง" 
              type="switch"
              value={isAutoAccept}
              onValueChange={setIsAutoAccept}
            />
            <SettingItem 
              icon="bell-ring-outline" 
              title="Notifications" 
              subtitle="แจ้งเตือนเมื่อมีการจองใหม่" 
              type="switch"
              value={isNotification}
              onValueChange={setIsNotification}
            />
          </View>

          <Text style={styles.sectionLabel}>SUPPORT</Text>
          <View style={styles.sectionBox}>
            <SettingItem icon="help-circle-outline" title="Help Center" />
            <SettingItem icon="shield-check-outline" title="Privacy Policy" />
          </View>

          <TouchableOpacity style={styles.btnLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="#FF5252" style={{marginRight: 10}} />
            <Text style={styles.btnLogoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.4 (2026)</Text>

        </ScrollView>
      </SafeAreaView>

      {/* --- CUSTOM BOTTOM TAB BAR (ICONS ONLY) --- */}
      <View style={styles.customTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BAHomeRasScreen')}>
          <MaterialCommunityIcons name="view-dashboard-variant" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BBBookingRasScreen')}>
          <MaterialCommunityIcons name="calendar-check" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BCMenuRasScreen')}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="cog" size={28} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 25, paddingTop: 40, marginBottom: 10 },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  
  sectionLabel: { color: '#555', fontSize: 13, fontWeight: 'bold', marginTop: 25, marginBottom: 10, marginLeft: 5 },
  sectionBox: { backgroundColor: '#111', borderRadius: 20, overflow: 'hidden' },
  
  settingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#1A1A1A' 
  },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255, 82, 82, 0.1)', justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 15 },
  settingTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  settingSubtitle: { color: '#666', fontSize: 12, marginTop: 2 },

  btnLogout: { 
    flexDirection: 'row', 
    backgroundColor: '#111', 
    marginTop: 30, 
    padding: 18, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)'
  },
  btnLogoutText: { color: '#FF5252', fontWeight: 'bold', fontSize: 16 },
  versionText: { color: '#333', textAlign: 'center', marginTop: 20, fontSize: 12 },

  // Bottom Navigation (Icons Only)
  customTabBar: { 
    flexDirection: 'row', 
    backgroundColor: '#000', 
    height: 75, 
    borderTopWidth: 1, 
    borderTopColor: '#222', 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingBottom: 15 
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});