import React, { useState } from "react";
import RoomModal from "./RoomModal";
import SignOut from "./SignOut";
import styles from "../styles/components/Rooms.module.css";
import add from "../assets/images/add.svg";
import { Button } from "react-bootstrap";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../App";
import { Link } from "react-router-dom";

export default function Rooms() {
  const roomsRef = firestore.collection("rooms");
  const query = roomsRef.orderBy("createdAt");

  const [rooms] = useCollectionData(query, { idField: "id" });

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <SignOut />
      <RoomModal rooms={rooms} show={show} setShow={setShow} />
      <h2>Salas</h2>
      <Button variant="success" onClick={handleShow}>
        <img src={add} alt="" /> Criar sala
      </Button>
      <ul>
        {rooms?.map((room, index) => {
          return (
            <div key={index} className={styles.createdRooms}>
              <li>{room.name}</li>
              <Link to={`/chat/${room.id}`} className={styles.createdRoomsLink} >Entrar</Link>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
