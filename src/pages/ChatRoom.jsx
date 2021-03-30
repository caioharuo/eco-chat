import firebase from "firebase/app";

import { useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useHistory, useParams } from "react-router";
import { Spinner, Container, Row, Col, Jumbotron } from "react-bootstrap";

import { auth, firestore } from "../App.jsx";
import ChatMessage from "../components/ChatMessage";

import styles from "../styles/pages/ChatRoom.module.css";
import { Link } from "react-router-dom";

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

  const messagesRef = firestore.collection("messages");

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
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      roomId,
      uid,
      photoURL,
    });

    setFormValue("");

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  if (!roomName) {
    return (
      <Jumbotron className={styles.maxHeigth}>
        <Container fluid>
          <Row className="justify-content-md-center">
            <Col xs lg="6">
              <span>Carregando...</span>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    );
  }

  return (
    <div className={styles.ChatBackground}>
      <div className={styles.Chat}>
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
            <div className={styles.chatContainer}>
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
