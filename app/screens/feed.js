import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image,ImageBackground } from 'react-native';
import {f, auth, database, storage } from '../../config/config.js';
import Header from '../components/Header.js';
import Input from '../components/Input.js';
import AlbumList from '../components/AlbumList.js';
import Card from '../components/Card.js';
import CardSection from '../components/CardSection.js';
import Button from '../components/Button.js';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import ParsedText from 'react-native-parsed-text';

/*
 * Hello Katelynn,
 * Line number 152-177 deals with the individual photos for the feed
 * TODO:
 *  change thumbail picture to post author's profile pic
 *
 */

class feed extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedin: false,
      refresh: false,
      photoList: [],
      followingList: [],
    }
  }

  componentDidMount = () =>{
    var that = this;

    f.auth().onAuthStateChanged(function(user){
      if(user){
        //logged in
        
        that.setState({
          loggedin: true,
          userId: user.uid,

        });
        that.loadFeed();
      }else{
        //not logged in
        that.setState({
          loggedin: false
        });
      }
    });
  }

  loadNew = () => {
    this.loadFeed();

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
  
  
  addToList = (photoList, data, photo) =>{
    var that = this;
    var photoObj = data[photo];
    database.ref('Users/' + that.state.userId + '/Following').once('value', function(snapshot){
       if (snapshot.hasChild(photoObj.author)){
         database.ref('Users').child(photoObj.author).once('value').then(function(snapshot){
        const exists = (snapshot.val() !== null);
        if (exists) data = snapshot.val();
        //if (data.userName != ''){
          photoList.push({
            id: photo,
            caption: photoObj.caption,
            timestamp: that.convertTime(photoObj.timestamp),
            timestamp2: photoObj.timestamp,
            postUrl: photoObj.url,
            author: data.userName,
            authorId: photoObj.author,
            likecount: photoObj.likecount,
            profilePic: data.profilePic,
          });
          var sortData = [].concat(photoList);
          sortData.sort(function(a, b){
            return a.timestamp2 < b.timestamp2;
          });
        //}
          that.setState({
            refresh: false,
            photoList: sortData,
          });
          console.log(that.state.photoList);
      }).catch(error => console.log(error));                                                          
       }
    });
    
  }
  
  
  loadFeed = () => {
    this.setState({
      refresh: true,
      photoList: [],
      followingList: [],
    });

    var that = this;
  
    
    database.ref('Photos').orderByChild('timestamp').once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists) data = snapshot.val();
        that.setState({empty:false});
        var photoList = that.state.photoList;
        for(var photo in data) {
          that.addToList(photoList, data, photo);
        }
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
  
  
  render(){
    return(
      <View style = {{flex: 1}}>
      <ImageBackground source={require('../images/gradient.jpeg')} style={{width: '100%', height: '100%'}} >


        { this.state.loggedin == true ?(
      
          <View>
          <View>
          <Header texto='Feed' />
          </View>
          <View style={{flexDirection: 'row', marginTop: 10, padding: 5, marginHorizontal: 5, borderRadius: 25, backgroundColor: '#66556d'}}>
          <TouchableOpacity onPress = { () => this.props.navigation.navigate('Search')}>
            <Ionicons name="ios-search" size={20} color={'white'} style={{marginRight: 5}}>
            <Text style={{ marginRight: 10, textAlign: 'center', color: 'white'}}>  Search</Text>
            </Ionicons>
          </TouchableOpacity>
          </View>
                                        
          <FlatList
            refreshing = {this.state.refresh}
            onRefresh = {this.loadNew}
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

          </View>
        ) : (
          <View>
          <View>
            <Header texto='Feed'/>
          </View>
          <View style={styles.alertStyle}>
            <Text style={styles.textStyle}>You are not logged in</Text>
            <Text style={styles.textStyle}>Please login to view your feed</Text>
          </View>
          </View>
      )}
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
 * Removed from render, but keeping this here just in case
              <Card>

              <CardSection>
              <View styles={styles.thumbnailcontarinerstyle}>
                <Image source={{ uri: item.postUrl }} style={styles.thumbnailStyle} />
              </View>
              <View styles={styles.headerContentStyle}>
              <TouchableOpacity onPress = { () => this.props.navigation.navigate('User', {userId: item.authorId})}>
                <Text style={styles.headerTextStule} >@{item.author}</Text>
              </TouchableOpacity>
              <Text>uploaded: {item.timestamp} ago</Text>
              </View>

              <View styles={styles.thumbnailcontarinerstyle}>
              <Button
                textoo={item.likecount + ' likes'}
                onPress={()=> this.likePost(item.authorId, item.id, item.likecount)}/>
              </View>

              <View styles={styles.thumbnailcontarinerstyle}>
              <TouchableOpacity onPress = { () => this.props.navigation.navigate('Comment', {photoId: item.id})}>
              <Text>View Comment</Text>
              </TouchableOpacity>

              </View>


              </CardSection>

              <CardSection>
                <Image style={styles.imageStyle} source={{ uri: item.postUrl }} />
              </CardSection>

              <CardSection>
              <Text>{item.caption}</Text>
              </CardSection>

            </Card>
*/

export default feed;
