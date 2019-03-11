import React from 'react';
import {TouchableOpacity,KeyboardAvoidingView,TextInput,FlatList, StyleSheet, Text, View, Image,ImageBackground } from 'react-native';
import {f, auth, database, storage } from '../../config/config.js';
import Header from '../components/Header.js';
import Input from '../components/Input.js';
import AlbumList from '../components/AlbumList.js';
import Card from '../components/Card.js';
import CardSection from '../components/CardSection.js';
import Button from '../components/Button.js';
import {FontAwesome} from '@expo/vector-icons';

class notification extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedin: false,
      nList: []
    }
  }
  
  convertTime = (timestamp) =>{
    var d = new Date(timestamp*1000);
    var seconds = Math.floor((new Date() - d) /1000);
    var interval = Math.floor(seconds /31536000);
    if (interval >1){
      return interval + ' years';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >1){
      return interval + ' months';
    }
    interval = Math.floor(seconds / 86400);
    if (interval >1){
      return interval + ' days';
    }
    interval = Math.floor(seconds / 3600);
    if (interval >1){
      return interval + ' hours';
    }
    interval = Math.floor(seconds / 60);
    if (interval >1){
      return interval + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  }
  
  addToList = (nList, data, n) =>{
    var that = this;
    var nObj = data[n];
    database.ref('Users').child(nObj.author).once('value').then(function(snapshot){
        const exists = (snapshot.val() !== null);
        if (exists) data = snapshot.val();
                                                            
          // like
          if (nObj.type == 'like'){
            nList.push({
              id: nObj,
              authorId: nObj.author,
              authorName: data.userName,
              profilePic:data.profilePic,
              postId: nObj.postId,
              timestamp: that.convertTime(nObj.timestamp),
              timestamp2: nObj.timestamp,
              type: nObj.type,
            });
          }else if (nObj.type == 'follow'){
            nList.push({
              id: nObj,
              authorId: nObj.author,
              authorName: data.userName,
              profilePic:data.profilePic,
              timestamp: that.convertTime(nObj.timestamp),
              timestamp2: nObj.timestamp,
              type: nObj.type,
            });
          }else{
            // comment
            nList.push({
              id: nObj,
              authorId: nObj.author,
              authorName: data.userName,
              profilePic:data.profilePic,
              postId: nObj.postId,
              commentId: nObj.commentId,
              timestamp: that.convertTime(nObj.timestamp),
              timestamp2: nObj.timestamp,
              type: nObj.type,
            });
          }
          var sortData = [].concat(nList);
          sortData.sort(function(a, b){
            return a.timestamp2 > b.timestamp2;
          });
          that.setState({
            refresh: false,
            nList:sortData
          });
                                                                      
      }).catch(error => console.log(error));
  }
  
  fetchNoti = () => {
    var that = this;
    var currentUID = f.auth().currentUser.uid;
  database.ref('Notification').child(currentUID).orderByChild('timestamp').once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists){
          // add notification
        data = snapshot.val()
        var nList = that.state.nList;
        for(var n in data){
          that.addToList(nList, data, n);
        }
      }else{
          // no notification
        that.setState({
          nList: []
        });
      }
    }).catch(error => console.log(error));
  }
  
  reloadNoti = () =>{
    this.setState({
      nList: [],
    });
    this.fetchNoti();
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
    
    this.fetchNoti();
  }

  render(){
  return(
    <View style = {{flex:1}}>
    <ImageBackground source={require('../images/gradient.jpeg')} style={{width: '100%', height: '100%'}} >

    <Header texto='Notifications' />
    
    {this.state.nList.length == 0 ?(
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{fontSize: 24, color: 'white'}}>No Notifications</Text>
      </View>
    ):(
         <FlatList
          refreshing = {this.state.refresh}
          onRefresh = {this.reloadNoti}
          data = {this.state.nList}
          keyExtractor = {(item, index) => index.toString()}    
          renderItem={({item, index}) => (
            <View style={styles.container}>
              <Image source={{ uri: item.profilePic }} style={styles.thumbnailStyle} />
              <View style={styles.contentContainer}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress = { () => this.props.navigation.navigate('User', {userId: item.authorId})}>
                    <Text style={{color: '#48384f', fontSize: 16}}>@{item.authorName}</Text>
                  </TouchableOpacity>
                  <Text style={{color: '#828282', fontSize: 12, marginLeft: 7}}>{item.timestamp} ago</Text>
                </View>
                <View>
                  {
                  item.type == 'like'
                     ?
                    <TouchableOpacity onPress = { () => this.props.navigation.navigate('Post', {photoId: item.postId})}>
                    <Text style={{fontSize: 16}}>liked your post.</Text>
                    </TouchableOpacity>
                     :
                    <View></View>
                  }
                </View>
                <View>
                  {
                  item.type == 'comment'
                     ?
                    <TouchableOpacity onPress = { () => this.props.navigation.navigate('Post', {photoId: item.postId})}>
                    <Text style={{fontSize: 16}}>commented on your post.</Text>
                    </TouchableOpacity>
                     :
                    <View></View>
                  }
                </View>
                <View>
                  {
                  item.type == 'follow'
                     ?
                    <Text style={{fontSize: 16}}>started following you.</Text>
                     :
                    <View></View>
                  }
                </View>
              </View>
                                          
              <View>
              </View>
            </View>
          )}
         />
    )}
    
    <Input type='file' onChange={this.fileselectedhandler}/>
         
    <View>
    <Button textoo='Back' onPress={()=> this.props.navigation.goBack()}/>
    </View>


    </ImageBackground>
    </View>


  )
}
}

const styles = {
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

/*
    <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
    <Button textoo='Comment'/>
    </View>
*/
export default notification;
