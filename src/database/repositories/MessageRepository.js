import firebase from "firebase/app";
import { auth, messagesRef } from "../firebase";

class MessageRepository {
  /* 
    async getAllMessagesByRoom(roomId){
        const snapshot = await messagesRef.orderBy("createdAt").where("roomId", "==", roomId).get();
        return snapshot.docs.map(doc => doc.data());
    } */

  async sendMessage(message) {
    const { uid, photoURL, displayName } = auth.currentUser;

    await messagesRef.add({
      text: message.text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      roomId: message.roomId,
      uid,
      photoURL,
      displayName,
    });
  }
}

export default new MessageRepository();
