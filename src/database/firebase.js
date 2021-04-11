import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyBQQda1RD_eRWqTwJB75O-dyMSxoP1WkWw",
  authDomain: "eco-chat-cda48.firebaseapp.com",
  projectId: "eco-chat-cda48",
  storageBucket: "eco-chat-cda48.appspot.com",
  messagingSenderId: "1068479603188",
  appId: "1:1068479603188:web:e80bceab327400531959a1",
});

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const messagesRef = firestore.collection("messages");
export const roomsRef = firestore.collection("rooms");
