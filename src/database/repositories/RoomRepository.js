import firebase from "firebase/app";
import { auth, roomsRef, messagesRef } from "../firebase";

class RoomRepository {
  async getById(id) {
    const dataRef = await roomsRef.doc(id).get();

    return dataRef.data();
  }

  async createRoom(roomName) {
    const { uid } = auth.currentUser;

    await roomsRef.add({
      name: roomName.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      admin: uid,
    });
  }

  async deleteRoom(id){
    roomsRef.doc(id).delete();

    messagesRef
      .where("roomId", "==", id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          messagesRef.doc(doc.id).delete();
        });
      });
  }
}

export default new RoomRepository();
