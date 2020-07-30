import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

firebase.initializeApp({
  apiKey: "AIzaSyB83iL8yDS8OkPnKv8t9z3dOWuo5XuCUS0",
  authDomain: "dsuview.firebaseapp.com",
  databaseURL: "https://dsuview.firebaseio.com",
  projectId: "dsuview",
  storageBucket: "",
  messagingSenderId: "947813853337",
  appId: "1:947813853337:web:e148d807a2bf092b",
});

export default firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();
