import React from "react";
import { auth } from "../database/firebase";

import styles from "../styles/components/SignOut.module.css";

export default function SignOut() {
  return (
    auth.currentUser && (
      <button
        className={styles.singOut__button}
        onClick={() => auth.signOut()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="40px"
          height="40px"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
        </svg>
      </button>
    )
  );
}
