import styles from "./home.module.css"
import Link from "next/link";


export default function Home() {
  return (
    <div className={styles.homeContainer}>
    <img className={styles.mainLogo} src="/logo_name2.svg" alt="main_logo"/>

    <div className={styles.buttonContainer}>
    
      <Link href="/login">
        <button className={styles.button}>Login</button>
      </Link>
      
      <Link href= "/signup">
        <button className={styles.button}>Sign Up</button>
      </Link>

    </div>

</div>
  );
  
}

