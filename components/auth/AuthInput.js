import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

const AuthInput = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#666"
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { color: '#FFF', marginBottom: 5, fontSize: 14 },
  input: {
    backgroundColor: '#2D3250',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#424769',
  },
});

export default AuthInput;