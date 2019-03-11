import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, Image ,ImageBackground,KeyboardAvoidingView} from 'react-native';
import {f, auth, database, storage } from '../../config/config.js';
import UserAuth from '../folder/auth.js';
import Header from '../components/Header.js'
import Button from '../components/Button.js';
import UnborderedButton from '../components/UnborderedButton';
import Input from '../components/Input.js';
import PhotoList from '../components/PhotoList.js';


class profile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedin: false,
    }
  }

  logout = () => {
    auth.signOut();
  }

  editProfile = () => {
    this.setState({editingProf: true})
  }

  searchUser = () => {
    this.setState({searchingUser: true})
  }


  fetchUserData = (userId) => {
    var that = this;
    database.ref('Users').child(userId).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
        if (exists){
          data = snapshot.val();
          that.setState({
            userName: data.userName,
            fName: data.fName,
            profilePic: data.profilePic,
            userId: userId,
            loggedin: true
          });
        }else{
          that.setState({
            userName: '',
            fName: '',
            userId: userId,
            profilePic: 'http://i.pravatar.cc/150?img=2',
            loggedin: true
          });
          // temporarys save init profile pic to db
          database.ref('Users').child(that.state.userId).child('profilePic').set(that.state.profilePic);
       }
    });
  }

  writeUserData = () => {
    var fName = this.state.fName;
    var userName = this.state.userName;
    if (fName !== ''){
      database.ref('Users').child(this.state.userId).child('fName').set(fName);
    }
    if (userName !== ''){
      database.ref('Users').child(this.state.userId).child('userName').set(userName);
    }

    this.setState({editingProf:false});
  }


  componentDidMount = () =>{
    var that = this;

    f.auth().onAuthStateChanged(function(user){
      if(user){
        //logged in
        //that.fetchUserData(user.uid);
        that.setState({
          loggedin: true,
          userId: user.uid
        });
        that.fetchUserData(user.uid);
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
      <View style = {{flex:1}}>
      <ImageBackground source={require('../images/gradient.jpeg')} style={{width: '100%', height: '100%'}} >

        { this.state.loggedin == true ? (

          <View style={{flex:1 ,justifyContent: 'center', flexDirection: 'column'}}>
          <View >
            <Header texto='Profile' />
          </View>
            { this.state.editingProf == true ? (
              <View style={{flexDirection: 'column',justifyContent: 'center',  padding: 5, flex: 1    }}>
                <Text>Editing Profile</Text>

                <Text>First Name:</Text>

                <TextInput
                  editable = {true}
                  placeholder = {'enter your first name'}
                  onChangeText = {(text) => this.setState({fName: text})}
                  value = {this.state.fName}
                  style = {{borderWidth:1, borderColor: 'black'}}
                />

                <Text>User Name:</Text>

                <TextInput
                  editable = {true}
                  placeholder = {'enter your first name'}
                  onChangeText = {(text) => this.setState({userName: text})}
                  value = {this.state.userName}
                  style = {{borderWidth:1, borderColor: 'black'}}
                />

                <View style={{ flexDirection: 'col', marginTop: 10, justifyContent: 'center'   }} >
                <Button textoo='Save' onPress={()=> this.writeUserData()}/>
                <Button textoo='Go Back' onPress={()=> this.setState({editingProf: false})}/>
                </View>

                </View>

              ) : (
                <View style={{flex: 1}}>

                   <View style={{justifyContent: 'left', margin: 10, flexDirection: 'row',}}>
                     <View style={{flexDirection: 'col'}}>
                       <View style={{alignItems: 'center'}}>
                         <Text style={{color: 'white', fontSize: 16}}>{'Hello ' + this.state.fName}</Text>
                       </View>
                       <Image source = {{ uri: this.state.profilePic}} style={{width:100, height:100, borderRadius:50, margin: 10}}/>
                       <View style={{alignItems: 'center'}}>
                         <Text style={{color: 'white', fontSize: 16}}>{'@' + this.state.userName}</Text>
                       </View>
                     </View>
                     <View style={{flexDirection: 'column'}}> 
                      <View style={styles.buttonViewStyleRow} >
                         <Button textoo='Following' onPress={()=> this.props.navigation.navigate('Following', {userId: this.state.userId})}/>
                         <Button textoo='Followers' onPress={()=> this.props.navigation.navigate('Follower', {userId: this.state.userId})}/>
                      </View>
                       <UnborderedButton color='white' textoo='Edit Profile' onPress={()=> this.editProfile()}/>
                      <View style={{flexDirection: 'row'}}>
                        <UnborderedButton color='white' textoo='Upload New Post' onPress={()=> this.props.navigation.navigate('Upload')}/>
                        {/*<UnborderedButton color='white' textoo='Noti' onPress={()=> this.props.navigation.navigate('Notification')}/>*/}
                        <UnborderedButton color='#af402b' textoo='Log Out' onPress={()=> this.logout()}/>
                      </View>
                    </View> 
                  </View>

                   <PhotoList
                   isUser={true}
                   userId={this.state.userId}
                   navigation={this.props.navigation}/>
                   
                </View>
              )}
          </View>
          ) : (

               <View style = {{flex: 1,  flexDirection: 'column'}}>
                 <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={require('../images/Prism_logo.png')} style={{height: 200, width: 200, marginLeft: 50, marginTop: 50}}/>
                 </View>
               <View style = {{flex: 1,  flexDirection: 'row',  justifyContent: 'center'}}>
                 <UserAuth message = {'Please Login to view your profile'}/>
               </View>

            </View>


          )}
          </ImageBackground>

      </View>

    )
  }
}

const styles = {
  buttonViewStyleRow: {
    flexDirection: 'row',
  },
  buttonViewStyleColumn: {
    flexDirection: 'column',
  },
};

export default profile;
