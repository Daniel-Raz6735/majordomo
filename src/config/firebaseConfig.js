import  firebase from 'firebase/app'
import 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBZN7e1k3080ug33Mozfe6kowulXLH0ADw",
    authDomain: "majordomo-me.firebaseapp.com",
    databaseURL: "https://majordomo-me-default-rtdb.firebaseio.com",
    projectId: "majordomo-me",
    storageBucket: "majordomo-me.appspot.com",
    messagingSenderId: "213314761996",
    appId: "1:213314761996:web:e9c6d9737bf213952c0529",
    measurementId: "G-1X8TL73123"
  };

  firebase.initializeApp(firebaseConfig);
  export const auth = firebase.auth();

  // export default{firebase}
