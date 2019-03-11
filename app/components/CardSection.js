import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  /*containerStyle: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
    alignItems: 'stretch'
  }*/
  containerStyle: {
    padding: 6,
    margin: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'stretch',
    borderRadius: '25px',
  }
};

export default CardSection;
