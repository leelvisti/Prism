import React from 'react';
import {TextInput, ActivityIndicator,Flatlist, StyleSheet, Text, View, Image,ImageBackground } from 'react-native';
import {Permissions, ImagePicker} from 'expo';
import {f, auth, database, storage } from '../../config/config.js';
import Header from '../components/Header.js'
import Button from '../components/Button.js'
import Input from '../components/Input.js';

class upload extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedin: false,
      photoId: this.createId(),
      selected: false,
      uploading: false,
      caption: '',
      progress: 0,
      
    }
  }
  
  _checkPermissions = async() => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({camera:status});
    
    const {statusRoll} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({cameraRoll:statusRoll});
  }
  
  randomString = () =>{
    return Math.floor((1+ Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }
  
  createId = () => {
    return this.randomString() + this.randomString() + '-' + this.randomString() + '-' + this.randomString() + '-' + this.randomString() + '-' + this.randomString() + '-' + this.randomString() + '-' + this.randomString();
  }
  
  selectImage = async() => {
    await this._checkPermissions();
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      quality: 1
    });
    
    if(!result.cancelled){
      console.log('upload photo')
      this.setState({
        selected: true,
        photoId: this.createId(),
        uri: result.uri
      })
      //this.uploadImage(result.uri);
    }else{
      console.log('select cancel')
      this.setState({
        selected: false,
      })
    }
  }
  
  takeImage = async() => {
    await this._checkPermissions();
    
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1
    });
    
    if(!result.cancelled){
      console.log('take photo')
      this.setState({
        selected: true,
        photoId: this.createId(),
        uri: result.uri
      })
      //this.uploadImage(result.uri);
    }else{
      console.log('take photo cancel')
      this.setState({
        selected: false,
      })
    }
  }
  
  uploadImage = async(uri) => {
    
    var that = this;
    var userid = f.auth().currentUser.uid;
    var photoId = this.state.photoId;
    
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];
    this.setState({
      currentFileType: ext,
      uploading: true
    });
    
    var FilePath = photoId + "." + that.state.currentFileType;
    
    const oReq = new XMLHttpRequest();
    oReq.open("GET", uri, true);
    oReq.responseType = "blob";
    oReq.onload = () => {
      const blob = oReq.response;
      
      var uploadTask = storage.ref("User/" + userid + "/img").child(FilePath).put(blob);
      uploadTask.on("state_changed", function(snapshot) {
        var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) *100).toFixed(0);
        console.log("Upload is " + progress + "% complete");
        that.setState({
          progress: progress
        });
      }, function(error) {
        console.log("error with upload - " + error);
      }, function() {
        //complete
        that.setState({ progress: 100 });
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log(downloadURL);
          that.storeIntoDB(downloadURL);
        });
      });
    };
    oReq.send();
  };
  
  uploadImageAsProf = async(uri) => {
    
    var that = this;
    var userid = f.auth().currentUser.uid;
    var photoId = this.state.photoId;
    
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];
    this.setState({
      currentFileType: ext,
      uploading: true
    });
    
    var FilePath = photoId + "." + that.state.currentFileType;
    
    const oReq = new XMLHttpRequest();
    oReq.open("GET", uri, true);
    oReq.responseType = "blob";
    oReq.onload = () => {
      const blob = oReq.response;
      
      var uploadTask = storage.ref("User/" + userid + "/profile").child(FilePath).put(blob);
      uploadTask.on("state_changed", function(snapshot) {
        var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) *100).toFixed(0);
        console.log("Upload is " + progress + "% complete");
        that.setState({
          progress: progress
        });
      }, function(error) {
        console.log("error with upload - " + error);
      }, function() {
        //complete
        that.setState({ progress: 100 });
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log(downloadURL);
          that.storeIntoProfDB(downloadURL);
        });
      });
    };
    oReq.send();
  };
  
  publishing = () =>{
    if (this.state.uploading == false){
      if (this.state.caption != ''){
        this.uploadImage(this.state.uri);
      }else{
        alert('Please enter a caption for your post!')
      }
    }
  };
  
  changeProfile = () =>{
    if (this.state.uploading == false){
      this.uploadImageAsProf(this.state.uri);
    }
  };
  
  storeIntoProfDB = (photoUrl) => {
    var userId = f.auth().currentUser.uid;
    //Update database
    database.ref("/Users/" + userId).child('profilePic').set(photoUrl);
 
    alert("Profile Picture Uploaded Successfully!");
 
    this.setState({
      uploading: false,
      selected: false,
      caption: '',
      uri: '',
    });
  };
  
  storeIntoDB = (photoUrl) => {

    var photoId = this.state.photoId;
    var userId = f.auth().currentUser.uid;
    var caption = this.state.caption;
    //var dateTime = Date.now();
    var timestamp = Math.floor(Date.now() / 1000);
 
    var photoObj = {
      author: userId,
      caption: caption,
      timestamp: timestamp,
      url: photoUrl,
      likecount: 0
    };
 
    //Update database
 
    //Add to main feed
    database.ref("/Photos/" + photoId).set(photoObj);
 
    //Set user photos object
    database.ref("/Users/" + userId + "/Photos/" + photoId).set(photoObj);
    
    //store hashtags
    
    
    var hashObj = {
      photoID: photoId,
      timestamp: timestamp,
    }
    
    // find all hashtags
    var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    var hashtags = [];
    var match;
    while ((match = regex.exec(caption))) {
      hashtags.push(match[1]);
    }
    console.log(hashtags);
    for (var i=0; i < hashtags.length; i++){
      var tag = hashtags[i];
      database.ref('Hashtags/'+tag).push(hashObj);
    }

 
    alert("Post Uploaded Successfully!");
 
    this.setState({
      uploading: false,
      selected: false,
      caption: '',
      uri: '',
    });
  };
  
  cancel = () => {
    this.props.navigation.goBack();
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
  }
  
  render(){
    return(
      <View style = {{flex: 1}}>
      <ImageBackground source={require('../images/gradient.jpeg')} style={{width: '100%', height: '100%'}} >
      <Header texto='Upload' />

        { this.state.loggedin == true ?(
          
            <View style = {{flex:1}}>
            { this.state.selected == true ?(
              <View style = {{flex:1}}>
                <View style = {{padding:5}}>
                <Image
                  source = {{uri: this.state.uri}}
                  style = {{marginTop: 10, resizeMode: 'cover', width:'100%', height:275}}
                />
                <Text style ={{marginTop:5, fontSize: 16}}>Caption:</Text>
                <TextInput
                  editable = {true}
                  placeholder = {'enter caption ...\nadd hashtag #example #hashtag'}
                  maxLength = {200}
                  multiline = {true}
                  numberOfLines = {5}
                  onChangeText = {(text) => this.setState({caption: text})}
                  style = {{backgroundColor: 'white',marginVertical:10, height:100, padding: 5, borderWidth:1, borderColor: 'black', borderRadius:3}}
                />

                                            
                <Button textoo='Publish Post' onPress={()=> this.publishing()}/>
                <Button textoo='Update Profile Picture' onPress={()=> this.changeProfile()}/>
                <Button textoo='Cancel' onPress={()=> this.cancel()}/>
                { this.state.uploading == true ?(
                  <View>
                    <Text>upload... {this.state.progress}% done</Text>
                  </View>
                ):(
                  <View></View>
                )}
                                            
        
              </View>
              </View>
            ) : (
              <View style={{alignSelf: 'center', justifyContent: 'center', flex: 2}}>
              <Button textoo='Select Photo to Upload' onPress={()=> this.selectImage()}/>
              <Button textoo='Take Photo to Upload' onPress={()=> this.takeImage()}/>
              </View>
                 
            )}
            </View>
        ) : (
          <View style={styles.alertStyle}>
            <Text style={styles.textStyle}>You are not logged in</Text>
            <Text style={styles.textStyle}>Please login to view your feed</Text>
          </View>
      )}
      </ImageBackground>
      </View>
    );
  }
}

const styles = {
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
};

export default upload;
