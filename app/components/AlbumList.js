
import React, { Component } from 'react';
import { Text, ScrollView,FlatList } from 'react-native';
import axios from 'axios';
import AlbumDetail from './AlbumDetail';

class AlbumList extends Component {
  state ={ albums: [] }; // initail state// this.state is emoty object

  componentWillMount() {
    //console.log('hoolaaa');//to test if it working
      axios.get('https://rallycoding.herokuapp.com/api/music_albums')//get the info
  //.then(response => console.log(response));
  //caled one the request is complete an show in chrome(log)
          .then(response => this.setState({ albums: response.data }));
  }


  render(){
      return(
        <FlatList
            data={this.state.albums}
            renderItem={(info) => {
              return (
              <AlbumDetail album={info.item} />
            )
            }}
            keyExtractor={(album) => album.title}
          />
   );
  }

}

export default AlbumList;
