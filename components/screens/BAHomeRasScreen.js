import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BAHomeRasScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.restaurantName}>BLUE by Alain Ducasse</Text>
            <Text style={styles.subText}>Floor Plan Overview</Text>
          </View>
          {/* พื้นที่จำลองผังโต๊ะ */}
          <View style={styles.placeholderCard}>
            <MaterialCommunityIcons name="view-grid-outline" size={50} color="#222" />
            <Text style={styles.cardText}>Interactive Floor Plan Area</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Navigation */}
      <View style={styles.customTabBar}>
        <TouchableOpacity style={styles.tabItem}><MaterialCommunityIcons name="view-dashboard" size={28} color="#FF5252" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BBBookingRasScreen')}><MaterialCommunityIcons name="calendar-check" size={28} color="#888" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BCMenuRasScreen')}><MaterialCommunityIcons name="silverware-fork-knife" size={28} color="#888" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BDSettingsRasScreen')}><MaterialCommunityIcons name="cog" size={28} color="#888" /></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { padding: 20, paddingTop: 40 },
  header: { marginBottom: 20 },
  restaurantName: { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  subText: { color: '#888', fontSize: 16 },
  placeholderCard: { height: 450, backgroundColor: '#0A0A0A', borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#1A1A1A' },
  cardText: { color: '#333', marginTop: 10 },
  customTabBar: { flexDirection: 'row', backgroundColor: '#000', height: 80, borderTopWidth: 1, borderTopColor: '#1A1A1A', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15 },
  tabItem: { padding: 10 }
});