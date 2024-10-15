import React from "react";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.leftMenu}>
          <li>
            <a href="#english">English</a>
          </li>
          <li>
            <a href="#espanol">Español</a>
          </li>
        </ul>
        <ul className={styles.rightMenu}>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <a href="#locations">Locations</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
