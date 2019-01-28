import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import {f, auth, db, storage } from '../../config/config.js';


class UserAuth extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      //moveScreen: false
    }
  }
  
  
  login = async() => {
    //make user login
    var email = this.state.email;
    var password = this.state.password;
    if (email != '' && password != ''){
      try{
        let user = await auth.signInWithEmailAndPassword(email, password);
      }catch(error){
        //console.log(error);
        alert(error);
      }
    }else{
      alert('please enter your email and password');
    }
  }
  
  signup = async() => {
    
    var email = this.state.email;
    var password = this.state.password;
    if (email != '' && password != ''){
      try{
        let user = await auth.createUserWithEmailAndPassword(email, password);
        //.then((userObj) => this.createUserObj(userObj.user, email))
        //.catch((error) => alert(error));
      }catch(error){
        //console.log(error);
        alert(error);
      }
    }else{
      alert('please enter your email and password');
    }
    
  }
  
  componentDidMount = () =>{
    
  }
  
  render()
  {
    return(
      <View>
        <Text>Login require</Text>
        <Text>{this.props.message}</Text>

        <Text>Email Address:</Text>
        <TextInput
        editable = {true}
        keyboardType = {'email-address'}
        placeholder = {'email address..'}
        onChangeText = {(text1) => this.setState({email: text1})}
        value = {this.state.email}
        style = {{borderWidth:1, borderColor: 'black'}}
        />
       
        <Text>Password:</Text>
        <TextInput
        editable = {true}
        secureTextEntry = {true}
        placeholder = {'enter your password..'}
        onChangeText = {(text2) => this.setState({password: text2})}
        value = {this.state.password}
        style = {{borderWidth:1, borderColor: 'black'}}
        />
           

        <TouchableOpacity onPress={()=> this.login()}>
        <Text style={{color: 'black'}}>Login</Text>
        </TouchableOpacity>
       
        <TouchableOpacity onPress={()=> this.signup()}>
        <Text style={{color: 'black'}}>Sign Up</Text>
        </TouchableOpacity>
       
        <TouchableOpacity onPress={() => this.setState({stage: 0})}>
        <Text style={{color: 'blue'}}>Log In via Facebook</Text>
        </TouchableOpacity>
        </View>
      
    )
  }
}



export default UserAuth;
