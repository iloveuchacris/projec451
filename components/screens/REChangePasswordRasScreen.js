import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

export default function ChangePasswordRasScreen({ navigation }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState({ old: false, new: false, conf: false });

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("แจ้งเตือน", "รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("แจ้งเตือน", "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    try {
      setLoading(true);
      // ใช้คำสั่ง updatePassword ของ Supabase Auth
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) throw error;

      Alert.alert("สำเร็จ", "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว", [
        { text: "ตกลง", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("ล้มเหลว", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>เปลี่ยนรหัสผ่าน</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="shield-lock-outline" size={40} color="#FF5252" />
          <Text style={styles.infoText}>เพื่อความปลอดภัย รหัสผ่านใหม่ควรคาดเดาได้ยากและไม่ซ้ำกับรหัสผ่านเดิม</Text>
        </View>

        {/* รหัสผ่านเดิม */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>รหัสผ่านเดิม</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showPass.old}
              placeholder="กรอกรหัสผ่านปัจจุบัน"
              placeholderTextColor="#444"
            />
            <TouchableOpacity onPress={() => setShowPass({...showPass, old: !showPass.old})}>
              <MaterialCommunityIcons name={showPass.old ? "eye" : "eye-off"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* รหัสผ่านใหม่ */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>รหัสผ่านใหม่</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPass.new}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              placeholderTextColor="#444"
            />
            <TouchableOpacity onPress={() => setShowPass({...showPass, new: !showPass.new})}>
              <MaterialCommunityIcons name={showPass.new ? "eye" : "eye-off"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ยืนยันรหัสผ่านใหม่ */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ยืนยันรหัสผ่านใหม่</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPass.conf}
              placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              placeholderTextColor="#444"
            />
            <TouchableOpacity onPress={() => setShowPass({...showPass, conf: !showPass.conf})}>
              <MaterialCommunityIcons name={showPass.conf ? "eye" : "eye-off"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && { opacity: 0.7 }]} 
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>อัปเดตรหัสผ่าน</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 25 },
  infoBox: { alignItems: 'center', marginBottom: 30, backgroundColor: '#0D0D0D', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#1A1A1A' },
  infoText: { color: '#666', fontSize: 13, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  inputGroup: { marginBottom: 20 },
  label: { color: '#FF5252', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#222' },
  input: { flex: 1, color: '#FFF', paddingVertical: 15, fontSize: 16 },
  saveButton: { backgroundColor: '#FF5252', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});