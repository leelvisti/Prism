import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.buttonStyle}>
    <Text style={styles.textStyle}>{props.textoo}</Text>
    </TouchableOpacity>

  );
};

const styles = {
  buttonStyle: {
    backgroundColor: 'rgba(252,212,230,0.3)',
    borderRadius: '25px',
    borderColor: 'rgba(252,212,230,0.12',
    marginLeft: 7.5,
    marginRight:7.5,
    marginBottom: 10,
    //shadowColor: 'black',
    //shadowOffset: { width: 2, height: 5 },
    //shadowOpacity: 0.5
  },
  textStyle: {
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    color: 'white'
  },
};

export default Button;
