import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../data/supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('แจ้งเตือน', 'กรอกข้อมูลให้ครบ');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('สำเร็จ', 'เข้าสู่ระบบแล้ว');
      navigation.replace('Home'); // 🔥 login สำเร็จไปหน้า Home
    }
  };

  return (
    <View style={styles.container}>

      {/* 🔙 ปุ่มย้อนกลับ */}
      <TouchableOpacity 
        style={styles.backBtn}
        onPress={() => navigation.navigate('SelectRole')}      >
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.header}>Res.</Text>
      <Text style={styles.title}>ยินดีต้อนรับ</Text>

      <Text style={styles.word}>อีเมล</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        placeholderTextColor="#aaa"
        onChangeText={setEmail} 
      />

      <Text style={styles.word}>รหัสผ่าน</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#aaa"
        secureTextEntry 
        onChangeText={setPassword} 
      />
      <Text 
        style={styles.forgot} 
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        ลืมรหัสผ่าน?
      </Text>

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.loglog}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>

      {/* สมัครสมาชิก */}
      <Text 
        style={styles.link} 
        onPress={() => navigation.navigate('Register')}
      >
        ยังไม่มีบัญชีใช่ไหม
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#050505', 
    justifyContent: 'center', 
    padding: 30 
  },

  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20
  },

  header: { 
    fontSize: 70, 
    color: '#ff3030', 
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 50
  },
  word: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 30,
  },
  input: { 
    backgroundColor: '#1c1c1e', 
    color: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 30 
  },
  forgot: {
    color: '#706D6D',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 30,
  },
  
  btn: { 
    backgroundColor: '#ff3030', 
    padding: 15, 
    borderRadius: 10,
    marginTop: 10
  },
  loglog: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  link: {
    color: '#ff3030',
    textAlign: 'center',
    marginTop: 20
  },
});