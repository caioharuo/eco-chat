import firebase from "firebase/app";
import { auth, roomsRef, messagesRef, membersRef } from "../firebase";

class RoomRepository {
  async getById(id) {
    const dataRef = await roomsRef.doc(id).get();

    return dataRef.data();
  }

  async createRoom(room) {
    const { uid } = auth.currentUser;

    await roomsRef.add({
      name: room.name.trim(),
      description: room.description.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      admin: uid,
      membersCount: 0,
    });
  }

  async updateRoom(roomId, description) {
    await roomsRef.doc(roomId).update({
      description,
    });
  }

  async deleteRoom(id) {
    roomsRef.doc(id).delete();

    messagesRef
      .where("roomId", "==", id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          messagesRef.doc(doc.id).delete();
        });
      });

    membersRef
      .where("roomId", "==", id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          membersRef.doc(doc.id).delete();
        });
      });
  }
}

export default new RoomRepository();
