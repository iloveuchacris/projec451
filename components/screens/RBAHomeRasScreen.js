import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native'; 
import { supabase } from '../data/supabase';

export default function HomeRasScreen({ route, navigation }) {
  // 1. รับ restaurantId จากหน้า Login
  const { restaurantId } = route.params || {}; 
  
  const isFocused = useIsFocused(); 
  const [isOpen, setIsOpen] = useState(true);
  const [tables, setTables] = useState([]);
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) {
      Alert.alert('Error', 'ไม่พบข้อมูลร้านค้า กรุณาล็อกอินใหม่');
      navigation.replace('LoginRes');
      return;
    }

    if (isFocused) {
      fetchFloorPlan();
    }
  }, [isFocused, restaurantId]);

  const fetchFloorPlan = async () => {
    try {
      setLoading(true);
      
      // ดึงข้อมูลโต๊ะ
      const { data: tableData, error: tableError } = await supabase
        .from('restaurant_tables')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('id', { ascending: true });

      if (tableError) throw tableError;

      // ดึงข้อมูลของตกแต่ง (Decorations)
      const { data: decorData, error: decorError } = await supabase
        .from('restaurant_decorations')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (decorError) throw decorError;

      setTables(tableData || []);
      setDecorations(decorData || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPos = (val) => {
    if (val === null || val === undefined) return undefined;
    const strVal = val.toString();
    return strVal.includes('%') ? strVal : parseFloat(strVal);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied': return '#F44336'; 
      case 'reserved': return '#FFC107'; 
      case 'available': return '#1A1A1C'; 
      default: return '#1A1A1C';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.titleRow}>
          <Text style={styles.restaurantName}>Dashboard</Text>
          <TouchableOpacity style={styles.notificationBtn}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subText}>สถานะโต๊ะอาหารแบบ Real-time</Text>

        <View style={styles.statusToggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, isOpen ? styles.toggleActive : styles.toggleInactive]} 
            onPress={() => setIsOpen(true)}
          >
            <Text style={[styles.toggleText, isOpen && styles.textWhite]}>เปิด</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, !isOpen ? styles.toggleActiveGray : styles.toggleInactive]} 
            onPress={() => setIsOpen(false)}
          >
            <Text style={[styles.toggleText, !isOpen && styles.textWhite]}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Floor Plan</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}><View style={[styles.dot, { backgroundColor: '#1A1A1C' }]} /><Text style={styles.statusLabel}>ว่าง</Text></View>
          <View style={styles.statusItem}><View style={[styles.dot, { backgroundColor: '#FFC107' }]} /><Text style={styles.statusLabel}>จอง</Text></View>
          <View style={styles.statusItem}><View style={[styles.dot, { backgroundColor: '#F44336' }]} /><Text style={styles.statusLabel}>ไม่ว่าง</Text></View>
        </View>
      </View>

      {/* 3. Floor Plan Layout */}
      <Text style={styles.sectionTitle}>2. ROOFTOP FLOOR PLAN</Text>
            <View style={styles.mapContainer}>
              {loadingMap ? (
              <ActivityIndicator color="#ff3030" style={{ marginTop: '50%' }} />
              ) : (
              <>
        {/* Render ของตกแต่ง */}
          {decorations.map((item) => {
          const dynamicLayout = {
          position: 'absolute',
          top: parseVal(item.top_position),
          bottom: parseVal(item.bottom_position),
          left: parseVal(item.left_position),
          right: parseVal(item.right_position),
          width: parseVal(item.width),
          height: parseVal(item.height),
        };
      
          if (item.type === 'view') return <View key={item.id} style={[styles.decorView, dynamicLayout]}><Text style={styles.viewText}>{item.label}</Text></View>;
          if (item.type === 'stage') return <View key={item.id} style={[styles.decorStage, dynamicLayout]}><View style={styles.stageLine} /><Text style={styles.stageText}>{item.label}</Text></View>;
          if (item.type === 'bar') return <View key={item.id} style={[styles.decorBar, dynamicLayout]}><Text style={styles.viewText}>{item.label}</Text></View>;
          if (item.type === 'wc') return <View key={item.id} style={[styles.decorWC, dynamicLayout]}><View style={styles.wcBox}><Ionicons name="man" size={14} color="#ff3030" /></View><View style={[styles.wcBox, { borderTopWidth: 1, borderColor: '#333' }]}><Ionicons name="woman" size={14} color="#ff3030" /></View></View>;
          if (item.type === 'door') return <View key={item.id} style={[styles.decorDoor, dynamicLayout]}><Text style={styles.doorText}>{item.label}</Text></View>;
                        return null;
                      })}
      
                      {/* Render โต๊ะ */}
                      {tables.map((table) => {
                        const isSelected = selectedTable?.id === table.id;
                        return (
                          <TouchableOpacity
                            key={table.id}
                            onPress={() => setSelectedTable(table)}
                            style={[
                              styles.tableBase,
                              getTableStyle(table.type),
                              { top: parseVal(table.top_position), left: parseVal(table.left_position) },
                              isSelected && styles.selectedTableActive
                            ]}
                          >
                  <Text style={[styles.tableIdText, isSelected && { color: '#000' }]}>{table.id}</Text>
                          </TouchableOpacity>
                        );
                })}
              </>
            )}
         </View>

      

      {/* 4. Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
                    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeRas', { restaurantId })}><MaterialCommunityIcons name="" size={26} color="#666" /></TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('BookingRas', { restaurantId })}><MaterialCommunityIcons name="calendar-check" size={26} color="#666" /></TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MenuRas', { restaurantId })}><MaterialCommunityIcons name="silverware-fork-knife" size={26} color="#666" /></TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SettingRas', { restaurantId })}><MaterialCommunityIcons name="cog-outline" size={26} color="#666" /></TouchableOpacity>
                  </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerSection: { padding: 20, paddingTop: 10 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  restaurantName: { color: '#FFF', fontSize: 24, fontWeight: 'bold', fontStyle: 'italic' },
  subText: { color: '#AAA', fontSize: 14, marginTop: 5 },
  notificationBtn: { backgroundColor: '#1A1A1A', padding: 8, borderRadius: 10 },
  statusToggleContainer: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderRadius: 25, width: 140, height: 40, marginTop: 15, padding: 4 },
  toggleBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  toggleActive: { backgroundColor: '#FF5252' },
  toggleActiveGray: { backgroundColor: '#333' },
  toggleInactive: { backgroundColor: 'transparent' },
  toggleText: { color: '#666', fontWeight: 'bold', fontSize: 12 },
  textWhite: { color: '#FFF' },
  legendContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1A1A1A', marginHorizontal: 20, marginBottom: 15, padding: 15, borderRadius: 20 },
  legendTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  statusRow: { flexDirection: 'row' },
  statusItem: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
  statusLabel: { color: '#666', fontSize: 11 },
  floorPlanCard: { backgroundColor: '#0A0A0A', marginHorizontal: 15, borderRadius: 30, padding: 10, height: 550, overflow: 'hidden' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  canvas: { flex: 1, position: 'relative' },
  stageArea: { alignItems: 'center', justifyContent: 'center' },
  stageLine: { height: 3, backgroundColor: '#333', borderRadius: 2 },
  stageText: { color: '#444', fontSize: 9, fontWeight: 'bold', marginTop: 4 },
  barContainer: { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  barText: { color: '#333', fontSize: 8, fontWeight: 'bold', marginTop: 2 },
  wcContainer: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  doorWrapper: { justifyContent: 'center', alignItems: 'center' },
  doorBtn: { borderWidth: 1, borderColor: '#444', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 10 },
  doorText: { color: '#444', fontSize: 9, fontWeight: 'bold' },
  tablePosition: { position: 'absolute' },
  tableBase: { borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  tableNo: { fontSize: 10, fontWeight: 'bold' },
  tableCircle: { width: 42, height: 42, borderRadius: 21 },
  tableSquare: { width: 45, height: 45, borderRadius: 8 },
  tableLong: { width: 45, height: 85, borderRadius: 12 },
  tableT10: { width: 80, height: 80, borderTopLeftRadius: 80 },
  bottomNavContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, backgroundColor: '#000', borderTopWidth: 0.5, borderTopColor: '#222' },
  navItem: { padding: 10 }
});