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

class comment extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedin: false,
      commentList: []
    }
  }
  
  checkParams = () => {
    var params = this.props.navigation.state.params;
    if (params){
      if (params.photoId){
        this.setState({
          photoId: params.photoId
        });
          this.fetchComment(params.photoId);
        
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
  addToList = (commentList, data, comment) =>{
    var that = this;
    var commentObj = data[comment];
    database.ref('Users').child(commentObj.author).once('value').then(function(snapshot){
        const exists = (snapshot.val() !== null);
        if (exists) data = snapshot.val();
          commentList.push({
            id: comment,
            comment: commentObj.comment,
            timestamp: that.convertTime(commentObj.timestamp),
            timestamp2: commentObj.timestamp,
            author: data.userName,
            authorId: commentObj.author,
            profilePic: data.profilePic,
          });
          var sortData = [].concat(commentList);
          sortData.sort(function(a, b){
            return a.timestamp2 > b.timestamp2;
          });
          that.setState({
            refresh: false,
            commentList:sortData
          });
                                                                                                          
      }).catch(error => console.log(error));
  }
  
  fetchComment = (photoId) => {
    var that = this;
    database.ref('Comments').child(photoId).orderByChild('timestamp').once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists){
          // add comment
        data = snapshot.val()
        var commentList = that.state.commentList;
        for(var comment in data){
          that.addToList(commentList, data, comment);
        }
      }else{
          // no comment
        that.setState({
          commentList: []
        });
      }
    }).catch(error => console.log(error));
  }
  
  randomString = () =>{
    return Math.floor((1+ Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }
  
  createId = () => {
    return this.randomString() + this.randomString() + '-' + this.randomString() + '-' + this.randomString() + '-' + this.randomString() + '-' + this.randomString() + '-' + this.randomString() + '-' + this.randomString();
  }
  
  postComment = () =>{
    var comment = this.state.comment;
    if (comment != ''){
      var photoId = this.state.photoId;
      var currentId = f.auth().currentUser.uid;
      var commentId = this.createId();
      var timestamp = Math.floor(Date.now() / 1000);
      
      this.setState({
        comment: '',
      });
      
      var commentObj = {
        timestamp: timestamp,
        author: currentId,
        comment: comment,
      };
      
      database.ref('Comments/'+photoId+'/'+commentId+'/').set(commentObj);
      
      // send notification
    database.ref('Photos').child(photoId).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
        if (exists){
          data = snapshot.val();
          if (data.author != currentId){
            var NotifObj = {
              timestamp: timestamp,
              author: currentId,
              type: 'comment',
              postId: photoId,
              commentId: commentId
            };
            database.ref('Notification/' + data.author).push(NotifObj);
          }
          
        }
      });
      this.reloadComment();
    }else{
      alert('Please enter your comment');
    }
  }
  
  reloadComment = () =>{
    this.setState({
      commentList: [],
    });
    this.fetchComment(this.state.photoId);
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
    
    this.checkParams();
  }

  render(){
  return(
    <View style = {{flex:1}}>
    <ImageBackground source={require('../images/gradient.jpeg')} style={{width: '100%', height: '100%'}} >

    <Header texto='Comments' />
    {this.state.commentList.length == 0 ?(
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{fontSize: 24, color: 'white'}}>No Comments</Text>
      </View>
    ):(
         <FlatList
          refreshing = {this.state.refresh}
          data = {this.state.commentList}
          keyExtractor = {(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View style={styles.container}>
              <Image source={{ uri: item.profilePic }} style={styles.thumbnailStyle} />
              <View style={styles.contentContainer}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress = { () => this.props.navigation.navigate('User', {userId: item.authorId})}>
                    <Text style={{color: '#48384f', fontSize: 16}}>@{item.author}</Text>
                  </TouchableOpacity>
                  <Text style={{color: '#828282', fontSize: 12, marginLeft: 7}}>{item.timestamp} ago</Text>
                </View>
                <Text style={{fontSize: 16}}>{item.comment}</Text>
              </View>
                                          
              <View>
              </View>
            </View>
          )}
         />
    )}
    <Input type='file' onChange={this.fileselectedhandler}/>
    
    
    <KeyboardAvoidingView behavior='padding'>
         <View>
           <TextInput
            placeholderTextColor={'white'}
            editable = {true}
            placeholder = {'  Add comment here...'}
            onChangeText = {(text) => this.setState({comment:text})}
            style = {{borderWidth: 1, borderColor: 'white', borderRadius: 25, marginVertical:10, marginHorizontal: 7.5, height:50, padding:5, backgroundColor: '#928299', color:'white'}}
           />
           <View>
           <Button textoo='Post Comment' onPress={()=> this.postComment()}/>
           </View>
         
         </View>
    </KeyboardAvoidingView>
         
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
export default comment;
