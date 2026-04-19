import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, 
  TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>

          {/* 🔴 ปุ่มกดย้อนกลับไปหน้า Login */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FF2A2A" />
          </TouchableOpacity>

          <View style={styles.headerSection}>
            <Text style={styles.title}>ลืมรหัสผ่าน?</Text>
            <Text style={styles.subtitle}>
              กรอกอีเมลที่คุณใช้สมัครสมาชิก เพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>อีเมล</Text>
            <TextInput 
              style={styles.input} placeholder="example@email.com" 
              placeholderTextColor="#555" keyboardType="email-address"
              autoCapitalize="none" onChangeText={setEmail} value={email}
            />
          </View>

          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>ส่งคำขอรีเซ็ตรหัสผ่าน</Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  inner: { flex: 1, paddingHorizontal: 30, paddingTop: 60 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  headerSection: { marginBottom: 40 },
  title: { fontSize: 28, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 15 },
  subtitle: { color: '#CCCCCC', fontSize: 14, lineHeight: 22 },
  formSection: { marginBottom: 30 },
  label: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#2A2A35', color: '#fff', paddingHorizontal: 15, paddingVertical: 18, borderRadius: 8, fontSize: 14 },
  btn: { backgroundColor: '#FF2A2A', width: '100%', paddingVertical: 18, borderRadius: 12 },
  btnText: { color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: 'bold' },
});