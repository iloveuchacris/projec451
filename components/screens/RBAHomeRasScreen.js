import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- ข้อมูลจำลองตำแหน่งโต๊ะ ---
const defaultTables = [
  { id: 'B1', type: 'barSeat', top_position: '22%', left_position: '15%' },
  { id: 'T1', type: 'long', top_position: '20%', left_position: '35%' },
  { id: 'T2', type: 'long', top_position: '55%', left_position: '35%' },
  { id: 'T3', type: 'square', top_position: '18%', left_position: '58%' },
  { id: 'T4', type: 'square', top_position: '40%', left_position: '58%' },
  { id: 'T5', type: 'circle', top_position: '82%', left_position: '10%' },
  { id: 'T10', type: 't10', bottom_position: '0', right_position: '0' },
];

const defaultDecorations = [
  { id: 'stage', type: 'stage', label: 'STAGE / PERFORMANCE', top_position: '3%', left_position: '20%', width: '50%' },
  { id: 'line_left', type: 'vline', top_position: '25%', left_position: '10%', height: '50%' },
  { id: 'text_bar_left', type: 'vtext_red', label: 'BAR AREA', top_position: '52%', left_position: '2%' },
  { id: 'text_city_view', type: 'text_stacked', label: 'CITY\nVIEW\nPANO\nRAMA', top_position: '48%', left_position: '5%' },
  { id: 'line_right', type: 'vline', top_position: '2%', right_position: '5%', height: '12%' },
  { id: 'text_bar_right', type: 'text_red', label: 'BAR\nAREA', top_position: '3%', right_position: '8%' },
  { id: 'wc', type: 'wc', top_position: '40%', right_position: '2%' },
  { id: 'door', type: 'door', label: 'DOOR', bottom_position: '2%', left_position: '30%' },
];

export default function BAHomeRasScreen({ navigation }) {
  const [isOpen, setIsOpen] = useState(true);

  const getPos = (val) => {
    if (val === null || val === undefined) return undefined;
    const strVal = val.toString();
    return strVal.includes('%') ? strVal : parseFloat(strVal);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header & Restaurant Status */}
      <View style={styles.headerSection}>
        <View style={styles.titleRow}>
          <Text style={styles.restaurantName}>BLUE by Alain Ducasse</Text>
          <TouchableOpacity style={styles.notificationBtn}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subText}>นี่คือผลการดำเนินงานของร้านอาหารคุณในคืนนี้</Text>

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

      {/* 2. Status Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Main Dining</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.statusLabel}>Avail</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.dot, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.statusLabel}>Rsvd</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
            <Text style={styles.statusLabel}>Occp</Text>
          </View>
        </View>
      </View>

      {/* 3. Floor Plan Layout */}
<<<<<<< HEAD:components/screens/RBAHomeRasScreen.js
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
=======
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.floorPlanCard}>
          <View style={styles.canvas}>
            <View style={styles.stageArea}>
               <View style={styles.stageLine} />
               <Text style={styles.stageText}>STAGE / PERFORMANCE</Text>
            </View>

            {defaultTables.map((table) => {
              let tableStyle = styles.tableCircle; 
              if (table.type === 'long') tableStyle = styles.tableLong;
              else if (table.type === 'square') tableStyle = styles.tableSquare;
              else if (table.type === 't10') tableStyle = styles.tableT10;

              return (
                <View key={table.id} style={[styles.tablePosition, {
                  top: getPos(table.top_position),
                  left: getPos(table.left_position),
                  right: getPos(table.right_position),
                  bottom: getPos(table.bottom_position),
                }]}>
                  <View style={[styles.tableBase, tableStyle]}>
                    <Text style={styles.tableNo}>{table.id}</Text>
                  </View>
                </View>
              );
            })}

            <View style={styles.doorContainer}>
              <View style={styles.doorBtn}>
                <MaterialCommunityIcons name="logout" size={14} color="#FF3B30" />
                <Text style={styles.doorText}>DOOR</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 4. Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('HomeRas')}
        >
          <MaterialCommunityIcons name="view-grid" size={26} color="#FF2A2A" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('BookingRas')}
        >
          <MaterialCommunityIcons name="calendar-check" size={26} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('MenuRas')}
        >
          <MaterialCommunityIcons name="silverware-fork-knife" size={26} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="cog-outline" size={26} color="#666" />
        </TouchableOpacity>
      </View>
>>>>>>> 4b0a40cdeb04f95c0c7cd8540fce6c46d0599ba0:components/screens/BAHomeRasScreen.js
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
  statusToggleContainer: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderRadius: 25, width: 150, height: 45, marginTop: 15, padding: 4 },
  toggleBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  toggleActive: { backgroundColor: '#FF5252' },
  toggleActiveGray: { backgroundColor: '#333' },
  toggleInactive: { backgroundColor: 'transparent' },
  toggleText: { color: '#666', fontWeight: 'bold' },
  textWhite: { color: '#FFF' },
  legendContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1A1A1A', margin: 20, padding: 15, borderRadius: 20 },
  legendTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  statusRow: { flexDirection: 'row' },
  statusItem: { flexDirection: 'row', alignItems: 'center', marginLeft: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
  statusLabel: { color: '#666', fontSize: 12 },
  floorPlanCard: { backgroundColor: '#0A0A0A', marginHorizontal: 15, borderRadius: 30, padding: 10, height: 600 },
  canvas: { flex: 1, position: 'relative' },
  stageArea: { alignItems: 'center', marginTop: 10 },
  stageLine: { width: '80%', height: 3, backgroundColor: '#441111', borderRadius: 2 },
  stageText: { color: '#444', fontSize: 10, fontWeight: 'bold', marginTop: 5 },
  tablePosition: { position: 'absolute' },
  tableBase: { backgroundColor: '#1A1A1C', borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  tableNo: { color: '#555', fontSize: 10, fontWeight: 'bold' },
  tableCircle: { width: 40, height: 40, borderRadius: 20 },
  tableSquare: { width: 45, height: 45, borderRadius: 8 },
  tableLong: { width: 45, height: 90, borderRadius: 15 },
  tableT10: { width: 100, height: 100, borderTopLeftRadius: 100, borderBottomRightRadius: 0, backgroundColor: '#1A1A1C' },
  doorContainer: { position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' },
  doorBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FF3B30', paddingVertical: 5, paddingHorizontal: 20, borderRadius: 20 },
  doorText: { color: '#FF3B30', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
  bottomNavContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, backgroundColor: '#000', borderTopWidth: 0.5, borderTopColor: '#222' },
  navItem: { padding: 10 }
});