import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

function RadioList({ options, selectedOption, onChange, idPrefix }) {
  const handleRadioChange = (value) => {
    onChange(value);
  };

  return (
    <View style={{ maxHeight: 350, borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 10, padding: 10 }}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}
          onPress={() => handleRadioChange(option.value)}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderWidth: 1,
              borderColor: '#CCCCCC',
              borderRadius: 10,
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selectedOption === option.value && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#007AFF',
                }}
              />
            )}
          </View>
          <Text>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default RadioList;