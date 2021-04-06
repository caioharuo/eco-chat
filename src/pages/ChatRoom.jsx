import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";

import ChatMessage from "../components/ChatMessage";
import Loading from "../components/Loading";

import messageRepository from "../database/repositories/MessageRepository";
import roomRepository from "../database/repositories/RoomRepository";

import styles from "../styles/pages/ChatRoom.module.css";

//Hook de Mensagens
import { useCollectionData } from "react-firebase-hooks/firestore";

import { messagesRef } from "../database/firebase";

export default function ChatRoom() {
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [formValue, setFormValue] = useState("");

  const history = useHistory();
  const dummy = useRef();

  useEffect(() => {
    roomRepository.getById(roomId).then((room) => {
      if (room) setRoomName(room.name);
      else history.push("/");
    });
  }, [roomId, history]);

  //Hook de Mensagens
  const query = messagesRef.orderBy("createdAt");
  const [messages] = useCollectionData(query, { idField: "id" });
  const messageFromRoom = messages?.filter((x) => x.roomId === roomId);

  const sendMessage = async (e) => {
    e.preventDefault();

    const message = { roomId, text: formValue };
    await messageRepository.sendMessage(message);

    setFormValue("");

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  if (!roomName) {
    return <Loading />;
  }

  return (
    <div className={styles.chatRoom}>
      <div className={styles.chatRoom__background}>
        <header className={styles.chatRoom__header}>
          <Link to="/" className={styles.chatRoom__backToHome}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              width="30px"
              height="30px"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </Link>
          <h1 className={styles.chatRoom__title}>eco chat - {roomName}</h1>
        </header>

        <section className={styles.chatRoom__messagesContainer}>
          <main className={styles.chatRoom__mainSection}>
            <div>
              {messageFromRoom &&
                messageFromRoom.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
            </div>

            <div ref={dummy}></div>
          </main>

          <form onSubmit={sendMessage} className={styles.chatRoom__form}>
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              className={styles.chatRoom__input}
            />
            <button
              type="submit"
              required
              className={styles.chatRoom__submitMessage}
            >
              Enviar
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
