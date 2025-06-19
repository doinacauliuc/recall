"use client";
import styles from "./home.module.css"
import Navbar from "../components/init-navbar";



export default function Home() {

  const features = [
    { description: "Store your notes organized by course"},
    { description: "Automatically create summaries and flashcards"},
    { description: "Let the AI assistant quiz you on your notes" },
    { description: "Track your study time and your daily tasks"},
  
  ];


  return (
    <div className={styles.homePage}>
      <Navbar />
      <div className={styles.homeContainer}>
        <img className={styles.mainLogo} src="/logo_name2.svg" alt="main_logo" />
        <div className={styles.featuresContainer}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
            
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}

          </div>
      </div>
    </div>
  );

}

