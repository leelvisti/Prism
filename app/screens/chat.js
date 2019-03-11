

import React from 'react';
import { TouchableOpacity, Flatlist, StyleSheet, Text, View, Image ,ImageBackground} from 'react-native';
import {f, auth, database, storage, Fire } from '../../config/config.js';
import Header from '../components/Header.js'
import Button from '../components/Button.js'
import Input from '../components/Input.js';
import { GiftedChat } from 'react-native-gifted-chat';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

const CHATKIT_TOKEN_PROVIDER_ENDPOINT = 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/88262378-4c28-4701-91ad-931f2ca07d4c/token';
const CHATKIT_INSTANCE_LOCATOR = 'v1:us1:88262378-4c28-4701-91ad-931f2ca07d4c';
const CHATKIT_ROOM_ID = '19515138';
const CHATKIT_USER_NAME = 'demo';


type Props = {
  name?: string,
};


class chat extends React.Component{
 state = {
    messages: [],
  };

  componentDidMount() {
    const tokenProvider = new TokenProvider({
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT,
    });

    const chatManager = new ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: CHATKIT_USER_NAME,
      tokenProvider: tokenProvider,
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.currentUser = currentUser;
        this.currentUser.subscribeToRoom({
          roomId: CHATKIT_ROOM_ID,
          hooks: {
            onMessage: this.onReceive,
          },
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onReceive = data => {
    const { id, senderId, text, createdAt } = data;
    const incomingMessage = {
      _id: id,
      text: text,
      createdAt: new Date(createdAt),
      user: {
        _id: senderId,
        name: senderId,
        avatar:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmXGGuS_PrRhQt73sGzdZvnkQrPXvtA-9cjcPxJLhLo8rW-sVA',
      },
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, incomingMessage),
    }));
  };
  
  onPress = () => {
    this.props.navigation.goBack();
  }

  onSend = (messages = []) => {
    messages.forEach(message => {
      this.currentUser
        .sendMessage({
          text: message.text,
          roomId: CHATKIT_ROOM_ID,
        })
        .then(() => {})
        .catch(err => {
          console.log(err);
        });
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{
          backgroundColor: 'white',
          height: 80,
          paddingTop: 25,
          shadowColor: 'black',
          shadowOffset: {width: 2, height: 6},
          shadowOpacity: 0.5,
        }}>
          <View style={{positon: 'absolute', left: 20, top: 25}}>
            <TouchableOpacity onPress={this.onPress}>
              <Text style={{color: '#b08ac3', fontSize: 20}}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={{
            alignItems: 'center',
            justififyContent: 'center',
           }}>
            <TouchableOpacity onPress={this.onPress}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#4b9faa',
              fontFamily: 'Arial',
            }}>{'@' + CHATKIT_USER_NAME}</Text>
            </TouchableOpacity>
          </View>
        </View>
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: CHATKIT_USER_NAME
        }}
      />
      </View>
    );
  }
}
export default chat;


/*
import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import {f, auth, database, storage, firebaseSvc } from '../../config/config.js';

type Props = {
  name?: string,
  email?: string,
  avatar?: string,
};

class chat extends React.Component<Props> {

  constructor(props) {
    super(props);
  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });

  state = {
    messages: [],
  };

  get user() {
    return {
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      avatar: this.props.navigation.state.params.avatar,
      id: f.auth().currentUser.uid;
      _id: f.auth().currentUser.uid, // need for gifted-chat
    };
  }

  send = (messages) => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this.ref.push(message);
    }
  };

  refOn = callback => {
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }


  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.send(this.state.messages)}
        user={this.user}
      />
    );
  }

  componentDidMount() {
    firebaseSvc.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  componentWillUnmount() {
    firebaseSvc.refOff();
  }
}

export default chat;

*/
