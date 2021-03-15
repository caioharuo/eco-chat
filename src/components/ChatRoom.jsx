import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import React, { useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { auth, firestore } from "../App.jsx";
import ChatMessage from "./ChatMessage.jsx";

export default function ChatRoom() {
  const dummy = useRef();

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt");

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  function inputValidation(e) {
    if (formValue.length === 0) {
      e.preventDefault();
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        <div className="container">
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        </div>

        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit" onClick={inputValidation} requeried>
          Enviar
        </button>
      </form>
    </>
  );
}
