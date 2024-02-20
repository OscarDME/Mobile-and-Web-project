// SearchBar.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="always"
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Buscar ejercicio..."
        style={styles.searchBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F9F9',
    padding: 10,
    marginVertical: 10,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 20,
    fontSize: 16,
  },
});

export default SearchBar;


