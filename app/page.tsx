"use client";
import styles from "./home.module.css"
import Navbar from "../components/init-navbar";


export default function Home() {
  return (
    <div>
      <Navbar />
      <div className={styles.homeContainer}>
        <img className={styles.mainLogo} src="/logo_name2.svg" alt="main_logo" />
      </div>
    </div>
  );

}

