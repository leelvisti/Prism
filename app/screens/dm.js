import React from 'react';
import { Flatlist, StyleSheet, Text, View, Image ,ImageBackground} from 'react-native';
import {f, auth, database, storage } from '../../config/config.js';
import Header from '../components/Header.js'
import Button from '../components/Button.js'
import Input from '../components/Input.js';
//import Chatkit from '@pusher/chatkit-server';

class dm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedin: false
    }
  }

  
  componentDidMount = () =>{
    var that = this;

    
    f.auth().onAuthStateChanged(function(user){
      if(user){
        //logged in
        that.setState({
          loggedin: true
        });
      }else{
        //not logged in
        that.setState({
          loggedin: false
        });
      }
    });
  }

  render(){
    return(
           <View style = {{flex: 1}}>
           <ImageBackground source={require('../images/gradient.jpeg')} style={{width: '100%', height: '100%'}} >
           <Header texto='MSG' />

        { this.state.loggedin == true ?(
          // logged in
          <View>
            <Text>'Message'</Text>
          </View>
        ) : (
          <View style={styles.alertStyle}>
            <Text style={styles.textStyle}>You are not logged in</Text>
            <Text style={styles.textStyle}>Please login to view your feed</Text>
          </View>
      )}
      </ImageBackground  >
      </View>

    )
  }
}

const styles = {
  alertStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 200,
    paddingTop: 100,
    paddingBottom: 100,
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: '10px',
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 20,
    color: 'white',
  },
};

export default dm;
