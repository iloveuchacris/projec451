import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const BookingCard = ({ title, date, time, status, isUpcoming, hasQR }) => {
  return (
    <View style={[styles.card, isUpcoming ? styles.activeCardBorder : styles.pastCardBorder]}>

      <View style={styles.headerRow}>
        <Text style={[
          styles.statusText,
          isUpcoming ? styles.upcomingText : styles.pastText
        ]}>
          {status}
        </Text>

        {hasQR && (
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={24}
            color="#fff"
          />
        )}
      </View>

      <Text style={styles.restaurantName}>{title}</Text>

      <View style={styles.dateTimeRow}>
        <Ionicons name="calendar-outline" size={18} color="#888" />
        <Text style={styles.dateTimeText}>
          {date} • {time}
        </Text>
      </View>

    </View>
  );
};

const MyBookingsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <BookingCard
          title="BLUE by Alain Ducasse"
          date="2026-04-02"
          time="11:00"
          status="เร็วๆ นี้"
          isUpcoming={true}
          hasQR={true}
        />

        <BookingCard
          title="Oxbo Bangkok"
          date="2026-03-15"
          time="14:00"
          status="ใช้บริการแล้ว"
          isUpcoming={false}
          hasQR={false}
        />

      </ScrollView>

      {/* Bottom Tab */}
      <View style={styles.tab}>

        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('MyBookings')}>
          <Ionicons name="calendar" size={24} color="#ff3030" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#666" />
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
};

export default MyBookingsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 120
  },

  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20
  },

  activeCardBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF4D4D'
  },

  pastCardBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#333'
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },

  statusText: {
    fontSize: 14,
    fontWeight: '600'
  },

  upcomingText: {
    color: '#FF4D4D'
  },

  pastText: {
    color: '#888'
  },

  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },

  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  dateTimeText: {
    color: '#888',
    marginLeft: 8
  },

  tab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#333'
  }
});