import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

// 1. อิมพอตรูปภาพจากโฟลเดอร์ assets (ตรวจสอบชื่อไฟล์และ Path ให้ถูกต้อง)
import OnboardingBg from '../../assets/boarding/onea.png'; 

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* 2. เปลี่ยน source มาเรียกใช้ตัวแปรที่ import มาโดยตรง */}
      <ImageBackground 
        source={OnboardingBg} 
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.indicator} />
            <Text style={styles.title}>ค้นพบรสชาติที่เหนือระดับ</Text>
            <Text style={styles.subtitle}>
              จองโต๊ะร้านอาหารชั้นนำในเมืองของคุณได้ง่ายๆ เพียงไม่กี่ขั้นตอน
            </Text>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('SelectRole')} // 🔥 เปลี่ยนปลายทางไปหน้าเลือก role
            >
              <Text style={styles.buttonText}>เริ่มต้นใช้งาน</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { 
    flex: 1, 
    justifyContent: 'flex-end',
    backgroundColor: '#000' // เผื่อกรณีรูปโหลดไม่ขึ้น ให้มีสีพื้นหลังกันไว้
  },
  overlay: {
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  indicator: { width: 40, height: 4, backgroundColor: '#FF4757', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 15 },
  subtitle: { fontSize: 16, color: '#CCC', marginBottom: 40, lineHeight: 24 },
  button: {
    backgroundColor: '#FF4757',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default OnboardingScreen;