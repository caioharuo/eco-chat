import firebase from "firebase/app";
import { auth, membersRef, roomsRef } from "../firebase";

class MemberRepository {
  async getAllMembers(roomId) {
    const snapshot = await membersRef.where("roomId", "==", roomId).get();
    return snapshot.docs.map((doc) => doc.data());
  }

  async verifyIfUserbyRoom(uid, roomId) {
    const snapshot = await membersRef
      .where("roomId", "==", roomId)
      .where("uid", "==", uid)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async enterInRoom(roomId) {
    const { uid, displayName } = auth.currentUser;

    const userAlreadyInRoom =
      (await this.verifyIfUserbyRoom(uid, roomId))?.length > 0;

    if (!userAlreadyInRoom) {
      await membersRef.add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        roomId,
        uid,
        displayName,
      });

      roomsRef
        .doc(roomId)
        .get()
        .then(async function (result) {
          const room = result.data();

          await roomsRef.doc(roomId).update({
            membersCount: ++room.membersCount,
          });
        });
    }
  }
}

export default new MemberRepository();
