import { auth } from "../App.jsx";

import React from "react";

import styles from "../styles/components/ChatMessage.module.css";

export default function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass =
    uid === auth.currentUser.uid ? styles.sent : styles.received;

  return (
    <div className={`${styles.message} ${messageClass}`}>
      <img src={photoURL} alt="" />
      <p>{text}</p>
    </div>
  );
}
