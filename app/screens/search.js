import React from 'react';
import { SearchBar } from 'react-native-elements'
import { ScrollView, TouchableOpacity,ActivityIndicator,ListView, FlatList, StyleSheet, Text, View, Image,ImageBackground } from 'react-native';
import {f, auth, database, storage } from '../../config/config.js';
import Header from '../components/Header.js'
import Button from '../components/Button.js'
import Input from '../components/Input.js';
import {FontAwesome} from '@expo/vector-icons';

class search extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedin: false,
      search: '',
      isLoading: true,
      UserList: [],
    }
  }

  componentDidMount = () =>{
    var that = this;

    f.auth().onAuthStateChanged(function(user){
      if(user){
        //logged in
        that.setState({
          loggedin: true,
          isLoading: false,
        });
      }else{
        //not logged in
        that.setState({
          loggedin: false
        });
      }
    });
  }
  
  firstSearch() {
    this.state.UserList = [];
    this.searchDirectory();
  }
  
  
  addToList = (UserList, data, u) =>{
    var that = this;
    var searchText = that.state.search.toString();
    var userObj = data[u];
    database.ref('Users/').child(u).on('value', function(snapshot){
      const exists = (snapshot.val() !== null);
      if (exists) data = snapshot.val();
          console.log(u);
          console.log(data.userName);
          UserList.push({
            id: u,
            userName:data.userName,
            profilePic: data.profilePic,
          });
    });
    
  };
  
  searchDirectory() {
    var that = this;
    var searchText = that.state.search.toString();
    database.ref('Users/').orderByChild('userName').startAt(searchText).endAt(searchText+ '\uf8ff').once('value').then(function(snapshot){
        const exists = (snapshot.val() !== null);
        if (exists) data = snapshot.val();
          var UserList = that.state.UserList;
          for(var u in data) {
            that.addToList(UserList, data, u);
          }
          that.setState({
            UserList: UserList,
            search: '',
          })
                                                                                                                       
      }).catch(error => console.log(error));

  }
  
  ListViewItemSeparator = () => {
    //Item sparator view
    return (
      <View
        style={{
          height: 0.3,
          width: '90%',
          backgroundColor: '#080808',
        }}
      />
    );
  };
  
  render(){
    
    if (this.state.isLoading) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    
    return(
      <ImageBackground source={require('../images/gradient.jpeg')} style={{width: '100%', height: '100%'}} >
      <View style={styles.viewStyle}>
        <SearchBar
        //returnKeyType='search'
        lightTheme
        round
        placeholder='Type Here...'
        onChangeText={(text) => this.setState({search:text})}
        value = {this.state.search}
        onSubmitEditing={() => this.firstSearch()}
      />
        <FlatList
          data={this.state.UserList}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          renderItem={({ item }) => (
            <TouchableOpacity onPress = { () => this.props.navigation.navigate('User', {userId: item.id})}>
            <Image source={{ uri: item.profilePic }} style={styles.thumbnailStyle} />
            <Text style={styles.textStyle}>{item.userName}</Text>
            </TouchableOpacity>
          )}
          enableEmptySections={true}
          style={{ marginTop: 10 }}
          keyExtractor = {(item, index) => index.toString()}
        />
           
        <View>
        <Button textoo='  Back ' onPress={()=> this.props.navigation.goBack()}/>
        </View>
      </View>
      </ImageBackground>
    );
  }
  
  /*
  render(){
  return(
    <View style = {{flex:1}}>
    <ImageBackground source={require('../images/EmptyBackgroundImage.png')} style={{width: '100%', height: '100%'}} >

    <Header texto='Search' />
    <Input type='file' onChange={this.fileselectedhandler}/>
    <SearchBar
        //returnKeyType='search'
        lightTheme
        placeholder='Type Here...'
        onChangeText={(text) => this.setState({search:text})}
        value = {this.state.search}
        onSubmitEditing={() => this.firstSearch()}
      />
        
      <FlatList
         //onRefresh = {this.firstSearch()}
         data = {this.state.UserList}
         enableEmptySections={true}
         keyExtractor = {(item, index) => index.toString()}
         renderItem={({item, index}) => (
           <TouchableOpacity onPress = { () => this.props.navigation.navigate('User', {userId: item.id})}>
            <Text>@{item.userName}</Text>
           </TouchableOpacity>
         )}
      />
         
    <View>
    <Button textoo='  Back ' onPress={()=> this.props.navigation.goBack()}/>
    </View>
         
    <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>

    <Button textoo='Search User'/>

    </View>
    </ImageBackground>
    </View>

  )
}*/
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
});

export default search;

