import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image,ImageBackground } from 'react-native';
import {f, auth, database, storage } from '../../config/config.js';
import Header from '../components/Header.js'
import Input from '../components/Input.js';
import Button from '../components/Button.js';

class following extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedin: false,
      refresh: false,
      followingList: [],
    }
  }

  checkParams = () => {
    var params = this.props.navigation.state.params;
    if (params){
      if (params.userId){
        this.setState({
          userId: params.userId
        });
        this.loadNew();
        
      }
    }
  }
  
  componentDidMount = () =>{
    var that = this;

    f.auth().onAuthStateChanged(function(user){
      if(user){
        //logged in
        that.setState({
          loggedin: true

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

  loadNew = () => {
    this.loadFeed();
  }
  
  addToList = (followingList, data, f) =>{
    var that = this;
    var followerObj = data[f];
    database.ref('Users').child(f).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists){
        data = snapshot.val();
        followingList.push({
          Id: f,
          userName: data.userName,
          profilePic: data.profilePic,
        });
      }
      that.setState({
        followingList: followingList,
      });
    }).catch(error => console.log(error));
  }
  loadFeed = () => {
    this.setState({
      refresh: true,
      followingList: []
    });

    var that = this;
  database.ref('Users').child(that.state.userId).child('Following').once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists){
        data = snapshot.val();
        var followingList = that.state.followingList;
        for(var f in data) {
          that.addToList(followingList, data, f);

          that.setState({
            refresh: false,
          });
        }
      }
    }).catch(error => console.log(error));
  }
  
  ListEmpty = () => {
    return (
            //View to show when list is empty
            <View>
            <Text style={{ textAlign: 'center' }}>No Data Found</Text>
            </View>
            );
  };
  
  
  render(){
    return(

      <View style = {{flex: 1}}>
      <ImageBackground source={require('../images/gradient.jpeg')} style={{width: '100%', height: '100%'}} >
      <Header texto='Following' />

        <View style={{height:20 }}>
        </View>

          <View>

            <FlatList
            contentContainerStyle={{margin:4}}
            horizontal={false}
            numColumns={3}

              refreshing = {this.state.refresh}
              onRefresh = {this.loadNew}
              data = {this.state.followingList}
              keyExtractor = {(item, index) => index.toString()}
              renderItem={({item, index}) => (
              <View key={index}>
                <View>
                  <TouchableOpacity onPress = { () => this.props.navigation.navigate('User', {userId: item.Id})}>
                  <Text>{item.userName}</Text>

                  <Image source = {{ uri: item.profilePic}} style={{width:100, height:100, borderRadius:50, margin: 10}}/>


                  </TouchableOpacity>

                </View>
              </View>
              )}
              removeClippedSubviews={false}
              ListEmptyComponent={this.ListEmpty}
            />
          </View>
           <View>
           <Button textoo='  Back ' onPress={()=> this.props.navigation.goBack()}/>
           </View>
           </ImageBackground>

      </View>

    )
  }
}

export default following;
