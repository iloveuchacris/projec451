import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, 
  TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../data/supabase'; // เช็ค path ให้ตรงกับโปรเจกต์คุณ

export default function LoginResScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('แจ้งเตือน', 'กรอกข้อมูลให้ครบ');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.replace('HomeRas'); // ไปหน้าแดชบอร์ดร้านค้าเมื่อล็อกอินผ่าน
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>

          {/* ปุ่มย้อนกลับไปหน้าเลือก Role */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('SelectRole')}>
            <Ionicons name="arrow-back" size={26} color="#FF2A2A" />
          </TouchableOpacity>

          <View style={styles.headerSection}>
            <Text style={styles.logo}>Res.</Text>
            <Text style={styles.title}>ยินดีต้อนรับ</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>อีเมล</Text>
            <TextInput 
              style={styles.input} placeholder="example@restaurant.com" 
              placeholderTextColor="#555" keyboardType="email-address"
              autoCapitalize="none" onChangeText={setEmail} value={email}
            />

            <Text style={styles.label}>รหัสผ่าน</Text>
            <TextInput 
              style={styles.input} placeholder="กรอกรหัสผ่านของคุณ" 
              placeholderTextColor="#555" secureTextEntry 
              onChangeText={setPassword} value={password}
            />
            
            {/* 🔴 กดแล้วไปหน้า Forgot Password */}
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordRas')}>
              <Text style={styles.forgot}>ลืมรหัสผ่าน?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>

          {/* 🔴 กดแล้วไปหน้าสมัครพาร์ทเนอร์ */}
          <TouchableOpacity onPress={() => navigation.navigate('RegisterRas')}>
            <Text style={styles.link}>ยังไม่มีบัญชีใช่ไหม?</Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

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