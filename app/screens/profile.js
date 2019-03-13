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

          <View style={{flex:1}}>
            { this.state.editingProf == true ? (
              <View style={{flex: 1}}>
                <View style={{
                  backgroundColor: 'white',
                  height: 60,
                  paddingTop: 25,
                  shadowColor: 'black',
                  shadowOffset: {width: 2, height: 6},
                  shadowOpacity: 0.5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <View style={{zIndex: 1, marginRight: 70}}>
                    <TouchableOpacity onPress={()=> this.setState({editingProf: false})}>
                      <Text style={{color: '#b08ac3', fontSize: 20}}>Back</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#4b9faa',
                      fontFamily: 'Arial',
                    }}>Edit Profile</Text>
                  </View>
                  <View style={{zIndex: 1, marginLeft: 70}}>
                    <TouchableOpacity onPress={()=> this.writeUserData()}>
                      <Text style={{color: '#b08ac3', fontSize: 20}}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center', margin: 10}}>
                   <Image source = {{ uri: this.state.profilePic}} style={{width:120, height:120, borderRadius:60, marginTop: 10, marginBottom: 5}}/>
                   <UnborderedButton color='white' textoo='Edit Profile Picture' onPress={() => this.props.navigation.navigate('UploadProfilePic', {userId: this.state.userId})}/>
                </View>
                <View style={{marginBottom: 20}}>
                  <View style={{marginHorizontal: 20}}>
                    <View style={{marginLeft: 10, marginBottom: 5}}>
                      <Text style={{color: 'rgba(255,255,255,0.75)', fontSize: 16}}>First Name</Text>
                    </View>
                  <TextInput
                    editable = {true}
                    placeholder = {this.state.fName !== null ? this.state.fName : 'Enter your first name'}
                    onChangeText = {(text) => this.setState({fName: text})}
                    style = {{color: 'rgba(255,255,255,0.75)',paddingLeft: 20,lineHeight: 30,height: 40,borderRadius: 20, borderWidth:1, borderColor: 'rgba(252,212,230,0.12)', backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>
                <View style={{marginTop: 20}}>
                  <View style={{marginHorizontal: 20}}>
                    <View style={{marginLeft: 10, marginBottom: 5}}>
                      <Text style={{color: 'rgba(255,255,255,0.75)', fontSize: 16}}>User Name</Text>
                    </View>
                  <TextInput
                    editable = {true}
                    placeholder = {this.state.userName !== null ? this.state.userName : 'Enter your user name'}
                    onChangeText = {(text) => this.setState({userName: text})}
                    style = {{color: 'rgba(255,255,255,0.75)', paddingLeft: 20,lineHeight: 30,height: 40,borderRadius: 20, borderWidth:1, borderColor: 'rgba(252,212,230,0.12)', backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>
              </View>
            </View>
              {/*                <View style={{ flexDirection: 'col', marginTop: 10, justifyContent: 'center'   }} >
                <Button textoo='Save' onPress={()=> this.writeUserData()}/>
                <Button textoo='Back' onPress={()=> this.setState({editingProf: false})}/>
                </View>
              */}
          </View>

              ) : (
                <View style={{flex: 1}}>

            <Header texto='Profile' />
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
