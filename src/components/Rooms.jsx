import React, { useState } from "react";
import { Table,Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import RoomModal from "./RoomModal";
import SignOut from "./SignOut";

import add from "../assets/images/add.svg";

import { useAuthState } from "react-firebase-hooks/auth";

import roomRepository from "../database/repositories/RoomRepository";

import styles from "../styles/components/Rooms.module.css";

//Hook de Salas
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, roomsRef } from "../database/firebase";


export default function Rooms() {
  const maxRooms = 10;

  const [user] = useAuthState(auth);
  const [show, setShow] = useState(false);

  //Hook de Salas
  const query = roomsRef.orderBy("createdAt");
  const [rooms] = useCollectionData(query, { idField: "id" });

  const roomsCount = rooms?.length;

  
  const handleShow = () => setShow(true);

  const handleDeleteRoom = (room) => roomRepository.deleteRoom(room.id);

  return (
    <div className={styles.rooms}>
      <SignOut />

      <RoomModal rooms={rooms} show={show} setShow={setShow} />

      <div className={styles.rooms__titleContainer}>
        <h2 className={styles.rooms__title}>Salas</h2>
        <span className={styles.rooms__counter}>
          {roomsCount}/{maxRooms}
        </span>
      </div>

      {roomsCount < maxRooms && (
        <Button
          variant="success"
          onClick={handleShow}
          className={styles.rooms__createRooomButton}
        >
          <img src={add} alt="" /> Criar sala
        </Button>
      )}

      <Table striped bordered hover className={styles.rooms__table}>
        <thead>
          <tr>
            <th>Sala</th>
            <th>Membros ativos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rooms?.map((room, index) => {
            return (
              <tr key={index}>
                <td>{room.name}</td>
                <td>0</td>
                <td className={styles.rooms__tableActions}>
                  <Link to={`/chat/${room.id}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      enableBackground="new 0 0 24 24"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="#000000"
                      className={styles.rooms__tableActionJoin}
                    >
                      <g>
                        <rect fill="none" height="24" width="24" />
                      </g>
                      <g>
                        <path d="M11,7L9.6,8.4l2.6,2.6H2v2h10.2l-2.6,2.6L11,17l5-5L11,7z M20,19h-8v2h8c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-8v2h8V19z" />
                      </g>
                    </svg>
                  </Link>

                  {room.admin === user?.uid && (
                    <button onClick={() => handleDeleteRoom(room)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#000000"
                        className={styles.rooms__tableActionDelete}
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
