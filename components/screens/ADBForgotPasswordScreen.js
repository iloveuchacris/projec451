import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';

import AuthInput from '../auth/AuthInput';
import PrimaryButton from '../common/PrimaryButton';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    alert('ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลของคุณแล้ว');
    navigation.goBack(); // ส่งกลับไปหน้า Login
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← กลับ</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>ลืมรหัสผ่าน?</Text>
          <Text style={styles.subtitle}>
            กรอกอีเมลที่คุณใช้สมัครสมาชิก เพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่
          </Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            label="อีเมล"
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          
          <View style={{ marginTop: 24 }}>
            <PrimaryButton 
              title="ส่งคำขอรีเซ็ตรหัสผ่าน" 
              onPress={handleResetPassword} 
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { flex: 1, paddingHorizontal: 24 },
  backButton: { marginTop: 20, marginBottom: 40 },
  backText: { fontSize: 16, color: '#FF4757', fontWeight: '600' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fbfbfb' },
  subtitle: { fontSize: 16, color: '#fbfbfb', marginTop: 8, lineHeight: 22 },
  form: { flex: 1 },
});

export default ForgotPasswordScreen;