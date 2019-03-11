//import libraries

import React from 'react';
import { Text, View } from 'react-native';


const Header = (props) => {
  const { textStyle, viewStyle } = styles;


  return (
    <View style={viewStyle}>
      <Text style={textStyle}> {props.texto} </Text>
    </View>
  );
};


const styles = {
  viewStyle: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    paddingTop: 25,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.5,
  },

  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4b9faa',
    fontFamily: 'Arial',
  }
};


export default Header;
