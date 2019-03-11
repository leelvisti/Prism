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
import ParsedText from 'react-native-parsed-text';

class post extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedin: false,
      photoList: [],
    }
  }
  
  checkParams = () => {
    var params = this.props.navigation.state.params;
    if (params){
      if (params.photoId){
        this.setState({
          photoId: params.photoId
        });
          this.fetchPost(params.photoId);
        
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
  
  addToList = (photoList, data) =>{
    var that = this;
    var photoObj = data;
    var photoId = that.state.photoId;
    database.ref('Users').child(photoObj.author).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists) data = snapshot.val();
        photoList.push({
          id: photoId,
          caption: photoObj.caption,
          timestamp: that.convertTime(photoObj.timestamp),
          timestamp2: photoObj.timestamp,
          postUrl: photoObj.url,
          author: data.userName,
          authorId: photoObj.author,
          likecount: photoObj.likecount,
          profilePic: data.profilePic,
        });
        that.setState({
          refresh: false,
          photoList: photoList,
        });
    }).catch(error => console.log(error));

    
  }
  
  
  fetchPost = (photoId) => {
    this.setState({
      refresh: true,
      photoList: [],
    });

    var that = this;
    
    database.ref('Photos').child(photoId).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists) data = snapshot.val();
        //that.setState({empty:false});
        var photoList = that.state.photoList;
        that.addToList(photoList, data);
        
        /*
        var sortData = [].concat(that.state.photoList);
        sortData.sort((a, b) => b.value["timestamp2"].compareTo(a.value["timestamp2"]));
        that.setState({
            photoList: sortData,
        });*/
      console.log(data);
    }).catch(error => console.log(error));

  }
  //new update
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

  handleHashTagPress= () =>
  this.props.navigation.navigate('hashtag');
  
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
    this.checkParams();
  }

  render(){
  return(
    <View style = {{flex:1}}>
    <ImageBackground source={require('../images/gradient.jpeg')} style={{width: '100%', height: '100%'}} >

    <Header texto='Comments' />
    <Input type='file' onChange={this.fileselectedhandler}/>
    
    <FlatList
      refreshing = {this.state.refresh}
      data = {this.state.photoList}
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

         
    <View>
    <Button textoo='Back' onPress={()=> this.props.navigation.goBack()}/>
    </View>


    </ImageBackground>
    </View>


  )
}
}

const styles = {
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },

  headerTextStyle: {
    fontSize: 18,
    color: '#4b9faa',
  },

  thumbnailStyle: {
    height: 50,
    width: 50,
    margin: 5,
    borderRadius: 25,
  },
  thumbnailContainerStyle: {
    justifyContent: 'left',
    //marginLeft: '0',
    //marginRighh: '0',
    margin: 10,
    flexDirection: 'row',
    flex: 1,
  },
  imageStyle: {
    height: 300,
    flex: 1,
    width: null
  },
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
  hashTag: {
  fontStyle: 'italic',
  },
};

/*
    <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
    <Button textoo='Comment'/>
    </View>
*/
export default post;

