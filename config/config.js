import firebase from 'firebase';

//api details
//https://firebase.google.com/docs/web/setup

const config = {
    apiKey: "AIzaSyBwP-0JH5KoO6MYY29Oyh8z_GYCckh5emc",
    authDomain: "newprism-a8e35.firebaseapp.com",
    databaseURL: "https://newprism-a8e35.firebaseio.com",
    projectId: "newprism-a8e35",
    storageBucket: "newprism-a8e35.appspot.com",
    messagingSenderId: "659901126874"
};

firebase.initializeApp(config);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();


