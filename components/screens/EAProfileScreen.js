import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    // เพิ่ม Listener เพื่อโหลดข้อมูลใหม่ทุกครั้งที่กลับมาหน้านี้
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // 1. ตรวจสอบ User ที่ล็อกอินอยู่
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setLoading(false);
        return;
      }

      // 2. ดึงข้อมูลจากตาราง profiles โดยใช้ ID จาก Auth
      // ตรวจสอบว่าชื่อตารางคือ 'profiles' และคอลัมน์คือ 'full_name' ตามรูปใน Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error.message);
      } else {
        setProfile(data);
      }

    } catch (err) {
      console.error('System Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.signOut(); // หรือ supabase.auth.signOut()

    if (error) {
      Alert.alert('Error', 'ไม่สามารถออกจากระบบได้');
    } else {
      // ล้างคิวหน้าจอแล้วกลับไปหน้า Login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  // คอมโพเนนต์เมนูย่อย
  const MenuItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ff3030" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FF4D4D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>โปรไฟล์</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} // รูป Avatar ตัวอย่าง
              style={styles.avatar}
            />
          </View>

          {/* แสดงชื่อผู้ใช้งานที่ดึงมาจาก Database */}
          <Text style={styles.userName}>
            {(profile?.full_name || 'ไม่พบชื่อผู้ใช้').toUpperCase()}
          </Text>

          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>
              {profile?.member_status || 'STANDARD MEMBER'}
            </Text>
          </View>
        </View>

        {/* เมนูส่วนตัว */}
        <Text style={styles.sectionLabel}>เมนูส่วนตัว</Text>

        <MenuItem
          title="ประวัติการจอง"
          icon={<MaterialCommunityIcons name="history" size={22} color="#FF8A8A" />}
          onPress={() => navigation.navigate('MyBookings')} // แก้ให้ตรงกับชื่อหน้า List การจอง
        />

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} 
        onPress={() => navigation.navigate('Login')} // แก้ให้ตรงกับชื่อหน้า List การจอง
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>ออกจากระบบ</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Tab Menu */}
      <View style={styles.tab}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('MyBookingsScreen')}>
          <Ionicons name="calendar" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#ff3030" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center'
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 120 },
  profileSection: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  avatarContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#ff3030',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a'
  },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  userName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 15, letterSpacing: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff3030', marginRight: 8 },
  statusText: { color: '#ff3030', fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5 },
  sectionLabel: { color: '#666', fontSize: 13, fontWeight: 'bold', marginTop: 25, marginBottom: 12, textTransform: 'uppercase' },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1c1c1e',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center'
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { marginRight: 15 },
  menuText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#ff3030',
    padding: 16,
    borderRadius: 16,
    marginTop: 40,
    alignItems: 'center'
  },
  logoutText: { color: '#fff', marginLeft: 10, fontWeight: 'bold', fontSize: 16 },
  tab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#333'
  }
});