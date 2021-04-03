import firebase from "firebase/app";
import { useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { auth, firestore, messagesRef } from "../App.jsx";
import ChatMessage from "../components/ChatMessage";
import Loading from "../components/Loading";
import styles from "../styles/pages/ChatRoom.module.css";

export default function ChatRoom() {
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      const dataRef = await firestore.collection("rooms").doc(roomId).get();

      const data = dataRef.data();

      if (data) {
        setRoomName(data.name);
      } else {
        history.push("/");
      }
    }
    fetchData();
  }, [roomId, history]);

  const dummy = useRef();

  const query = messagesRef.orderBy("createdAt");

  const [messages] = useCollectionData(query, { idField: "id" });
  const messageFromRoom = messages?.filter((x) => x.roomId === roomId);

  const [formValue, setFormValue] = useState("");

  function inputValidation(e) {
    if (formValue.length === 0) {
      e.preventDefault();
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL, displayName } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      roomId,
      uid,
      photoURL,
      displayName,
    });

    setFormValue("");

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  if (!roomName) {
    return <Loading />;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBackgroundImage}>
        <header>
          <Link to="/" className={styles.arrowBack}>
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
          <h1>eco chat - {roomName}</h1>
        </header>

        <section>
          <main>
            <div>
              {messageFromRoom &&
                messageFromRoom.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
            </div>

            <div ref={dummy}></div>
          </main>

          <form onSubmit={sendMessage}>
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
            />
            <button type="submit" onClick={inputValidation} required>
              Enviar
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
