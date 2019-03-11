import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image,ImageBackground } from 'react-native';
import {f, auth, database, storage } from '../../config/config.js';
import Header from '../components/Header.js'
import Input from '../components/Input.js';
import Button from '../components/Button.js';

class follower extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      refresh: false,
      followerList: []
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
  addToList = (followerList, data, f) =>{
    var that = this;
    var followerObj = data[f];
    database.ref('Users').child(f).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists){
        data = snapshot.val();
        followerList.push({
          Id: f,
          userName: data.userName,
          profilePic: data.profilePic,
        });
      }
      that.setState({
        followerList: followerList,
      });
    }).catch(error => console.log(error));
  }
  loadFeed = () => {
    this.setState({
      refresh: true,
      followerList: []
    });

    var that = this;
  database.ref('Users').child(that.state.userId).child('Follower').once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists){
        data = snapshot.val();
        var followerList = that.state.followerList;
        for(var f in data) {
          that.addToList(followerList, data, f);

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
      <Header texto='Followers' />

        <View style={{height:20 }}>
        </View>

          <View>

            <FlatList
            contentContainerStyle={{margin:4}}
            horizontal={false}
            numColumns={3}

              refreshing = {this.state.refresh}
              onRefresh = {this.loadNew}
              data = {this.state.followerList}
              keyExtractor = {(item, index) => index.toString()}
              renderItem={({item, index}) => (
              <View key={index}>
                <View>
                  <TouchableOpacity onPress = { () => this.props.navigation.navigate('User', {userId: item.Id})}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: 'white'}}>{item.userName}</Text>

                  <Image source = {{ uri: item.profilePic}} style={{width:100, height:100, borderRadius:50, margin: 10}}/>

                  </View>
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


export default follower;
