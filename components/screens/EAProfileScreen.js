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
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, member_status')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.log(error.message);
      } else {
        setProfile(data);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Error', 'ไม่สามารถออกจากระบบได้');
    } else {
      navigation.replace('Login');
    }
  };

  const MenuItem = ({ icon, title, onPress, showBorder = false }) => (
    <TouchableOpacity
      style={[styles.menuItem, showBorder && styles.borderBottom]}
      onPress={onPress}
    >
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FF4D4D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>โปรไฟล์</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
          </View>

          <Text style={styles.userName}>
            {(profile?.full_name || 'USER').toUpperCase()}
          </Text>

          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>
              {profile?.member_status || 'MEMBER'}
            </Text>
          </View>
        </View>

        {/* Menu */}
        <Text style={styles.sectionLabel}>เมนูส่วนตัว</Text>

        <MenuItem
          title="ประวัติการจอง"
          icon={<MaterialCommunityIcons name="history" size={22} color="#FF8A8A" />}
          onPress={() => navigation.navigate('MyBookings')}
        />

        <MenuItem
          title="รายการโปรด"
          icon={<Ionicons name="heart" size={22} color="#FF8A8A" />}
        />

        <Text style={styles.sectionLabel}>การตั้งค่า</Text>

        <MenuItem
          title="การแจ้งเตือน"
          icon={<Ionicons name="notifications-outline" size={22} color="#fff" />}
        />

        <MenuItem
          title="ความเป็นส่วนตัว"
          icon={<Ionicons name="lock-closed-outline" size={22} color="#fff" />}
        />

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>ออกจากระบบ</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Tab */}
      <View style={styles.tab}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('MyBookings')}>
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

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    alignItems: 'center'
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },

  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 100
  },

  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
  },

  avatarContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#ff3030',
    justifyContent: 'center',
    alignItems: 'center'
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60
  },

  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff3030',
    marginRight: 8
  },

  statusText: {
    color: '#ff3030',
    fontSize: 13,
    fontWeight: '600'
  },

  sectionLabel: {
    color: '#888',
    marginTop: 20,
    marginBottom: 10
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1c1c1e',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center'
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  iconContainer: {
    marginRight: 10
  },

  menuText: {
    color: '#fff',
    fontSize: 15
  },

  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#ff3030',
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center'
  },

  logoutText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold'
  },

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