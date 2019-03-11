import React from 'react';
import { StyleSheet, Text, View,ImageBackground } from 'react-native';
import {createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import {f, auth, database, storage } from './config/config.js';

import feed from './app/screens/feed.js';
import upload from './app/screens/upload.js';
import profile from './app/screens/profile.js';
import dm from './app/screens/dm.js';
import chat from './app/screens/chat.js';
import hashtag from './app/screens/hashtag.js';
import userProfile from './app/screens/userProfile.js';
import comment from './app/screens/comment.js';
import post from './app/screens/post.js';
import notification from './app/screens/notification.js';
import search from './app/screens/search.js';
import following from './app/screens/following.js';
import follower from './app/screens/follower.js';

import {Header} from './app/components/Header.js';
import {Button} from './app/components/Button.js';
import {Input} from './app/components/Input.js';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

const TabStack = createAppContainer(createBottomTabNavigator(
{
  Profile: {
    screen: profile,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => {
        return <FontAwesome name="user-circle" color={tintColor} size={27}/>
      },
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: '#4b9faa',
        style: {
          backgroundColor: 'white',
        },
      }
    }
  },
  Feed: {
    screen: feed,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => {
        return <FontAwesome name="feed" color={tintColor} size={27}/>
      },
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: '#4b9faa',
        style: {
          backgroundColor: 'white',
        },
      }
    }
  },
  Upload: {
    screen: upload,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => {
        return <FontAwesome name="camera" color={tintColor} size={27}/>
      },
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: '#4b9faa',
        style: {
          backgroundColor: 'white',
        },
      }
    }
  },
  Message: {
    screen: chat,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => {
        return <AntDesign name="message1" color={tintColor} size={27}/>
      },
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: '#4b9faa',
        style: {
          backgroundColor: 'white',
        },
      }
    }
  },
  Notification: {
    screen: notification,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => {
        return <FontAwesome name="bell" color={tintColor} size={27}/>
      },
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: '#4b9faa',
        style: {
          backgroundColor: 'white',
        },
      }
    }
  }
}));


const MainStack = createAppContainer(createStackNavigator(
{
    Home: {screen: TabStack},
    User: {screen: userProfile},
    Follower: {screen: follower},
    Following: {screen: following},
    Comment: {screen: comment},
    Hashtag: {screen: hashtag},
    Search: {screen: search},
    Notification: {screen: notification},
    Post: {screen: post},
},
{
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: 'none'
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default class App extends React.Component {

  constructor(props){
    super(props);
    //console.disableYellowBox = true;
  }
  
  render(){
    return(

        <MainStack />

    );
  }
}
