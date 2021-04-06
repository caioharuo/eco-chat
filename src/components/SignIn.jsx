import firebase from "firebase/app";
import { auth } from "../database/firebase";

import React from "react";

import styles from "../styles/components/SignIn.module.css";

export default function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button onClick={signInWithGoogle} className={styles.signIn__button}>
      Entre com uma conta Google
    </button>
  );
}
