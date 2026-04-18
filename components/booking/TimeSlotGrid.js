import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TimeSlotGrid = ({ selectedTime, onTimeSelect, isToday }) => {
  // 1. กำหนดรอบเวลาที่ร้านเปิดทั้งหมด
  const allSlots = ['10:00','10:30', '11:00','11:30' , '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '22:00'];
  
  // 2. ดึงเวลาปัจจุบันมาเช็ค
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return (
    <View style={styles.grid}>
      {allSlots.map((time) => {
        // แยกชั่วโมงและนาทีออกจาก Slot (เช่น '18:00' -> 18)
        const [slotHour, slotMinute] = time.split(':').map(Number);
        
        // 3. Logic เช็คเวลาที่ผ่านมาแล้ว (เฉพาะกรณีที่เป็นวันที่ปัจจุบัน)
        // ถ้าชั่วโมงปัจจุบันมากกว่า หรือ ชั่วโมงเท่ากันแต่นาทีปัจจุบันมากกว่า = เวลาผ่านไปแล้ว
        const isPast = isToday && (currentHour > slotHour || (currentHour === slotHour && currentMinute >= slotMinute));

        return (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeSlot,
              selectedTime === time && styles.activeSlot,
              isPast && styles.disabledSlot // ถ้าเวลาผ่านไปแล้วให้ใช้สไตล์จาง
            ]}
            onPress={() => onTimeSelect(time)}
            disabled={isPast} // ✅ ป้องกันการกดเวลาที่ผ่านมาแล้ว
          >
            <Text style={[
              styles.timeText, 
              selectedTime === time && styles.activeText,
              isPast && styles.disabledText
            ]}>
              {time}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1c1c1e', // สีเทาเข้มตามดีไซน์
    borderRadius: 12,
    minWidth: 95,
    alignItems: 'center',
  },
  activeSlot: {
    backgroundColor: '#ff3030', // สีแดง Res. เมื่อเลือก
  },
  disabledSlot: {
    opacity: 0.2, // ทำให้ดูจางลงมาก
    backgroundColor: '#111',
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
  disabledText: {
    color: '#666',
    textDecorationLine: 'line-through', // ขีดฆ่าเวลาที่จองไม่ได้
  },
});

export default TimeSlotGrid;