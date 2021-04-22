import firebase from "firebase/app";
import { auth, messagesRef } from "../firebase";

class MessageRepository {
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
