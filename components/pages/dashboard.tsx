import styles from '@/components/styles/pages.module.css'
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className={styles.pageContainer}>
            <h1 className= {styles.title}>Dashboard Page</h1>
            <div className={styles.homeContainer}>

<div className={styles.helloContainer}>
    <div className={styles.hello}>Hello,</div>
    <div className={styles.hello}>User</div>   
</div>

<div className={styles.homeContainer2}>

    <div className={styles.allbuttonContainer}> 

        <div className={styles.buttonContainer}>  

            <Link href="/storenotes">
                <button className={styles.button2}>              
                    <img className={styles.image} src="/appunti.svg" alt="store_notes"/>
                    <div>Store Notes</div>
                </button>
            </Link>
            
            <Link href= "/summarize">
                <button className={styles.button2}>
                <img className={styles.image} src="/libro.svg" alt="summarize"/>
                <div>Summarize</div>
                </button>
            </Link>
        
        </div>

        <div className={styles.buttonContainer}> 

            <Link href="/flashcards">
                <button className={styles.button2}>
                    <img className={styles.image} src="/flashcard.svg" alt="flashcard"/>
                    <div>Flashcards</div>
                </button>
            </Link>

            <Link href="/practice">
                <button className={styles.button2}>
                <img className={styles.image} src="/dialogo.svg" alt="practice"/>
                <div>Practice</div>
                </button>
            </Link>
            
        </div>
    </div>
</div>
</div>
        </div>
    );
}