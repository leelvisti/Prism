import React from 'react';
import { TextInput, View, Text,Keyboard } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Input = (prop) => {

  return (
  <View style={styles.containerStyle}>
    { prop.textBack == 'Email:' ? <MaterialCommunityIcons size={20} style={styles.iconStyle} name="email-outline"/> : prop.textBack == 'Password:' ? <MaterialCommunityIcons size={20} style={styles.iconStyle} name="lock-outline"/> : null}
    <TextInput
      secureTextEntry={prop.password}
      autoCorrect={false}
      style={styles.inputStyle}
      value={prop.value}
      onChangeText={prop.onChangeText}
      placeholder={prop.placeholder}
    />

  </View>
);
};

const styles = {
  inputStyle: {
    color: '#000',
    paddingLeft: 4,
    textAlignVertical: 'top',
  },

  labelStyle: {
    fontSize: 8,
    paddingLeft: 5,
    flex: 1
  },

  containerStyle: {
    height: 30,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },

  iconStyle: {
    color: '#e2d3da',
    marginRight: 5,
    marginLeft: 5,
  }
};

export default Input;
