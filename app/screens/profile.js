import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import {f, auth, db, storage } from '../../config/config.js';
import UserAuth from '../folder/auth.js';


class profile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedin: false
    }
    
  }
  
  writeUserData(fname){
    db.ref('Users/').set({fname}).then((data)=>{
      //success callback
      console.log('data ' , data)
    }).catch((error)=>{
      //error callback
      console.log('error ' , error)
      })
  }
/*
    readUserData() {
      firebase.database().ref('Users/fname').on('value', function (snapshot) {
        this.setState({fname: snapshot.val()})
      });
    }*/
  
  
  componentDidMount = () =>{
    var that = this;
    
    //Hello Katelynn
    db.ref('Users/fname').on('value', function (snapshot) {
      that.setState({fname: snapshot.val()})
    });
    
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

  
  logout = () => {
    auth.signOut();
  }
  
  editProfile = () => {
    this.setState({editingProf: true})
  }
  
  render(){
    return(
      <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        { this.state.loggedin == true ? (
           //are logged in
          <View>
            { this.state.editingProf == true ? (
                <View>
                <Text>Editing Profile</Text>
                <TouchableOpacity onPress={()=> this.setState({editingProf: false})}>
                  <Text>Go Back</Text>
                </TouchableOpacity>
                <Text>First Name:</Text>
                <TextInput
                  editable = {true}
                  placeholder = {'enter your first name'}
                  onChangeText = {(text) => this.setState({fname: text})}
                  value = {this.state.fname}
                  style = {{borderWidth:1, borderColor: 'black'}}
                />
                <TouchableOpacity onPress={()=> this.writeUserData(this.state.fname)}>
                <Text style={{color: 'black'}}>Save</Text>
                </TouchableOpacity>
                
                </View>
                                                
              ) : (
                   
                <View>
                  <Text>Hello</Text>
                  <Text>
                   {this.state.fname}
                  </Text>
                  <TouchableOpacity onPress={()=> this.editProfile()}>
                  <Text style={{color: 'black'}}>Edit Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> this.logout()}>
                  <Text style={{color: 'black'}}>Log Out</Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
          ) : (
             //not logged in
            <UserAuth message = {'Please Login to view your profile'}/>
          )}
      </View>
    )
  }
}

export default profile;
