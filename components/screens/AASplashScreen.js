import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // หน่วงเวลา 2 วินาทีแล้วไปหน้า Onboarding
    setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>Res<Text style={{color: '#ff3030'}}>.</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 60, fontWeight: 'bold', color: '#ff3030', letterSpacing: -2 },
});

export default SplashScreen;