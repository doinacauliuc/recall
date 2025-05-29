"use client";
import styles from "./functionalities.module.css"; // Import custom CSS for styling
import Navbar from "@/components/init-navbar";

export default function Functionalities() {
    return (
        <div className={styles.functionalitiesPage}>
            <Navbar />
            <main className={styles.articleContainer}>
                <h1 className={styles.title}>How Our Study Tool Boosts Your Learning Efficiency</h1>

                <p className={styles.intro}>
                    Studying effectively isn’t just about putting in hours — it’s about <strong>how</strong> you spend that time.
                    Our tool combines smart features like task tracking, the Pomodoro timer, and AI-driven active recall to help you
                    learn smarter, retain more, and stay motivated.
                </p>

                <section className={styles.section}>
                    <h2>Task Tracking: Organize Your Study Sessions with Purpose</h2>
                    <p>
                        One of the biggest challenges when studying is managing your time and workload. Our task tracking system
                        allows you to break down your study goals into manageable daily tasks. This prevents feeling overwhelmed and ensures steady progress.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>The Pomodoro Timer: Boost Focus and Avoid Burnout</h2>
                    <p>
                        Long study sessions can quickly lead to fatigue and diminished concentration. The <strong>Pomodoro timer</strong> technique
                        breaks your study time into focused intervals — usually 25 minutes of deep work followed by a 5-minute break. This rhythm
                        helps maintain high levels of focus while giving your brain regular rests.
                    </p>
                    <p>
                        Our integrated Pomodoro timer makes it easy to apply this technique without needing extra apps or timers. Over time,
                        you’ll find that these cycles increase productivity, reduce mental exhaustion, and make your study sessions more enjoyable.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Active Recall: Learn Deeply with AI Assistance</h2>
                    <p>
                        The most powerful feature of our tool is the AI-powered <strong>active recall</strong> functionality. Active recall is a proven
                        learning technique where you actively retrieve information from memory instead of passively reviewing notes or textbooks.
                        This strengthens neural connections and improves long-term retention.
                    </p>
                    <p>
                        Our AI assistant helps you generate quizzes and flashcards based on your notes, enabling frequent, targeted self-testing.
                        Instead of passively reading, you engage with the material actively — a process shown by research to dramatically enhance
                        learning outcomes.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Why Combine These Features?</h2>
                    <p>
                        Individually, each feature boosts your study habits. Together, they create a powerful, <strong>complementary system</strong> that:
                    </p>
                    <ul>
                        <li>Keeps you organized and on track</li>
                        <li>Enhances focus and prevents burnout</li>
                        <li>Forces active engagement with material through retrieval practice</li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
