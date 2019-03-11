import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const FBButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.fbButtonStyle}>
    <FontAwesome name="facebook" color="white" size={20} style={styles.fbIconStyle}/>
    <Text style={styles.fbTextStyle}>{props.textoo}</Text>
    </TouchableOpacity>

  );  
};

const styles = { 
  fbButtonStyle: {
    backgroundColor: '#3b5998',
    borderRadius: '25px',
    marginLeft:0,
    marginRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },  
  fbTextStyle: {
    fontSize: 16, 
    alignSelf: 'center',
    paddingTop: 10, 
    paddingBottom: 10, 
    color: 'white',
  },  
  fbIconStyle: {
    paddingLeft: 20, 
    paddingRight: 10, 
    alignSelf: 'center',
  }
};

export default FBButton

