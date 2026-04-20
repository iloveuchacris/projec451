import React, { useState, useEffect } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  Image,
  TouchableOpacity, 
  ScrollView,
  Alert, 
  ActivityIndicator, 
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../data/supabase';

import nonphotooo from '../../assets/photohome/nonphoto.jpg';

const { width } = Dimensions.get('window');

// ฟังก์ชันช่วยแปลงค่าพิกัด (ถ้าเป็นตัวเลขเพียวๆ ให้เปลี่ยนเป็น Number, ถ้ามี % ให้เก็บเป็น String)
const parseVal = (val) => {
  if (val === null || val === undefined || val === '') return undefined;
  return val.toString().includes('%') ? val : Number(val);
};

// ฟังก์ชันแปลงรูปแบบวันที่ให้สวยงาม (เช่น 20 Apr)
const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const BookingScreen = ({ route, navigation }) => {
  const { restaurant } = route.params || {};
  
  // State สำหรับเก็บข้อมูลจาก Database
  const [selectedDate, setSelectedDate] = useState(null); // วันที่เลือก
  const [availableDates, setAvailableDates] = useState([]); // วันที่ร้านเปิดให้จองทั้งหมด
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  
  const [tables, setTables] = useState([]);
  const [decorations, setDecorations] = useState([]);
  const [slots, setSlots] = useState([]);
  
  const [loadingMap, setLoadingMap] = useState(true);
  const [loadingDates, setLoadingDates] = useState(true);

  if (!restaurant) return <View style={styles.container}><Text style={{ color: '#fff' }}>ไม่พบข้อมูลร้านอาหาร</Text></View>;

  const { id, name, image_url } = restaurant;
  const imageToShow = image_url ? { uri: image_url } : nonphotooo;

  // 1. ดึงข้อมูล "วันที่เปิดจอง" จาก Database (ดึงแค่ครั้งเดียวตอนเข้าร้าน)
  useEffect(() => {
    const fetchAvailableDates = async () => {
      setLoadingDates(true);
      try {
        const { data } = await supabase
          .from('restaurant_slots')
          .select('available_date')
          .eq('restaurant_id', id)
          .eq('is_available', true)
          .order('available_date', { ascending: true });

        if (data && data.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const maxDate = new Date();
          maxDate.setDate(today.getDate() + 5); // วันนี้ + 5 วัน

  // 🔥 filter วันที่
  const filteredDates = data
    .map(item => item.available_date)
    .filter(date => {
      const d = new Date(date);
      return d >= today && d <= maxDate;
    });

  // 🔥 เอาไม่ซ้ำ + sort
  const uniqueDates = [...new Set(filteredDates)].sort(
    (a, b) => new Date(a) - new Date(b)
    );

      setAvailableDates(uniqueDates);
      setSelectedDate(uniqueDates[0] || null);
    } else {
      setAvailableDates([]);
      setSelectedDate(null);
      }
      } catch (error) {
        console.error("Error fetching dates:", error);
      } finally {
        setLoadingDates(false);
      }
    };

    fetchAvailableDates();
  }, [id]);

  // 🔥 2. ดึงข้อมูลแปลนร้าน (โต๊ะ และ ของตกแต่ง) -> ให้ดึงเสมอแม้ไม่มีรอบจอง
  useEffect(() => {
    const fetchMapData = async () => {
      setLoadingMap(true);
      try {
        const [tableRes, decorRes] = await Promise.all([
          supabase.from('restaurant_tables').select('*').eq('restaurant_id', id),
          supabase.from('restaurant_decorations').select('*').eq('restaurant_id', id)
        ]);

        if (!tableRes.error) setTables(tableRes.data);
        if (!decorRes.error) setDecorations(decorRes.data);
      } catch (error) {
        console.error("Error fetching map data:", error);
      } finally {
        setLoadingMap(false);
      }
    };
    fetchMapData();
  }, [id]);

  const isTimePassed = (date, startTime) => {
  const today = new Date();
  const selectedDateObj = new Date(date);

  // ถ้าวันที่เลือกไม่ใช่ "วันนี้" (เช่น เลือกพรุ่งนี้) ไม่ต้องเช็คเวลา ให้จองได้เลย
  if (selectedDateObj.setHours(0,0,0,0) > today.setHours(0,0,0,0)) {
    return false;
  }

  // ถ้าเป็น "วันนี้" ให้เช็คเวลา
  const now = new Date();
  const [hours, minutes] = startTime.split(':');
  const slotTime = new Date();
  slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  return slotTime < now; // ถ้าเวลา slot น้อยกว่าเวลาปัจจุบัน แปลว่าผ่านมาแล้ว (true)
};

  const formatTimeForDB = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  };

  // 🔥 3. ดึงรอบเวลา (Slots) -> ดึงเฉพาะตอนที่มีการเลือกวันที่
  useEffect(() => {
    const fetchSlotsData = async () => {
      if (!selectedDate) {
        setSlots([]); // ถ้าไม่มีวันที่เลือก ให้เคลียร์เวลาทิ้ง
        return;
      }
      try {
        const { data, error } = await supabase
          .from('restaurant_slots')
          .select('*')
          .eq('restaurant_id', id)
          .eq('available_date', selectedDate)
          .eq('is_available', true)
          .order('start_time', { ascending: true });

        if (!error && data) {
          setSlots(data);
        } else {
          setSlots([]);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };
    fetchSlotsData();
  }, [selectedDate, id]);
  

  const getTableStyle = (type) => {
    switch (type) {
      case 'sofaL': return styles.tableSofaL;
      case 'couple': return styles.tableCouple;
      case 'barSeat': return styles.barSeat;
      case 'king': return styles.tableKing;
      case 'long': return styles.tableLong;
      default: return styles.tableSquare;
    }
  };

  const [bookedTables, setBookedTables] = useState([]);
    useEffect(() => {
  if (!selectedDate || !selectedSlot) return;

  const fetchBooked = async () => {
    const { data , error } = await supabase
      .from('reservations')
      .select('table_id')
      .eq('restaurant_id', id) // ✅ สำคัญมาก
      .eq('booking_date', selectedDate)
      .eq('booking_time', formatTimeForDB(selectedSlot.start_time))
      .eq('status', 'confirmed'); // ✅ แก้ตรงนี้

    if (!error && data) {
      console.log("BOOKED:", data); // 🔍 debug
      setBookedTables(data.map(i => i.table_id));
    } else {
      setBookedTables([]);
    }
  };

  fetchBooked();
}, [selectedDate, selectedSlot]);

  return (
    <View style={styles.container}>
      <View style={styles.imageHeader}>
        <Image source={imageToShow} style={styles.mainImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.nameText}>{name}</Text>

          {/* 📅 ส่วนที่ 1: เลือกวันที่ */}
          <Text style={styles.sectionTitle}>1. SELECT DATE</Text>
          {loadingDates ? (
            <ActivityIndicator color="#ff3030" />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
              {availableDates.length > 0 ? availableDates.map((date) => (
                <TouchableOpacity
                  key={date}
                  onPress={() => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                    setSelectedTable(null);
                  }}
                  style={[
                    styles.dateCard,
                    selectedDate === date && styles.selectedDateCard
                  ]}
                >
                  <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>
                    {formatDate(date)}
                  </Text>
                </TouchableOpacity>
              )) : (
                <Text style={{ color: '#555', marginLeft: 5 }}>ไม่มีวันที่เปิดให้จองในขณะนี้</Text>
              )}
            </ScrollView>
          )}

         {/* 🕒 ส่วนที่ 2: เลือกรอบเวลา */}
          <Text style={styles.sectionTitle}>2. SELECT TIME</Text>
          <View style={styles.slotGrid}>
            {slots.length > 0 ? (
              slots.map((slot) => {
                const passed = isTimePassed(selectedDate, slot.start_time);
                return (
                  <TouchableOpacity
                    key={slot.id}
                    disabled={passed}
                    onPress={() => {
                      setSelectedSlot(slot);
                      setSelectedTable(null); // ✅ ล้างโต๊ะที่เลือกไว้เมื่อเปลี่ยนเวลา
                    }}
                    style={[
                      styles.slotCard,
                      selectedSlot?.id === slot.id && styles.selectedSlotCard,
                      passed && { backgroundColor: '#050505', opacity: 0.3 }
                    ]}
                  >
                    <Text style={[styles.slotText, selectedSlot?.id === slot.id && { color: '#000' }]}>
                      {slot.start_time.slice(0, 5)}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={{ color: '#555', marginTop: 10 }}>ไม่มีรอบเวลาว่างสำหรับวันที่เลือก</Text>
            )}
          </View>
        

          {/* 🗺️ ส่วนที่ 3: Floor Plan */}
          <Text style={styles.sectionTitle}>3. ROOFTOP FLOOR PLAN</Text>
          <View style={styles.mapContainer}>
            {loadingMap ? (
              <ActivityIndicator color="#ff3030" style={{ marginTop: '50%' }} />
            ) : (
              <>
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

                {tables.map((table) => {
                  const isSelected = selectedTable?.id === table.id;
                  const isBooked = bookedTables.includes(table.id);
                  return (
                    <TouchableOpacity
                      key={table.id}
                      disabled={isBooked}
                      onPress={() => setSelectedTable(table)}
                      style={[
                        styles.tableBase,
                        getTableStyle(table.type),
                        { top: parseVal(table.top_position), left: parseVal(table.left_position) },
                        isSelected && styles.selectedTableActive,
                        isBooked && { backgroundColor: '#333', opacity: 0.3 }
                      ]}
                    >
                      <Text style={[styles.tableIdText, isSelected && { color: '#000' }]}>{table.id}</Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>

      {/* 🧾 ส่วนที่ 4: Footer */}
      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.summaryLabel}>{name} Selection:</Text>
          <Text style={styles.summaryValue}>
            {selectedTable ? `Table ${selectedTable.id}` : '-'} | {selectedSlot ? ` ${selectedSlot.start_time.slice(0, 5)}` : 'เลือกเวลา'}
          </Text>
        </View>

          <TouchableOpacity
          style={styles.bookButton}
          onPress={() => {
  // เช็คก่อนว่าเลือกครบหรือยัง
            if (!selectedDate || !selectedSlot || !selectedTable) {
              Alert.alert('ข้อมูลไม่ครบ', 'กรุณาเลือกให้ครบทั้งวันที่ เวลา และโต๊ะ');
              return;
            }

            navigation.navigate('BookingSummary', {
            restaurant,
            date: selectedDate,
        // ✅ ใช้ Optional Chaining (?.) เพื่อกันพัง และมั่นใจว่ามีค่าก่อน slice
            time: selectedSlot?.start_time ? selectedSlot.start_time.slice(0, 5) : '',
            tableId: selectedTable.id,    
            tableNumber: selectedTable.id, 
            slotId: selectedSlot.id, // ส่ง ID ไปด้วยตามที่คุยกันไว้ก่อนหน้า
            guests: selectedTable.capacity || 1,
          });
      }}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default BookingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  imageHeader: { height: 220 },
  mainImage: { width: '100%', height: '100%', opacity: 0.7 },
  backButton: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, marginTop: -25, backgroundColor: '#000', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20 },
  nameText: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  sectionTitle: { color: '#ff3030', fontSize: 13, fontWeight: 'bold', marginTop: 25, marginBottom: 15, letterSpacing: 2 },

  // 📅 วันที่
  dateList: { marginBottom: 10 },
  dateCard: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#111', marginRight: 10, borderWidth: 1, borderColor: '#222', alignItems: 'center' },
  selectedDateCard: { backgroundColor: '#ff3030', borderColor: '#ff3030' },
  dateText: { color: '#888', fontSize: 14, fontWeight: '600' },
  selectedDateText: { color: '#000' },

  // 🗺️ Map Container
  mapContainer: { height: 450, backgroundColor: '#0a0a0a', borderRadius: 25, borderWidth: 1, borderColor: '#1a1a1a', overflow: 'hidden', position: 'relative' },
  
  // 🎨 Decorations
  decorView: { backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#333' },
  decorBar: { backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: '#333' },
  viewText: { color: '#555', fontSize: 10, transform: [{ rotate: '-90deg' }], width: 200, textAlign: 'center', letterSpacing: 4 },
  decorStage: { justifyContent: 'center', alignItems: 'center' },
  stageLine: { width: '90%', height: 6, backgroundColor: '#5f2424', borderRadius: 5, marginBottom: 4 },
  stageText: { color: '#444', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  decorWC: { backgroundColor: '#111', borderLeftWidth: 2, borderColor: '#333' },
  wcBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  decorDoor: { backgroundColor: '#333', borderTopLeftRadius: 5, borderTopRightRadius: 5, alignItems: 'center', justifyContent: 'center' },
  doorText: { color: '#ff3030', fontSize: 8, fontWeight: 'bold' },

  // 🍽️ Tables
  tableBase: { position: 'absolute', backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#333' },
  tableSofaL: { width: 80, height: 60, borderTopLeftRadius: 40, borderBottomLeftRadius: 40 },
  tableCouple: { width: 40, height: 40, borderRadius: 20 },
  tableSquare: { width: 45, height: 45, borderRadius: 8 },
  tableKing: { width: 50, height: 100, borderRadius: 10 },
  tableLong: { width: 50, height: 100, borderRadius: 10 },
  barSeat: { width: 28, height: 28, borderRadius: 6 },
  selectedTableActive: { backgroundColor: '#ff3030', borderColor: '#fff', shadowColor: '#ff3030', shadowOpacity: 0.8, shadowRadius: 10, elevation: 10 },
  tableIdText: { color: '#666', fontSize: 10, fontWeight: 'bold' },

  // 🕒 Slots & Footer
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotCard: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#111', borderWidth: 1, borderColor: '#222' },
  selectedSlotCard: { backgroundColor: '#ff3030', borderColor: '#ff3030' },
  slotText: { color: '#888', fontSize: 14 },
  footer: { padding: 20, backgroundColor: '#0a0a0a', borderTopWidth: 1, borderColor: '#1a1a1a', flexDirection: 'row', alignItems: 'center' },
  summaryLabel: { color: '#555', fontSize: 11 },
  summaryValue: { color: '#ff3030', fontSize: 15, fontWeight: 'bold' },
  bookButton: { backgroundColor: '#ff3030', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 12, marginLeft: 10 },
  bookButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});