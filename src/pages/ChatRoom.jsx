import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";

import ChatMessage from "../components/ChatMessage";
import Loading from "../components/Loading";

import messageRepository from "../database/repositories/MessageRepository";
import memberRepository from "../database/repositories/MemberRepository";
import roomRepository from "../database/repositories/RoomRepository";

import styles from "../styles/pages/ChatRoom.module.css";
import format from "date-format";

import logo from "../assets/images/logo.svg";

//Hook de Mensagens
import { useCollectionData } from "react-firebase-hooks/firestore";

import { auth, messagesRef, membersRef } from "../database/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const groupBy = (items, key) => {
  if (!items) return {};

  return items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {}
  );
};

export default function ChatRoom() {
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [description, setDescription] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [adminRoom, setAdminRoom] = useState("");

  const [user] = useAuthState(auth);

  const history = useHistory();
  const dummy = useRef(null);

  useEffect(() => {
    roomRepository.getById(roomId).then((room) => {
      if (room) {
        const formatedDate = format.asString(
          "dd/MM/yyyy",
          room.createdAt?.toDate()
        );

        if (user) memberRepository.enterInRoom(roomId, user);

        setRoomName(room.name);
        setCreatedAt(formatedDate);
        setDescription(room.description);
        setAdminRoom(room.admin);
      } else {
        history.push("/");
      }
    });
  }, [roomId, history, user]);

  //Hook de Mensagens
  const [messages, isLoading] = useCollectionData(
    messagesRef.orderBy("createdAt"),
    { idField: "id" }
  );

  //Hook de Membros
  const [members] = useCollectionData(membersRef.where("roomId", "==", roomId));

  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading || !roomName) {
    return <Loading />;
  }

  const messagesFromRoom = messages.filter((x) => x.roomId === roomId);

  const groupedMessages = groupBy(
    messagesFromRoom.map((m) => {
      return {
        ...m,
        createdDay: format.asString("dd/MM/yyyy", m.createdAt?.toDate()),
      };
    }),
    "createdDay"
  );

  async function handleChangeDescription(event) {
    const value = event.target.value;

    await roomRepository.updateRoom(roomId, value);
  }

  const sendMessage = async (e) => {
    e.preventDefault();

    if (messageInput.trim().length === 0) return;

    const message = { roomId, text: messageInput };
    await messageRepository.sendMessage(message);

    setMessageInput("");
  };

  return (
    <div className={styles.chatRoom}>
      <div className={styles.chatRoom__container}>
        <div className={styles.chatRoom__roomInformations}>
          <section className={styles.chatRoom__roomDescription}>
            <h2 className={styles.chatRoom__titleDescriptionSection}>
              Informações da Sala
            </h2>
            <p className={styles.chatRoom__createdAt}>Criado em: {createdAt}</p>

            <h3 className={styles.chatRoom__titleDescription}>Descrição:</h3>
            <textarea
              className={styles.chatRoom__description}
              disabled={user.uid !== adminRoom}
              defaultValue={description}
              onChange={(event) => {
                const value = event.target.value;
                setDescription(value);
              }}
              onBlur={handleChangeDescription}
            />
          </section>

          <section className={styles.chatRoom__roomMembers}>
            <h2 className={styles.chatRoom__titleMembersSection}>
              Membros da Sala
            </h2>

            <ul className={styles.chatRoom__members}>
              {members?.map((member) => {
                return (
                  <li key={member.uid} className={styles.chatRoom__member}>
                    {member.displayName}
                  </li>
                );
              })}
            </ul>
          </section>

          <footer>
            <img
              src={logo}
              alt="Eco Chat"
              className={styles.chatRoom__footerLogo}
            />
          </footer>
        </div>

        <div className={styles.chatRoom__chatContainer}>
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
            <h1 className={styles.chatRoom__title}>{roomName}</h1>
          </header>

          <section className={styles.chatRoom__messagesContainer}>
            <main className={styles.chatRoom__mainSection}>
              <div>
                {groupedMessages &&
                  Object.keys(groupedMessages).map((day) => {
                    let messagesFromDay = groupedMessages[day];

                    return (
                      <div key={day}>
                        <h3 className={styles.chatRoom__dayContainer}>{day}</h3>
                        {messagesFromDay.map((msg) => (
                          <ChatMessage key={msg.id} message={msg} />
                        ))}
                      </div>
                    );
                  })}
              </div>
              <div ref={dummy} />
            </main>
          </section>
          <form onSubmit={sendMessage} className={styles.chatRoom__form}>
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className={styles.chatRoom__input}
              placeholder="Digite sua mensagem..."
            />
            <button
              type="submit"
              required
              className={styles.chatRoom__submitMessage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="32px"
                viewBox="0 0 24 24"
                width="32px"
                fill="#FFFFFF"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
