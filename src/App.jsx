import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import "./App.css";
import ChatRoom from "./components/ChatRoom";
import SignIn from "./components/SingIn";
import SignOut from "./components/SignOut";

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

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>eco chat</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

export default App;
