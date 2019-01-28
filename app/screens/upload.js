import React from 'react';
import { Flatlist, StyleSheet, Text, View, Image } from 'react-native';
import {f, auth, db, storage } from '../../config/config.js';

class upload extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return(
      <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Upload</Text>
      </View>
    )
  }
}

export default upload;
