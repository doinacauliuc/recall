
import styles from "@/components/styles/settings.module.css";

interface EliminatedElementsPageProps {
    onBack: () => void;
}

export default function EliminatedElementsPage({ onBack }: EliminatedElementsPageProps) {
    return (
        <div className={styles.pageContainer}>
            <h2 className={styles.title}>Eliminated Elements</h2>
            <p>Here you'd show a list of deleted items.</p>
            <button className={styles.button} onClick={onBack}>
                Back to Settings
            </button>
        </div>
    );
}