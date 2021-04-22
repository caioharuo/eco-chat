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

import logo from '../assets/images/logo.svg'

//Hook de Mensagens
import { useCollectionData } from "react-firebase-hooks/firestore";

import { messagesRef } from "../database/firebase";

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
  const [members, setMembers] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const [description, setDescription] = useState("");
  const [formValue, setFormValue] = useState("");

  const history = useHistory();
  const dummy = useRef();

  useEffect(() => {
    memberRepository.enterInRoom(roomId);
  }, [roomId]);

  useEffect(() => {
    async function handleMembers(roomId) {
      const data = await memberRepository.getAllMembers(roomId);
      setMembers(data);
    }

    roomRepository.getById(roomId).then((room) => {
      if (room) {
        const formatedDate = format.asString(
          "dd/MM/yyyy",
          room.createdAt?.toDate()
        );

        setRoomName(room.name);
        setCreatedAt(formatedDate);
        setDescription(room.description);

        handleMembers(roomId);
      } else history.push("/");
    });
  }, [roomId, history]);

  //Hook de Mensagens
  const query = messagesRef.orderBy("createdAt");
  const [messages, loading] = useCollectionData(query, { idField: "id" });

  if (loading || !roomName) {
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

  const sendMessage = async (e) => {
    e.preventDefault();

    if (formValue.trim().length === 0) return;

    const message = { roomId, text: formValue };
    await messageRepository.sendMessage(message);

    setFormValue("");

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.chatRoom}>
      <div className={styles.chatRoom__container}>
        <div className={styles.chatRoom__roomInformations}>
          <section className={styles.chatRoom__roomDescription}>
            <h2 className={styles.chatRoom__titleDescriptionSection}>
              Descrição da Sala
            </h2>
            <p className={styles.chatRoom__createdAt}>Criado em: {createdAt}</p>

            <h3 className={styles.chatRoom__titleDescription}>Descrição:</h3>
            <textarea
              className={styles.chatRoom__description}
              disabled
              defaultValue={description}
            />
          </section>

          <section className={styles.chatRoom__roomMembers}>
            <h2 className={styles.chatRoom__titleMembersSection}>
              Membros da Sala
            </h2>

            <ul className={styles.chatRoom__members}>
              {members.map((member) => {
                return (
                  <li key={member.uid} className={styles.chatRoom__member}>
                    {member.displayName}
                  </li>
                );
              })}
            </ul>
          </section>

          <footer>
            <img src={logo} alt="Eco Chat" className={styles.chatRoom__footerLogo}/>
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

              <div ref={dummy}></div>
            </main>
          </section>
          <form onSubmit={sendMessage} className={styles.chatRoom__form}>
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
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
