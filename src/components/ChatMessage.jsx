import { auth } from "../App.jsx";

import React from "react";

import styles from "../styles/components/ChatMessage.module.css";

export default function ChatMessage(props) {
  const { text, uid, photoURL, displayName, createdAt } = props.message;
  if (!createdAt) return <></>;

  const isSentUser = uid === auth.currentUser.uid;

  const minutes = createdAt.toDate().getMinutes().toString().padStart(2, "0");
  const hours = createdAt.toDate().getHours().toString().padStart(2, "0");
  const timeFormatated = `${hours}:${minutes}`;

  const messageClass = isSentUser ? styles.sent : styles.received;

  return (
    <div className={`${styles.message} ${messageClass}`}>
      <img src={photoURL} alt="" />
      <div className={styles.messageContainer}>
        {!isSentUser && <span className={styles.userName}>{displayName}</span>}
        <p>{text}</p>
        <span className={styles.currentTime}>{timeFormatated}</span>
      </div>
    </div>
  );
}
