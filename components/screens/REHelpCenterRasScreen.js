import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HelpCenterRasScreen({ navigation }) {
  
  const ContactItem = ({ title, sub, icon, color, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={26} color={color} />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{sub}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#333" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ศูนย์ช่วยเหลือ</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          {/* ส่วนแสดงไอคอนและข้อความต้อนรับตามภาพต้นฉบับ */}
          <MaterialCommunityIcons name="face-agent" size={60} color="#FF5252" />
          <Text style={styles.heroTitle}>สวัสดีค่ะ มีอะไรให้เราช่วยไหม?</Text>
          <Text style={styles.heroSub}>
            ทีมงานของเราพร้อมดูแลคุณในเวลาทำการ{"\n"}
            จันทร์ - ศุกร์ (09:00 - 18:00 น.)
          </Text>
        </View>

        <Text style={styles.sectionLabel}>ช่องทางการติดต่อ</Text>
        
        {/* 1. ติดต่อผ่าน Line */}
        <ContactItem 
          title="แชทกับเจ้าหน้าที่"
          sub="Line ID: pimchanokmook48"
          icon="message-text-outline"
          color="#00C853"
          onPress={() => Linking.openURL('http://line.me/ti/p/~pimchanokmook48')} 
        />

        {/* 2. ติดต่อผ่าน Email */}
        <ContactItem 
          title="ติดต่อผ่านอีเมล"
          sub="pimchanok.cho@spumail.net"
          icon="email-outline"
          color="#529EFF"
          onPress={() => Linking.openURL('mailto:pimchanok.cho@spumail.net')}
        />

        {/* 3. ติดต่อผ่านเบอร์โทรศัพท์ */}
        <ContactItem 
          title="สายด่วนช่วยเหลือ"
          sub="096-703-8833"
          icon="phone-outline"
          color="#FFA500"
          onPress={() => Linking.openURL('tel:0967038833')}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  heroSection: { alignItems: 'center', marginBottom: 30, paddingVertical: 10 },
  heroTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  heroSub: { color: '#666', fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  sectionLabel: { color: '#444', fontSize: 13, fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D0D0D', padding: 18, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#1A1A1A' },
  iconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  cardSub: { color: '#666', fontSize: 12, marginTop: 2 },
  faqItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#111' },
  faqText: { color: '#AAA', fontSize: 14 }
});
