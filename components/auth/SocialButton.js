import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';

const SocialButton = ({ title, type, onPress }) => {
  // เลือกสีตามประเภท Social
  const bgColor = type === 'google' ? '#FFF' : '#1877F2';
  const textColor = type === 'google' ? '#000' : '#FFF';

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: bgColor }]} 
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  text: { fontSize: 14, fontWeight: '600' },
});

export default SocialButton;