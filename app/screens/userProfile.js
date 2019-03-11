import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Image,ImageBackground } from 'react-native';
import {f, auth, database, storage } from '../../config/config.js';
import UserAuth from '../folder/auth.js';
import Header from '../components/Header.js'
import Button from '../components/Button.js';
import UnborderedButton from '../components/UnborderedButton';
import Input from '../components/Input.js';
import PhotoList from '../components/PhotoList.js';


class userProfile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    }
  }

  checkParams = () => {
    var params = this.props.navigation.state.params;
    if (params){
      if (params.userId){
        this.setState({
          userId: params.userId
        });
        if(this.state.currentUserId !== this.state.userId){
          this.fetchUserData(params.userId);
          
        }else{
          return this.props.navigation.navigate('Profile');
        }
        
      }
    }
  }
  fetchUserData = (userId) => {
    var that = this;
    database.ref('Users').child(userId).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
        if (exists) data = snapshot.val();
          that.setState({
            userName: data.userName,
            fName: data.fName,
            profilePic: data.profilePic,
            userId: userId,
            loaded: false
          });

    });
  }

  followUser = (userId) =>{
    //alert(this.state.currentUserId);
    //alert(userId);
    var that = this;

    // add to currentUser following list
    database.ref('Users').child(userId).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
        if (exists) data = snapshot.val();
          database.ref('Users').child(that.state.currentUserId).child('Following').child(userId).set({userName: data.userName});

    });

    // add to user followers list
    database.ref('Users').child(that.state.currentUserId).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
        if (exists) data = snapshot.val();
          database.ref('Users').child(userId).child('Follower').child(that.state.currentUserId).set({userName: data.userName});

    });
    
    // add notification
    var timestamp = Math.floor(Date.now() / 1000);
    var NotifObj = {
      timestamp: timestamp,
      author: that.state.currentUserId,
      type: 'follow',
    };
    database.ref('Notification/' + userId).push(NotifObj);
  }

  unfollowUser = (userId) =>{
    //alert(this.state.currentUserId);
    //alert(userId);
    var that = this;

    // remove from currentUser following list
    database.ref('Users').child(userId).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
        if (exists) data = snapshot.val();
          database.ref('Users').child(that.state.currentUserId).child('Following').child(userId).remove();

    });

    // remove from user followers list
    database.ref('Users').child(that.state.currentUserId).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
        if (exists) data = snapshot.val();
          database.ref('Users').child(userId).child('Follower').child(that.state.currentUserId).remove();

    });
  }

  componentDidMount = () =>{
    var that = this;
    f.auth().onAuthStateChanged(function(user){
      if(user){

        that.setState({
          currentUserId: user.uid,
        });
        that.checkParams();
      }
    });
  }

  render(){
    return(
      <View style = {{flex:1}}>
      <ImageBackground source={require('../images/gradient.jpeg')} style={{width: '100%', height: '100%'}} >
      <Header texto={'@'+ this.state.userName} />

        <View style={{flex: 1}}>

          <View style={{justifyContent: 'left',  flexDirection: 'row', margin:10 }}>
            <View style={{flexDirection: 'col'}}>
              <Image source = {{ uri: this.state.profilePic}} style={{width:100, height:100, borderRadius:50}}/>
                <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
                  <UnborderedButton color='#42f498' iconColor='#42f498' icon="user-follow" onPress={()=> this.followUser(this.state.userId)}/>
                  <UnborderedButton color='#af402b' iconColor='#af402b' icon="user-unfollow"  onPress={()=> this.unfollowUser(this.state.userId)}/>
                </View>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Text style= {{
                fontSize: 18,
                color: 'white',
                margin: 5,
              }}>{this.state.fName}</Text>
                <View style={{flexDirection: 'col'}}>
                  <View style={{flexDirection: 'row',  marginLeft: 15}}>
                    <Button textoo='Following' onPress={()=> this.props.navigation.navigate('Following', {userId: this.state.userId})}/>
                    <Button textoo='Followers' onPress={()=> this.props.navigation.navigate('Follower', {userId: this.state.userId})}/>
                  </View>
               <View style={{marginLeft: 14, justifyContent: 'center', width: 210}}>
                 <Button textoo='Message' onPress={()=> this.props.navigation.goBack()}/>
               </View>
               <View style={{marginLeft: 14, justifyContent: 'center', width: 210}}>
                 <Button textoo='Back' onPress={()=> this.props.navigation.goBack()}/>
               </View>
            </View>
            </View>
          </View>
          
           
           <PhotoList
             isUser={true}
             userId={this.props.navigation.state.params.userId}
             navigation={this.props.navigation}/>
           
        </View>
        </ImageBackground>

      </View>

    )
  }
}

const styles = {
  buttonStyle: {
    backgroundColor: 'rgba(252,212,230,0.3)',
    borderRadius: '25px',
    borderColor: 'rgba(252,212,230,0.12',
    marginLeft: 7.5,
    marginRight:7.5,
    marginBottom: 10,
    //shadowColor: 'black',
    //shadowOffset: { width: 2, height: 5 },
    //shadowOpacity: 0.5
  },
  textStyle: {
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    color: 'white'
  },
};

export default userProfile;
