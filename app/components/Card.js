import React from 'react';
import { View } from 'react-native';

const Card = (props) => {
  return (
    <View style={style.containerStyle}>
      {props.children}
    </View>
  );
};

const style = {
  containerStyle: {
    borderWidth: 1,
    borderRadius: 1,
    borderColor: 'grey',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    backgroundColor: 'white'  }
};

export default Card;
