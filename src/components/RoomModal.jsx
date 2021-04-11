import { useState } from "react";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";

import roomRepository from "../database/repositories/RoomRepository";

export default function RoomModal({ rooms, show, setShow }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if(form.checkValidity() === true && name.length <= 20){

      const room={ name, description }

      roomRepository.createRoom(room);
      handleClose();
    }else{
      event.stopPropagation();
    }
    setValidated(true);
  };

  const handleClose = () => {
    setShow(false);
    setName("");
    setDescription("");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M19,19V5c0-1.1-0.9-2-2-2H7C5.9,3,5,3.9,5,5v14H3v2h18v-2H19z M15,13h-2v-2h2V13z"/></g></svg> 
            Criação de Sala
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            id="roomForm"
            onSubmit={handleSubmit}
          >
            <Form.Group controlId="roomForm.Name">
              <Form.Label>Nome</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                  maxLength="20"
                />
                <Form.Control.Feedback type="invalid">
                  Nome inválido
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="roomForm.Description">
            <Form.Label>Descrição</Form.Label>
              <InputGroup>
                <Form.Control
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  as="textarea" 
                  rows={3}
                />
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="white"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            Fechar
          </Button>
          <Button variant="success" type="submit" form="roomForm">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="white"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg> 
          <span>Salvar</span>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}