import { useState } from "react";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";

import roomRepository from "../database/repositories/RoomRepository";

export default function RoomModal({ rooms, show, setShow }) {
  const [roomName, setRoomName] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if(form.checkValidity() === true && roomName.length <= 20){
      roomRepository.createRoom(roomName);
      handleClose();
    }else{
      event.stopPropagation();
    }
    setValidated(true);
  };

  const handleClose = () => {
    setShow(false);
    setRoomName("");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Criação de Sala</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            id="roomForm"
            onSubmit={handleSubmit}
          >
            <Form.Group controlId="exampleForm.ControlInput1">
              <InputGroup hasValidation>
                <Form.Control
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  type="text"
                  placeholder="Digite o nome da sala..."
                  required
                  maxLength="20"
                />
                <Form.Control.Feedback type="invalid">
                  Nome inválido
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="success" type="submit" form="roomForm">
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}