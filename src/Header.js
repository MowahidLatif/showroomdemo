import React from 'react';
import styles from './Header.module.css';

function Header() {
    return (
        <header className={styles.Appheader}>
            <div className={styles.title}>
                <h1>360 Demo</h1>
            </div>
            <div className={styles.info}>
                <div>Pricing</div>
                <div>Meet the Team</div>
                <div>Contact</div>
                <div>Products</div>
            </div>
        </header>
    );
}

export default Header;
