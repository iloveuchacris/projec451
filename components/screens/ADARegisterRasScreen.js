import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView,
  Platform, Alert, Image, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../data/supabase'; // ตรวจสอบ path ของไฟล์ supabase.js ให้ถูกต้อง

export default function ADARegisterRasScreen({ navigation }) {
  const [restaurantName, setRestaurantName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 📸 ฟังก์ชันเลือกรูปภาพจากมือถือ
  const pickImage = async () => {
    try {
      console.log('[pickImage] ขอ permission...');
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('[pickImage] permission result:', permissionResult);

      if (permissionResult.granted === false) {
        console.warn('[pickImage] permission denied');
        Alert.alert('แจ้งเตือน', 'คุณต้องอนุญาตให้เข้าถึงรูปภาพเพื่อใช้งานฟีเจอร์นี้');
        return;
      }

      console.log('[pickImage] เปิด image library...');
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      console.log('[pickImage] result:', result);

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        console.log('[pickImage] เลือกรูปสำเร็จ:', result.assets[0].uri);
      } else {
        console.log('[pickImage] ผู้ใช้ยกเลิกการเลือกรูป');
      }
    } catch (err) {
      console.error('[pickImage] ERROR:', err);
    }
  };

  // 🚀 ฟังก์ชันสมัครสมาชิกและบันทึกข้อมูล
  const handleRegister = async () => {
    if (!restaurantName || !ownerName || !email || !phone || !password) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    if (!isChecked) {
      Alert.alert('แจ้งเตือน', 'กรุณายอมรับเงื่อนไขการใช้งาน');
      return;
    }

    setIsLoading(true);

    try {
      // 1. สมัครสมาชิกในระบบ Authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        let publicImageUrl = null;

        // 2. ถ้ามีการเลือกรูป ให้ส่งขึ้น Storage
        if (imageUri) {
          console.log('[handleRegister] เริ่มอัปโหลดรูป:', imageUri);

          const fileExt = imageUri.split('.').pop().split('?')[0].toLowerCase();
          const fileName = `${authData.user.id}_${Date.now()}.${fileExt}`;
          console.log('[handleRegister] fileName:', fileName, '| fileExt:', fileExt);

          const response = await fetch(imageUri);
          const arrayBuffer = await response.arrayBuffer();
          console.log('[handleRegister] arrayBuffer byteLength:', arrayBuffer.byteLength);

          const { error: uploadError } = await supabase.storage
            .from('restaurant-images')
            .upload(fileName, arrayBuffer, {
               contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
               cacheControl: '3600',
               upsert: false
            });

          if (uploadError) {
            console.error('[handleRegister] Upload error:', uploadError);
          } else {
            const { data } = supabase.storage.from('restaurant-images').getPublicUrl(fileName);
            publicImageUrl = data.publicUrl;
            console.log('[handleRegister] อัปโหลดสำเร็จ, publicUrl:', publicImageUrl);
          }
        } else {
          console.log('[handleRegister] ไม่มีรูปที่เลือก');
        }

        // 3. บันทึกข้อมูลลงใน Table 'restaurant_profiles'
        const { error: dbError } = await supabase
          .from('restaurant_profiles')
          .insert([
            {
              id: authData.user.id,
              restaurant_name: restaurantName,
              owner_name: ownerName,
              email: email,
              phone: phone,
              image_url: publicImageUrl
            }
          ]);

        if (dbError) throw dbError;

        Alert.alert('สำเร็จ', 'สร้างบัญชีร้านค้าเรียบร้อยแล้ว');
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('เกิดข้อผิดพลาด', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} disabled={isLoading}>
          <Ionicons name="arrow-back" size={26} color="#FF2A2A" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.headerWrapper}>
            <Text style={styles.mainTitleWhite}>ยกระดับธุรกิจของคุณ</Text>
            <Text style={styles.mainTitleRed}>ร่วมเป็นพาร์ทเนอร์กับเรา</Text>
            <Text style={styles.subtitle}>
              เปิดประตูสู่โอกาสใหม่สำหรับร้านอาหาร{'\n'}ระดับพรีเมียม จัดการยอดจองและขยายฐานลูกค้า
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.redLine} />
              <Text style={styles.cardTitle}>ข้อมูลผู้สมัคร</Text>
            </View>

            {/* InputFields */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ชื่อร้านอาหาร</Text>
              <TextInput style={styles.input} placeholder="กรอกชื่อร้านอาหารของคุณ" placeholderTextColor="#555" onChangeText={setRestaurantName} value={restaurantName} editable={!isLoading} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ชื่อเจ้าของร้าน / ผู้ติดต่อ</Text>
              <TextInput style={styles.input} placeholder="กรอกชื่อของคุณ" placeholderTextColor="#555" onChangeText={setOwnerName} value={ownerName} editable={!isLoading} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>อีเมลธุรกิจ</Text>
              <TextInput style={styles.input} placeholder="example@restaurant.com" placeholderTextColor="#555" keyboardType="email-address" autoCapitalize="none" onChangeText={setEmail} value={email} editable={!isLoading} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>เบอร์โทรศัพท์</Text>
              <TextInput style={styles.input} placeholder="02-XXX-XXXX" placeholderTextColor="#555" keyboardType="phone-pad" onChangeText={setPhone} value={phone} editable={!isLoading} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>รหัสผ่าน</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#555" secureTextEntry onChangeText={setPassword} value={password} editable={!isLoading} />
            </View>

            {/* Upload Section */}
            <Text style={styles.uploadTitle}>อัปโหลดรูปภาพร้านอาหาร</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage} disabled={isLoading}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={32} color="#FF2A2A" style={{ marginBottom: 10 }} />
                  <Text style={styles.uploadTextWhite}>แตะที่นี่เพื่อ <Text style={styles.uploadTextRed}>เลือกไฟล์</Text></Text>
                  <Text style={styles.uploadSubtext}>รองรับ JPG, PNG (แนะนำ 16:9)</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Checkbox */}
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsChecked(!isChecked)} activeOpacity={0.8} disabled={isLoading}>
              <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.checkboxText}>
                ฉันยอมรับ <Text style={styles.linkText}>ข้อกำหนดการใช้งาน</Text> ของ ResBooking
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isLoading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>สร้างบัญชีร้านค้า</Text>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, zIndex: 10 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 90, paddingBottom: 40 },
  headerWrapper: { alignItems: 'center', marginBottom: 30 },
  mainTitleWhite: { fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' },
  mainTitleRed: { fontSize: 24, color: '#FF2A2A', fontWeight: 'bold', marginBottom: 15 },
  subtitle: { color: '#999999', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  card: { backgroundColor: '#1C1C1E', borderRadius: 20, padding: 25 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  redLine: { width: 4, height: 20, backgroundColor: '#FF2A2A', borderRadius: 2, marginRight: 10 },
  cardTitle: { fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' },
  inputGroup: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#333333', paddingBottom: 5 },
  label: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  input: { color: '#FFFFFF', fontSize: 14, paddingVertical: 5 },
  uploadTitle: { color: '#999999', fontSize: 13, textAlign: 'center', marginVertical: 15 },
  uploadBox: {
    borderWidth: 1, borderColor: '#333333', borderStyle: 'dashed', borderRadius: 15,
    padding: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 25,
    minHeight: 140, overflow: 'hidden'
  },
  uploadedImage: { width: '100%', height: 140, borderRadius: 10, resizeMode: 'cover' },
  uploadTextWhite: { color: '#FFFFFF', fontSize: 12, marginBottom: 5 },
  uploadTextRed: { color: '#FF2A2A' },
  uploadSubtext: { color: '#666666', fontSize: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: '#555', borderRadius: 4, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#FF2A2A', borderColor: '#FF2A2A' },
  checkboxText: { color: '#999999', fontSize: 12 },
  linkText: { color: '#FF2A2A' },
  submitBtn: { backgroundColor: '#FF2A2A', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});