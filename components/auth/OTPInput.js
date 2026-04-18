import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputs.current[index + 1].focus();
    }
    if (newOtp.every(val => val !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((_, index) => (
        <TextInput
          key={index}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={(text) => handleChange(text, index)}
          ref={(ref) => (inputs.current[index] = ref)}
          placeholder="-"
          placeholderTextColor="#666"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  input: {
    width: 45,
    height: 50,
    backgroundColor: '#2D3250',
    color: '#da8337',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#424769',
  },
});

export default OTPInput;