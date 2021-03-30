import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../App.jsx";
import landingPageImg from "../assets/images/landing-page.svg";
import logo from "../assets/images/logo.svg";
import Rooms from "../components/Rooms.jsx";
import SignIn from "../components/SignIn.jsx";
import styles from "../styles/pages/Home.module.css";

function Home() {
  const [user] = useAuthState(auth);

  return (
    <main className={styles.signinContainer}>
      <section className={styles.logoSection}>
        <div className={styles.logo}>
          <img src={logo} alt="Eco chat" />
          {user && <h2>Olá, {user.displayName}</h2>}
        </div>

        {user ? <Rooms /> : <SignIn />}
        
      </section>
      <section className={styles.landingSection}>
        <img src={landingPageImg} alt="Landing page" />
      </section>
    </main>
  );
}

export default Home;
