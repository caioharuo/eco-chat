import { auth } from "../database/firebase";

import React from "react";

import styles from "../styles/components/ChatMessage.module.css";

export default function ChatMessage(props) {
  const { text, uid, photoURL, displayName, createdAt } = props.message;
  if (!createdAt) return <></>;

  const isSentUser = uid === auth.currentUser.uid;

  const minutes = createdAt.toDate().getMinutes().toString().padStart(2, "0");
  const hours = createdAt.toDate().getHours().toString().padStart(2, "0");
  const timeFormatated = `${hours}:${minutes}`;

  const messageClass = isSentUser
    ? styles.chatMessage__messageSent
    : styles.chatMessage__messageReceived;

  return (
    <div className={`${styles.chatMessage} ${messageClass}`}>
      <img src={photoURL} alt="" className={styles.chatMessage__userPhoto} />
      <div className={styles.chatMessage__messageContainer}>
        {!isSentUser && (
          <span className={styles.chatMessage__userName}>{displayName}</span>
        )}
        <p className={styles.chatMessage__message}>{text}</p>
        <span className={styles.chatMessage__currentTime}>
          {timeFormatated}
        </span>
      </div>
    </div>
  );
}
