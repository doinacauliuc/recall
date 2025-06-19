import styles from '@/components/styles/settings.module.css';
import { Lock, Trash2 } from 'lucide-react';
import ChangePasswordPage from './changePassword';
import EliminatedElementsPage from './eliminatedElem';
import { useState } from 'react';

export default function SettingsPage() {
    const [activePage, setActivePage] = useState<"settings" | "changePassword" | "eliminatedElements">("settings"); // Default active page is "sets list"
    const [selectedSet, setSelectedSet] = useState<{ set_name: string; set_id: number } | null>(null); // Track the selected set

    return (
        <div className={styles.pageContainer}>
            {activePage === "settings" && (
                <>
                    <h1 className={styles.title}>Settings</h1>
                    <div className={styles.settingsContainer}>
                        <button className={styles.button} onClick={() => setActivePage("changePassword")}>
                            <Lock />
                            <h1>Change Password</h1>
                        </button>
                        <hr className={styles.divider}></hr>
                        <button className={styles.button} onClick={() => setActivePage("eliminatedElements")}>
                            <Trash2 />
                            <h1>View Deleted Items</h1>
                        </button>
                    </div>
                </>
            )}

            {activePage === "changePassword" && (
                <ChangePasswordPage onBack={() => setActivePage("settings")} />
            )}

            {activePage === "eliminatedElements" && (
                <EliminatedElementsPage onBack={() => setActivePage("settings")} />
            )}
        </div>
    );
}