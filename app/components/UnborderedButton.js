import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const UnborderedButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={{
      backgroundColor: 'rgba(252,212,230,0.0)',
      borderColor: props.color,
      borderWidth: 1,
      margin: 5,
    }}>
    <Text style={{
      alignSelf: 'center',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10,
      color: props.color
    }}>{props.textoo}</Text>
    </TouchableOpacity>

  );
};

export default UnborderedButton;
