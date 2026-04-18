// ในไฟล์ SearchBar.js
import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

const SearchBar = ({ placeholder }) => {
  return (
    <View style={styles.container}>
      <TextInput placeholder={placeholder} style={styles.input} />
    </View>
  );
};

const styles = StyleSheet.create({ /* ... */ });

export default SearchBar; // ✅ ต้องมีบรรทัดนี้