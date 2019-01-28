import firebase from 'firebase';

//api details
//https://firebase.google.com/docs/web/setup

const config = {
    apiKey: "AIzaSyCwpbkRVaHXyl2A7-HSSf1NyAE1oZa7hVs",
    authDomain: "ecs165a-1439a.firebaseapp.com",
    databaseURL: "https://ecs165a-1439a.firebaseio.com",
    projectId: "ecs165a-1439a",
    storageBucket: "ecs165a-1439a.appspot.com",
    messagingSenderId: "681484415221"
};

firebase.initializeApp(config);

export const f = firebase;
export const db = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
