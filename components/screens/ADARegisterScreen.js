import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  Alert, StyleSheet, ActivityIndicator 
} from 'react-native';
import { supabase } from '../data/supabase';

const AuthLink = ({ text, linkText, onPress }) => (
  <Text style={{ color: '#ccc', textAlign: 'center', marginTop: 20 }}>
    {text}{' '}
    <Text style={{ color: '#ff3030' }} onPress={onPress}>
      {linkText}
    </Text>
  </Text>
);

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return;

    if (!name || !email || !password || !confirm) {
      Alert.alert('แจ้งเตือน', 'กรอกข้อมูลให้ครบ');
      return;
    }

    if (password !== confirm) {
      Alert.alert('แจ้งเตือน', 'รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (password.length < 6) {
      Alert.alert('แจ้งเตือน', 'รหัสผ่านอย่างน้อย 6 ตัว');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      const userId = data?.user?.id;

      if (!userId) {
        Alert.alert('สมัครสำเร็จ', 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ');
        return;
      }

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: name.trim(),
          email: email.trim().toLowerCase(),
          role: 'user',
        });

      if (insertError) throw insertError;

      Alert.alert('สำเร็จ', 'สมัครสมาชิกเรียบร้อย', [
        { text: 'ไป Login', onPress: () => navigation.navigate('Login') }
      ]);

    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>สมัครสมาชิก</Text>

      <TextInput style={styles.input} placeholder="ชื่อ" onChangeText={setName} />
      <TextInput style={styles.input} placeholder="อีเมล" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="รหัสผ่าน" secureTextEntry onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="ยืนยันรหัสผ่าน" secureTextEntry onChangeText={setConfirm} />

      {loading ? (
        <ActivityIndicator color="#ff3030" />
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnText}>สมัคร</Text>
        </TouchableOpacity>
      )}

      <AuthLink
        text="มีบัญชีแล้ว?"
        linkText="เข้าสู่ระบบ"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    justifyContent: 'center', 
    padding: 30 
  },
  header: { 
    fontSize: 28, 
    color: '#fff', 
    marginBottom: 20 
  },
  input: { 
    backgroundColor: '#a2a2bb', 
    color: '#fff', 
    padding: 15, borderRadius: 10,
    marginBottom: 10 
  },
  btn: { 
    backgroundColor: '#ff3030', 
    padding: 15, 
    borderRadius: 10 },
  btnText: { 
    color: '#fff', 
    textAlign: 'center' },
});