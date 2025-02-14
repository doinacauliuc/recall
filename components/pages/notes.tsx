import { useEffect, useState } from "react";
import styles from "@/components/styles/pages.module.css";
import { useUser } from "@/app/hooks/userContext";
import CoursesPage from "./courses";


export type course = {
    course_name: string;
    course_id: number;
} | null;


export default function NotesPage() {
   return(
    <div>
        <CoursesPage />
    </div>
   );
}
