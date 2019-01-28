import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import {f, auth, db, storage } from './config/config.js';

import feed from './app/screens/feed.js';
import upload from './app/screens/upload.js';
import profile from './app/screens/profile.js';

const MainTab = createAppContainer(createBottomTabNavigator(
{
  Feed: {screen: feed},
  Upload: {screen: upload},
  Profile: {screen: profile},
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class App extends React.Component {
  
  constructor(props){
    super(props);
  }
  
  render(){
    return(
      <MainTab />
    );
  }
}
