import React from 'react';
import { SearchBar } from 'react-native-elements'
import { ScrollView, TouchableOpacity,ActivityIndicator,ListView, FlatList, StyleSheet, Text, View, Image,ImageBackground } from 'react-native';
import {f, auth, database, storage } from '../../config/config.js';
import Header from '../components/Header.js'
import Button from '../components/Button.js'
import Input from '../components/Input.js';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import ParsedText from 'react-native-parsed-text';
import AlbumList from '../components/AlbumList.js';
import Card from '../components/Card.js';
import CardSection from '../components/CardSection.js';

class hashtag extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedin: false,
      hashtagList: [],
    hashtag: '',
    }
  }

  checkParams = () => {
    var params = this.props.navigation.state.params;
    if (params){
      if (params.hashtag){
        this.setState({
          hashtag: params.hashtag
        });
          this.fetchPost(params.hashtag);
        
      }
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
  
  addToHashLII = (hashtagList, data, photoid) =>{
    var that = this;
    var photoObj = data;
    database.ref('Users').child(photoObj.author).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists) data = snapshot.val();
      //if (data.userName != ''){
        hashtagList.push({
          id: photoid,
          caption: photoObj.caption,
          timestamp: that.convertTime(photoObj.timestamp),
          timestamp2: photoObj.timestamp,
          postUrl: photoObj.url,
          author: data.userName,
          authorId: photoObj.author,
          likecount: photoObj.likecount,
          profilePic: data.profilePic,
        });
        var sortData = [].concat(hashtagList);
        sortData.sort(function(a, b){
          return a.timestamp2 < b.timestamp2;
        });
      //}
        that.setState({
          refresh: false,
          hashtagList: sortData,
        });
        //console.log(that.state.hashtagList);
    }).catch(error => console.log(error));
    
  }
  
  addToHashL = (hashtagList, data, p) =>{
    var that = this;
    var hashObj = data[p];
    var photoid = hashObj.photoID;
    database.ref('Photos/').child(photoid).on('value', function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists) data = snapshot.val();
        
      that.addToHashLII(hashtagList, data, photoid);
      that.setState({
          hashtagList: hashtagList,
      });
    });
  }
  
  fetchPost = (searchText) =>{
    var that = this;
    var hashtag = searchText.replace('#', '');

    database.ref('Hashtags/'+hashtag).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
        if (exists) data = snapshot.val();
         var hashtagList = that.state.hashtagList;
         for (var p in data){
           that.addToHashL(hashtagList, data, p);
         }
        
         that.setState({
           //hashtagList: hashtagList,
           search: '',
        })
    }).catch(error => console.log(error));
    
  }
  
  componentDidMount = () =>{
    var that = this;

    f.auth().onAuthStateChanged(function(user){
      if(user){
        //logged in
        that.setState({
          loggedin: true,
          userId: user.uid
        });
      that.checkParams();
      }else{
        //not logged in
        that.setState({
          loggedin: false
        });
      }
    });
  }

  likePost = (authorId, photoId, likecount) =>{
    var that = this;
    // check whether user is in like list
    database.ref('Likes/' + photoId).once('value', function(snapshot){
       if (snapshot.hasChild(that.state.userId)){
        //unlike
        
        //update likecount
        var updateCount = likecount -1;
        database.ref('Photos/' + photoId).child('likecount').set(updateCount);
        database.ref('Users/' + authorId + '/Photos/' + photoId).child('likecount').set(updateCount);
        
        // remove userId to like list
        database.ref('Likes/' + photoId).child(that.state.userId).remove();
      
      }else{
        var likestate = 'true';
        var updateCount = likecount +1;
        //update likecount
        database.ref('Photos/' + photoId).child('likecount').set(updateCount);
        database.ref('Users/' + authorId + '/Photos/' + photoId).child('likecount').set(updateCount);
        
        // add userId to like list
        database.ref('Likes/' + photoId).child(that.state.userId).child('likestate').set(likestate);
                                          
        if (authorId != that.state.userId){
          var timestamp = Math.floor(Date.now() / 1000);
          var NotifObj = {
            timestamp: timestamp,
            author: that.state.userId,
            type: 'like',
            postId: photoId
          };
          database.ref('Notification/' + authorId).push(NotifObj);
        }
      }
    });
  }
  handleHashTagPress= (hashtag, matchIndex) =>{
    this.props.navigation.navigate('Hashtag', {hashtag: hashtag});
  }
  
  render(){
    return(
           <View style = {{flex: 1}}>
           <ImageBackground source={require('../images/gradient.jpeg')} style={{width: '100%', height: '100%'}} >
           <Header texto={this.state.hashtag} />

        { this.state.loggedin == true ?(
          // logged in
                                      
          <FlatList
            data = {this.state.hashtagList}
            keyExtractor = {(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <Card>
                <View style={{flexDirection:'row', margin: 5}}>
                  <Image source={{ uri: item.profilePic }} style={styles.thumbnailStyle} />
                  <View style={{margin: 5, marginTop: 10}}>
                    <TouchableOpacity onPress = { () => this.props.navigation.navigate('User', {userId: item.authorId})}>
                      <Text style={styles.headerTextStyle} >@{item.author}</Text>
                    </TouchableOpacity>
                    <Text style={{color: '#828282'}}>uploaded: {item.timestamp} ago</Text>
                  </View>
                </View>
                <Image style={styles.imageStyle} source={{ uri: item.postUrl }} />
                <View>
                  <TouchableOpacity style={{flexDirection: 'row',width: 70}} onPress={()=> this.likePost(item.authorId, item.id, item.likecount)}>
                    <FontAwesome name="heart" color="tomato" size={20} style={{margin: 5}}/>
                    <Text style={{margin: 5}}>{item.likecount} likes</Text>
                  </TouchableOpacity>
                </View>
                <ParsedText
                  parse={
                    [
                     {pattern: /#(\w+)/,                 style: styles.hashTag, onPress: this.handleHashTagPress},
                    ]
                  }
                >{item.caption}</ParsedText>
                <TouchableOpacity onPress = { () => this.props.navigation.navigate('Comment', {photoId: item.id})}>
                  <Text style={{
                    color: 'grey',
                    margin: 5,
                  }}>View Comments</Text>
                </TouchableOpacity>
              </Card>

            )}
          />
        ) : (
          <View style={styles.alertStyle}>
            <Text style={styles.textStyle}>You are not logged in</Text>
            <Text style={styles.textStyle}>Please login to view your feed</Text>
          </View>
      )}
      <View>
      <Button textoo='Back' onPress={()=> this.props.navigation.goBack()}/>
      </View>
      </ImageBackground  >
      </View>

    )
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    flex: 1,
    marginTop: 40,
    padding: 16,
  },
  textStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  thumbnailStyle: {
    height: 50,
    width: 50,
    margin: 5,
    borderRadius: 25,
  },
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },

  headerTextStyle: {
    fontSize: 18,
    color: '#4b9faa',
  },
  imageStyle: {
    height: 300,
    flex: 1,
    width: null
  },

  hashTag: {
    fontStyle: 'italic',
  },
});

export default hashtag;

