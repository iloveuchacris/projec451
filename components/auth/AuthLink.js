import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AuthLink = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    padding: 10,
  },
  linkText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default AuthLink;