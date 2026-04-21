import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, 
  ActivityIndicator, Alert, Platform 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../data/supabase';

export default function SettingRasScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const restaurantId = route.params?.restaurantId || '33edc2e8-0687-4993-a957-43efa7677127';
  
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [restaurantId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('name')
        .eq('id', restaurantId)
        .single();
      if (data) setRestaurantData(data);
    } catch (e) {
      console.log("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const MenuButton = ({ title, subTitle, icon, iconColor, bgColor, onPress }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.item, 
        { backgroundColor: pressed ? '#121212' : '#0D0D0D' }
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSub}>{subTitle}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#333" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        
        {/* --- 1. Header --- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ตั้งค่าระบบ</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#FF5252" style={{ alignSelf: 'flex-start', marginTop: 5 }} />
          ) : (
            <Text style={styles.restaurantName}>
              {restaurantData ? `ร้าน: ${restaurantData.name}` : 'ไม่พบข้อมูลร้าน'}
            </Text>
          )}
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ข้อมูลร้านค้า</Text>
            <MenuButton 
              title="ข้อมูลร้านค้า"
              subTitle="แก้ไขรายละเอียด พิกัด และชื่อร้าน"
              icon="storefront-outline"
              iconColor="#FF5252"
              bgColor="rgba(255,82,82,0.1)"
              onPress={() => navigation.navigate('EditStoreRas', { restaurantId })}
            />
            <MenuButton 
              title="เวลาเปิด-ปิดร้าน"
              subTitle="กำหนดเวลาให้บริการในแต่ละวัน"
              icon="clock-outline"
              iconColor="#529EFF"
              bgColor="rgba(82,158,255,0.1)"
              onPress={() => navigation.navigate('OpeningHoursRas', { restaurantId })}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ความปลอดภัย</Text>
            <MenuButton 
              title="เปลี่ยนรหัสผ่าน"
              subTitle="เปลี่ยนรหัสผ่านเพื่อความปลอดภัยของบัญชี"
              icon="lock-reset"
              iconColor="#FFA500"
              bgColor="rgba(255,165,0,0.1)"
              onPress={() => navigation.navigate('ChangePasswordRas')}
            />
            <MenuButton 
              title="การแจ้งเตือน"
              subTitle="ตั้งค่าการแจ้งเตือนการจองและระบบ"
              icon="bell-outline"
              iconColor="#00C853"
              bgColor="rgba(0,200,83,0.1)"
              onPress={() => navigation.navigate('NotificationsRas')}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ช่วยเหลือ</Text>
            <MenuButton 
              title="ศูนย์ช่วยเหลือ"
              subTitle="ติดต่อเจ้าหน้าที่หรือดูวิธีใช้งาน"
              icon="help-circle-outline"
              iconColor="#9C27B0"
              bgColor="rgba(156,39,176,0.1)"
              onPress={() => navigation.navigate('HelpCenterRas')}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>บัญชีผู้ใช้</Text>
            <Pressable 
              style={({ pressed }) => [
                styles.item, 
                { backgroundColor: pressed ? '#1A1A1A' : '#0D0D0D', borderColor: 'rgba(255,82,82,0.1)' }
              ]}
              onPress={() => {
                Alert.alert("ยืนยัน", "คุณต้องการออกจากระบบใช่หรือไม่?", [
                  { text: "ยกเลิก", style: "cancel" },
                  { text: "ตกลง", onPress: async () => {
                      await supabase.auth.signOut();
                      navigation.reset({ index: 0, routes: [{ name: 'LoginResScreen' }] });
                  }}
                ]);
              }}
            >
              <View style={[styles.iconBox, { backgroundColor: 'rgba(255,82,82,0.1)' }]}>
                <MaterialCommunityIcons name="logout" size={24} color="#FF5252" />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.itemTitle, { color: '#FF5252' }]}>ออกจากระบบ</Text>
                <Text style={styles.itemSub}>ลงชื่อออกจากการใช้งานในเครื่องนี้</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      {/* --- 6. Bottom Navigation Bar (ไม่มีจุด และความสูงเท่าหน้า Home) --- */}
      <View style={styles.bottomNavContainer}>
        
        <Pressable 
          style={styles.navItem} 
          onPress={() => navigation.navigate('HomeRas', { restaurantId })}
        >
          <MaterialCommunityIcons name="view-dashboard" size={28} color="#888" />
        </Pressable>
        
        <Pressable 
          style={styles.navItem} 
          onPress={() => navigation.navigate('BookingRas', { restaurantId })}
        >
          <MaterialCommunityIcons name="calendar-check" size={28} color="#888" />
        </Pressable>

        <Pressable 
          style={styles.navItem} 
          onPress={() => navigation.navigate('MenuRas', { restaurantId })}
        >
          <MaterialCommunityIcons name="silverware-fork-knife" size={28} color="#888" />
        </Pressable>
        
        {/* ปุ่มตั้งค่า (Active สีแดง แต่ไม่มีจุด) */}
        <Pressable style={styles.navItem}>
          <MaterialCommunityIcons name="cog" size={28} color="#FF3030" />
        </Pressable>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 25, paddingTop: 20, paddingBottom: 25, borderBottomWidth: 0.5, borderBottomColor: '#222' },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  restaurantName: { color: '#666', fontSize: 14, marginTop: 5 },
  section: { paddingHorizontal: 20, marginTop: 30 },
  sectionLabel: { color: '#444', fontSize: 13, fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#1A1A1A' },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 15 },
  itemTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  itemSub: { color: '#555', fontSize: 12, marginTop: 2 },
  
  // --- Bottom Navigation Style (ความสูงและเส้นอิงตามหน้า Home) ---
  bottomNavContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#000', 
    height: 65, // เท่ากับ height ในหน้า Home ของคุณ
    borderTopWidth: 1, 
    borderTopColor: '#1A1A1A', 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    justifyContent: 'space-around', 
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 15 : 0 
  },
  navItem: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100%'
  }
});
