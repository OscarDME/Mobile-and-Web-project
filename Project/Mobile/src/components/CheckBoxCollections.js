import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

function CheckboxList({ options, selectedOptions, onChange, idPrefix }) {
  const handleCheckboxChange = (value) => {
    let newSelectedOptions;
    if (selectedOptions.includes(value)) {
      newSelectedOptions = selectedOptions.filter(v => v !== value);
    } else {
      newSelectedOptions = [...selectedOptions, value];
    }
    onChange(newSelectedOptions);
  };

  return (
    <View style={{ maxHeight: 450, borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 10, padding: 10 }}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}
          onPress={() => handleCheckboxChange(option.value)}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderWidth: 1,
              borderColor: '#CCCCCC',
              borderRadius: 4,
              marginRight: 10,
              backgroundColor: selectedOptions.includes(option.value) ? '#007AFF' : 'white',
            }}
          />
          <Text>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default CheckboxList;