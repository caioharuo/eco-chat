import firebase from "firebase/app";
import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { firestore } from "../App";


export default function RoomModal({ rooms, show, setShow }) {
  const roomsRef = firestore.collection("rooms");

  const [roomName, setRoomName] = useState("");

  const handleClose = () => {
    setShow(false)
    setRoomName("");
  };

  const createRoom = async (e) => {
    e.preventDefault();
    
    if (roomName.trim().length > 0) {
      await roomsRef.add({
        name: roomName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
  
      setShow(false);
      setRoomName("");
    }
    
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Criação de Sala</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="roomForm">
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Nome da Sala</Form.Label>
              <Form.Control
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                type="text"
                placeholder="Alfa"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" type="submit" form="roomForm" onClick={createRoom}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
