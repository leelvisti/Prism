import React from 'react';
import { Text, View, Image } from 'react-native';
import Card from './Card';
import CardSection from './CardSection';
import Button from './Button';

// only howing data so no need for states so just not a class

const AlbumDetail = (props) => {
  return (
    <Card>

      <CardSection>
      <View styles={styles.thumbnailcontarinerstyle}>
        <Image source={{ uri: props.album.thumbnail_image }} style={styles.thumbnailStyle} />
      </View>
      <View styles={styles.headerContentStyle}>

        <Text style={styles.headerTextStule} >{props.album.title}</Text>
        <Text style={styles.headerTextStule} >{props.album.artist}</Text>

      </View>
      </CardSection>
      <CardSection>
        <Image style={styles.imageStyle} source={{ uri: props.album.image }} />
      </CardSection>

      <CardSection>
        <Button textoo={'like me'} onPress={() => console.log(props.album.title)} />
      </CardSection>

      <CardSection>
        <Button textoo={'coment?'} onPress={() => console.log(props.album.title)} />
      </CardSection>

    </Card>
  );
};

const styles = {
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },

  headerTextStule: {
    fontSize: 18,
    color: 'red'
  },

  thumbnailStyle: {
    height: 50,
    width: 50
  },
  thumbnailcontarinerstyle: {
    justifyContent: 'center',
    marginLeft: '0',
    marginRigth: '0'
  },
  imageStyle: {
    height: 300,
    flex: 1,
    width: null
  }
};
export default AlbumDetail;
