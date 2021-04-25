import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../database/firebase";

import landingPageImg from "../assets/images/landing-page.svg";
import logo from "../assets/images/logo.svg";
import Rooms from "../components/Rooms.jsx";
import SignIn from "../components/SignIn.jsx";

import styles from "../styles/pages/Home.module.css";

function Home() {
  const [user] = useAuthState(auth);

  return (
    <div className={styles.home}>
      <main className={styles.home__mainSection}>
        <div className={styles.home__logo}>
          <img src={logo} alt="Eco chat" />
          {user && <h5>Olá, {user.displayName}</h5>}
        </div>
        {user ? <Rooms /> : <SignIn />}
      </main>

      <section className={styles.home__landingSection}>
        <img src={landingPageImg} alt="Landing page" />
      </section>
    </div>
  );
}

export default Home;
