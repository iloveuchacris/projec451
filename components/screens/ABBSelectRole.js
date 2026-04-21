import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar,
  StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SelectRole = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.titleWhite}>
          ยินดีต้อนรับสู่ <Text style={styles.titleRed}>Res</Text>
        </Text>
        <Text style={styles.titleBooking}>Booking</Text>
      </View>

      {/* Card สำหรับลูกค้า */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconBoxRed}>
            <MaterialCommunityIcons name="chair-rolling" size={28} color="#d64e4e" />
          </View>
          <Text style={styles.cardTitle}>สำหรับลูกค้า</Text>
        </View>

        <Text style={styles.desc}>
          ค้นหาและจองโต๊ะร้านอาหารชั้นนำ พร้อมสิทธิพิเศษส่วนลดสำหรับคุณ
        </Text>

        <TouchableOpacity 
          style={styles.buttonCustomer}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Login')} 
        >
          <Text style={styles.buttonText}>เข้าสู่ระบบลูกค้า</Text>
        </TouchableOpacity>
      </View>

      {/* Card สำหรับร้านอาหาร */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconBoxBlue}>
            <MaterialCommunityIcons name="storefront-outline" size={28} color="#145bb9" />
          </View>
          <Text style={styles.cardTitle}>สำหรับร้านอาหาร</Text>
        </View>

        <Text style={styles.desc}>
          จัดการการจอง ขยายธุรกิจของคุณ และเพิ่มประสิทธิภาพการบริการ
        </Text>

        <TouchableOpacity 
          style={styles.buttonRestaurant}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('LoginResScreen')} 
        >
          <Text style={styles.buttonText}>เข้าสู่ระบบร้านค้า</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default SelectRole;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // ✅ เปลี่ยนเป็นสีดำตามต้นฉบับ
    paddingHorizontal: 25,
    justifyContent: 'center'
  },
  header: {
    marginBottom: 40
  },
  titleWhite: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold'
  },
  titleRed: {
    color: '#FF3030', // สีแดงสดขึ้น
    fontStyle: 'italic'
  },
  titleBooking: {
    color: '#FF3030',
    fontSize: 48,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: -15
  },
  card: {
    backgroundColor: '#1C1C1E', // สีเทาเข้มแบบ iOS Dark Mode
    borderRadius: 25,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333' // เพิ่มเส้นขอบบางๆ ให้ดูมีมิติ
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  iconBoxRed: {
    backgroundColor: 'rgba(255, 126, 126, 0.1)', // สีแดงจางๆ
    padding: 12,
    borderRadius: 15,
    marginRight: 15
  },
  iconBoxBlue: {
    backgroundColor: 'rgba(126, 182, 255, 0.1)', // สีฟ้าจางๆ
    padding: 12,
    borderRadius: 15,
    marginRight: 15
  },
  cardTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold'
  },
  desc: {
    color: '#999',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 25
  },
  buttonCustomer: {
    backgroundColor: '#d64e4e',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center'
  },
  buttonRestaurant: {
    backgroundColor: '#145bb9',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});