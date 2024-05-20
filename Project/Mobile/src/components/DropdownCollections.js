import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

function Dropdown({ options, selectedOption, onChange }) {
  const handleChange = (value) => {
    const selected = options.find(option => option.value === value);
    onChange(selected);
  };

  return (
    <View>
      <Picker
        selectedValue={selectedOption?.value}
        onValueChange={handleChange}
      >
        <Picker.Item label="Selecciona una opción" value={null} />
        {options.map((option, index) => (
          <Picker.Item key={index} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  );
}

export default Dropdown;