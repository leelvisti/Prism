import React from 'react';
import {TouchableOpacity,TextInput,FlatList, StyleSheet, Text, View, Image,ImageBackground } from 'react-native';
import {f, auth, database, storage } from '../../config/config.js';
import Header from '../components/Header.js'
import Button from '../components/Button.js'
import Input from '../components/Input.js';
import AlbumList from '../components/AlbumList.js';
import Card from '../components/Card.js';
import CardSection from '../components/CardSection.js';
import {FontAwesome} from '@expo/vector-icons';

class dm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedin: false,
      FollowingList:[],
      refresh: false
    }
  }

  componentDidMount = () =>{
    var that = this
    f.auth().onAuthStateChanged(function(user){
      if(user){
        //logged in
        that.setState({
          loggedin: true
        });
      }
    });
    var currentUID = f.auth().currentUser.uid;
    database.ref('Users').child(currentUID).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
        if (exists){
          data = snapshot.val();
          that.setState({userName: data.userName});
     }
    });
    that.fetchFollowingList();
  }
  
  addToList = (FollowingList, u, data) =>{
    var that = this;
    var fObj = data[u];
    var currentUID = f.auth().currentUser.uid;
    if (!!fObj.roomId){
      var roomId =fObj.roomId;
    }else{
      var roomId = that.createId();
      database.ref('Users/'+currentUID+'/Following/'+u).child('roomId').set(roomId);
      database.ref('Users/'+u+'/Following/'+currentUID).child('roomId').set(roomId);
    }
    database.ref('Users/' + u + '/Following').once('value', function(snapshot){
       if (snapshot.hasChild(currentUID)){
        database.ref('Users').child(u).once('value').then(function(snapshot){
            const exists = (snapshot.val() !== null);
            if (exists) data = snapshot.val();
            FollowingList.push({
              id: u,
              userName: data.userName,
              profilePic: data.profilePic,
              roomId: roomId
            });
            that.setState({
              refresh: false,
              FollowingList:FollowingList
            });
                                                          console.log(FollowingList);
          }).catch(error => console.log(error));
      }
    });
  }
  
  fetchFollowingList = () => {
    this.setState({
      FollowingList: [],
      refresh:true,
    });
    var that = this;
    var currentUID = f.auth().currentUser.uid;
    database.ref('Users/'+currentUID+'/Following').once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists){
          // add notification
        data = snapshot.val()
                                                                    
        var FollowingList = that.state.FollowingList;
        for(var u in data){
          that.addToList(FollowingList, u, data);
        }
                                                                    
      }
    }).catch(error => console.log(error));
  }
  
  reload = () =>{
    this.fetchFollowingList();
  }
  
  randomString = () =>{
    return Math.floor((1+ Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }
  
  createId = () => {
    return this.randomString() + this.randomString() + '-' + this.randomString() + '-' + this.randomString() + '-' + this.randomString() + '-' + this.randomString() + '-' + this.randomString() + '-' + this.randomString();
  }
  
  render(){
    return(
     <View style = {{flex: 1}}>
     <ImageBackground source={require('../images/gradient.jpeg')} style={{width: '100%', height: '100%'}} >
      <View style={{
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        paddingTop: 25,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 6 },
        shadowOpacity: 0.5,
      }}>
        <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4b9faa',
        fontFamily: 'Arial',
        }}>Message</Text>
        <View style={{position: 'absolute', right: 30, top: 35}}>
          <TouchableOpacity>
            <FontAwesome name='refresh' size={20}/>
          </TouchableOpacity>
        </View>
      </View>

        { this.state.loggedin == true ?(
          // logged in
          <View >
            <FlatList
              refreshing = {this.state.refresh}
              onRefresh = {this.reload}
              data = {this.state.FollowingList}
              keyExtractor = {(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View style={styles.container}>
                  <Image source={{ uri: item.profilePic }} style={styles.thumbnailStyle} />
                  <View style={styles.contentContainer}>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity onPress = { () => this.props.navigation.navigate('User', {userId: item.id})}>
                        <Text style={{color: '#48384f', fontSize: 16}}>@{item.userName}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{
                          borderRadius: '25px',
                          backgroundColor: '#b08ac3',
                          marginHorizontal: 7.5,
                          right: 0,
                          position: 'absolute'
                      }} onPress = { () => this.props.navigation.navigate('Chat', {un: item.userName,username: this.state.userName, roomId: item.roomId, receiveId: item.id})}>
                        <Text style={{
                          color: '#48384f',
                          fontSize: 16,
                          paddingVertical: 10,
                          paddingHorizontal: 15,
                          color: 'white'
                        }}>PM</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                                              
                  <View>
                  </View>
                </View>
              )}
             />
          </View>
        ) : (
          <View style={styles.alertStyle}>
            <Text style={styles.textStyle}>You are not logged in</Text>
            <Text style={styles.textStyle}>Please login to view your feed</Text>
          </View>
      )}
      </ImageBackground>
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
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    padding: 5,
  },
  thumbnailStyle: {
    height: 50,
    width: 50,
    margin: 5,
    borderRadius: 25,
  },
};

export default dm;
