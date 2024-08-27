import { ReactNode } from "react";
import styles from './Alert.module.css'

export default function Alert({children} : {children:ReactNode}) {
    return (
        <div className={styles.alert} >
            {/* Sea lo que sea que le estemos pasando */}
            {children}
        </div>
    )
}
