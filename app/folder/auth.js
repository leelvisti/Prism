import React from 'react';
import {Facebook} from 'expo';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import {f, auth, database, storage } from '../../config/config.js';
import Input from '../components/Input.js';
import Button from '../components/Button.js';
import FBButton from '../components/FBButton.js';
import CardSection from '../components/CardSection.js';
import Card from '../components/Card.js';


class UserAuth extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    auth.onAuthStateChanged(function(user){
      if (user){
        
        console.log('Logged in', user);
      }else{
        console.log('Logged out');
      }
    });
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
    //make user login
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
  
  // facebook via expo only
  async facebookLogin (){
    const{type, token} = await Facebook.logInWithReadPermissionsAsync(
      //"<APP_ID>"
      "368980453654922", {
        permissions: ['public_profile', 'email']
      }
    );
    
    if (type == 'success'){
      // Handle successful authentication here
      const credential = f.auth.FacebookAuthProvider.credential(token);
      try{
        //login with credential
        await auth.signInAndRetrieveDataWithCredential(credential);
      } catch(error){
        //console.log(error);
        alert(error);
      }
    } else {
        alert('Failed to Sign In with Facebook');
    }
  }
  
  
  componentDidMount = () =>{
    
  }

  render()
  {
    return(
      <View>

        <Text style={{fontSize: 15}}>{this.props.message}</Text>

        <CardSection>

        <Input
               password={false}
               textBack='Email:'
               onChangeText={(text1) => this.setState({email: text1})}
               value={this.state.email}
               placeholder = {'Email'}

              />
        </CardSection>
        <CardSection>


        <Input
               password={true}
               textBack='Password:'
               onChangeText = {(text2) => this.setState({password: text2})}
               value = {this.state.password}
               placeholder = {'Password'}

              />
        </CardSection>



        <View style={{ flexDirection: 'column',  padding: 3, flex:0.4, justifyContent: 'center'   }} >
           <View style={{ flexDirection: 'column',  padding: 1, flex:0.45, justifyContent: 'center'   }} >
           <Button onPress={()=> this.login()} textoo='Login' />
          <Button onPress={()=> this.signup()} textoo='Sign Up' />
          <FBButton onPress={()=> this.facebookLogin()} textoo='Sign In via Facebook' />
        </View>
        </View>

        </View>

    )
  }
}

const styles = {
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 5.5
  },

  labelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    flex: 2
  },

  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export default UserAuth;
