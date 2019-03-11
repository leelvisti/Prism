import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image,ImageBackground } from 'react-native';
import {f, auth, database, storage } from '../../config/config.js';
import Header from '../components/Header.js';
import Input from '../components/Input.js';
import AlbumList from '../components/AlbumList.js';
import Card from '../components/Card.js';
import CardSection from '../components/CardSection.js';
import Button from '../components/Button.js';
import {FontAwesome } from '@expo/vector-icons';
import ParsedText from 'react-native-parsed-text';

class PhotoList extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      PhotoList: [],
      refresh: false,
    }
  }
  
  componentDidMount = () => {
    const{isUser, userId} = this.props;
    if (isUser == true){
      this.setState({
        uid: userId,
      })
      this.loadFeed(userId);
    }else{
      this.loadFeed('');
    }
  }
  
  loadNew = () => {
    this.loadFeed();

  }

  addToList = (photoList, data, photo) =>{
    var that = this;
    var photoObj = data[photo];
      database.ref('Users').child(photoObj.author).once('value').then(function(snapshot){
        const exists = (snapshot.val() !== null);
        if (exists) data = snapshot.val();
          photoList.push({
            id: photo,
            caption: photoObj.caption,
            timestamp: photoObj.timestamp,
            postUrl: photoObj.url,
            author: data.userName,
            authorId: photoObj.author,
            likecount: photoObj.likecount,
          });
          var sortData = [].concat(photoList);
          sortData.sort(function(a, b){
            return a.timestamp < b.timestamp;
          });
          that.setState({
            refresh: false,
            photoList: sortData
          });

      }).catch(error => console.log(error));
  }
  
  loadFeed = (userId='') => {

    var that = this;
    
    that.setState({
      refresh: true,
      photoList: [],
    });
    
    var loadRef = database.ref('Users/' + that.state.uid + '/Photos');
    
    if(userId != ''){
      var loadRef = database.ref('Users/' + userId + '/Photos');
    }
    
    loadRef.orderByChild('timestamp').once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists) data = snapshot.val();
        var photoList = that.state.photoList;
        for(var photo in data) {
          that.addToList(photoList, data, photo);
      }
      console.log(data);
    }).catch(error => console.log(error));

  }
  
    //new update
  likePost = (authorId, photoId, likecount) =>{
    var that = this;
    var userid = f.auth().currentUser.uid;
    // check whether user is in like list
    database.ref('Likes/' + photoId).once('value', function(snapshot){
       if (snapshot.hasChild(userid)){
        //unlike
        
        //update likecount
        var updateCount = likecount -1;
        database.ref('Photos/' + photoId).child('likecount').set(updateCount);
        database.ref('Users/' + authorId + '/Photos/' + photoId).child('likecount').set(updateCount);
        
        // remove userId to like list
        database.ref('Likes/' + photoId).child(userid).remove();
      
      }else{
        var likestate = 'true';
        var updateCount = likecount +1;
        //update likecount
        database.ref('Photos/' + photoId).child('likecount').set(updateCount);
        database.ref('Users/' + authorId + '/Photos/' + photoId).child('likecount').set(updateCount);
        
        // add userId to like list
        database.ref('Likes/' + photoId).child(userid).child('likestate').set(likestate);
                                          
        // send notification
        if (authorId != userid){
          var timestamp = Math.floor(Date.now() / 1000);
          var NotifObj = {
            timestamp: timestamp,
            author: userid,
            type: 'like',
            postId: photoId
          };
          database.ref('Notification/' + authorId).push(NotifObj);
        }
        
      }
    });
  }
  
render(){
    return(
      <View style = {{flex: 1}}>

          <FlatList
            refreshing = {this.state.refresh}
            onRefresh = {this.loadNew}
            data = {this.state.photoList}
            keyExtractor = {(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <Card>
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

    )
  }

}

const styles = {
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },

  headerTextStule: {
    fontSize: 18,
    color: 'darkblue'
  },

  thumbnailStyle: {
    height: 50,
    width: 50
  },
  thumbnailcontarinerstyle: {
    justifyContent: 'left',
    marginLeft: '0',
    marginRigth: '0'
  },
  imageStyle: {
    height: 300,
    flex: 1,
    width: null
  },
  hashTag: {
    fontStyle: 'italic',
  },
};

/*
 * Removed from photo list
 * <CardSection>
<View styles={styles.thumbnailcontarinerstyle}>
  <Image source={{ uri: item.postUrl }} style={styles.thumbnailStyle} />
</View>
<View styles={styles.headerContentStyle}>
<TouchableOpacity onPress = { () => this.props.navigation.navigate('User', {userId: item.authorId})}>
  <Text style={styles.headerTextStule} >@{item.author}</Text>
</TouchableOpacity>
<Text>uploaded: {item.timestamp} ago</Text>
</View>
</CardSection>*/
export default PhotoList;
