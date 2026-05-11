import { ReactNode } from "react";
import styles from "./ui.module.css";

export default function TopBar({ children }: { children: ReactNode }) { 
    return (
        <div className={`${styles.topBar} flex flex-row justify-start items-center gap-4` }>
            {children}
        </div>
    )
}