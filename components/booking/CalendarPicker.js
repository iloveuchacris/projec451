import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const CalendarPicker = ({ selectedDate, onDateSelect }) => {
  // ฟังก์ชันสร้างรายการวันที่ล่วงหน้า 7 วัน เริ่มจากวันนี้
  const generateDates = () => {
    const dates = [];
    const daysTh = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
    const monthsTh = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      const dateNum = d.getDate().toString();
      const monthText = monthsTh[d.getMonth()];
      const fullDate = d.toISOString().split('T')[0]; // เช่น "2026-04-02"
      
      dates.push({
        dayLabel: daysTh[d.getDay()],
        dateNum: dateNum,
        monthText: monthText,
        fullDate: fullDate // ใช้ตัวนี้เป็น Key และ ID ในการเลือก
      });
    }
    return dates;
  };

  const dates = generateDates();

  return (
    <View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.container}
      >
        {dates.map((item) => (
          <TouchableOpacity
            key={item.fullDate} // ✅ แก้ไข: ใช้ fullDate เป็น key แทน index เพื่อไม่ให้ซ้ำกัน
            style={[
              styles.dateCard,
              selectedDate === item.fullDate && styles.activeCard // แสดงสีแดงเมื่อถูกเลือก
            ]}
            onPress={() => onDateSelect(item.fullDate)}
          >
            <Text style={[
              styles.dayText, 
              selectedDate === item.fullDate && styles.activeText
            ]}>
              {item.dayLabel}
            </Text>
            <Text style={[
              styles.dateText, 
              selectedDate === item.fullDate && styles.activeText
            ]}>
              {item.dateNum}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    gap: 15, // ระยะห่างระหว่างการ์ดวันที่
  },
  dateCard: {
    width: 65,
    height: 85,
    backgroundColor: '#1c1c1e', // สีเทาเข้มตามดีไซน์ Dark Mode
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    // เพิ่ม Shadow เล็กน้อยให้ดูมีมิติแบบ Figma
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  activeCard: {
    backgroundColor: '#ff3030', // ✅ สีแดง Res. ตามแบรนด์ของคุณ
  },
  dayText: {
    color: '#999',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#fff', // ตัวหนังสือสีขาวเด่นเมื่อเลือก
  },
});

export default CalendarPicker;