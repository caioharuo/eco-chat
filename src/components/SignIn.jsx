import firebase from "firebase/app";
import { auth } from "../App";

import React from "react";

import styles from "../styles/components/SignIn.module.css";

export default function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button onClick={signInWithGoogle} className={styles.signInBtn}>
      Sign in with Google
    </button>
  );
}
