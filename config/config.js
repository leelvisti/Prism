import firebase from 'firebase';

//api details
//https://firebase.google.com/docs/web/setup

const config = {
    apiKey: "AIzaSyAREummRY6snV2Vojk5zudZeeeT-YiCamE",
    authDomain: "myprism-8f3e3.firebaseapp.com",
    databaseURL: "https://myprism-8f3e3.firebaseio.com",
    projectId: "myprism-8f3e3",
    storageBucket: "myprism-8f3e3.appspot.com",
    messagingSenderId: "318156582378"
};

firebase.initializeApp(config);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();


