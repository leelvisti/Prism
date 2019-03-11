import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import {SimpleLineIcons} from '@expo/vector-icons';

const UnborderedButton = (props) => {
  return (
    !props.icon ? 
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
    </TouchableOpacity> :
    <TouchableOpacity onPress={props.onPress} style={{
      backgroundColor: 'rgba(252,212,230,0.0)',
      borderColor: props.color,
      borderWidth: 1,
      margin: 5,
      padding: 10,
    }}>
    <SimpleLineIcons name={props.icon} color={props.iconColor} size={16}>
    <Text style={{
      alignSelf: 'center',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10,
      color: props.color
    }}>{props.textoo}</Text>
    </SimpleLineIcons>
    </TouchableOpacity>

  );
};

export default UnborderedButton;
