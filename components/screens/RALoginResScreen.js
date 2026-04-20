import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, 
  TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

export default function LoginResScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('แจ้งเตือน', 'กรอกข้อมูลให้ครบ');
      return;
    }

    setLoading(true);
    
    // 1. ล็อกอินผ่าน Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (authError) {
      Alert.alert('Error', authError.message);
      setLoading(false);
      return;
    }

    try {
      // 2. ดึงข้อมูลโปรไฟล์เพื่อเช็ค restaurant_id ของพนักงานคนนี้
      // หมายเหตุ: ชื่อตารางต้องตรงกับใน Supabase ของคุณ (ในรูปคือ restaurant_profiles)
      const { data: profile, error: profileError } = await supabase
        .from('restaurant_profiles')
        .select('restaurant_id, role')
        .eq('id', user.id) // id ของ profile ต้องตรงกับ id ของ auth user
        .single();

      if (profileError || !profile) {
        throw new Error('ไม่พบข้อมูลร้านค้าสำหรับบัญชีนี้');
      }

      // 3. ตรวจสอบ Role (เผื่อป้องกันลูกค้าแอบมาล็อกอินฝั่งร้านค้า)
      if (profile.role !== 'restaurant' && profile.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('คุณไม่มีสิทธิ์เข้าถึงระบบร้านค้า');
      }

      // 4. ไปหน้า HomeRas พร้อมส่ง restaurantId ไปเป็น Global Param (หรือใช้ Context/Zustand ต่อไป)
      // การใช้ replace จะทำให้กด Back กลับมาหน้า Login ไม่ได้
      navigation.replace('HomeRas', { restaurantId: profile.restaurant_id });

    } catch (error) {
      Alert.alert('เข้าสู่ระบบไม่สำเร็จ', error.message);
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('SelectRole')}>
            <Ionicons name="arrow-back" size={26} color="#FF2A2A" />
          </TouchableOpacity>

          <View style={styles.headerSection}>
            <Text style={styles.logo}>Res.</Text>
            <Text style={styles.title}>ระบบจัดการร้านค้า</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>อีเมลร้านค้า / พนักงาน</Text>
            <TextInput 
              style={styles.input} placeholder="staff@restaurant.com" 
              placeholderTextColor="#555" keyboardType="email-address"
              autoCapitalize="none" onChangeText={setEmail} value={email}
            />

            <Text style={styles.label}>รหัสผ่าน</Text>
            <TextInput 
              style={styles.input} placeholder="••••••••" 
              placeholderTextColor="#555" secureTextEntry 
              onChangeText={setPassword} value={password}
            />
            
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordRas')}>
              <Text style={styles.forgot}>ลืมรหัสผ่าน?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.btn, loading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('RegisterRas')}>
            <Text style={styles.link}>ต้องการลงทะเบียนร้านค้าใหม่?</Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

// ... styles เหมือนเดิม ...

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  inner: { flex: 1, paddingHorizontal: 35, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, zIndex: 1 },
  headerSection: { marginBottom: 40 },
  logo: { fontSize: 50, color: '#FF2A2A', fontWeight: '900', fontStyle: 'italic', letterSpacing: -1 },
  title: { fontSize: 22, color: '#FFFFFF', fontWeight: 'bold', marginTop: 25 },
  formSection: { marginBottom: 30 },
  label: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#1C1C1E', color: '#fff', paddingHorizontal: 15, paddingVertical: 15, borderRadius: 8, fontSize: 14, marginBottom: 20 },
  forgot: { color: '#888888', fontSize: 12, textAlign: 'right', marginTop: -5 },
  btn: { backgroundColor: '#FF2A2A', width: '100%', paddingVertical: 15, borderRadius: 12, marginBottom: 30 },
  btnText: { color: '#fff', fontSize: 18, textAlign: 'center', fontWeight: 'bold' },
  link: { color: '#888888', fontSize: 13, textAlign: 'center' },
});