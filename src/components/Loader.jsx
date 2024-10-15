import React from "react";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner}></div>
      </div>
      <p className={styles.text}>Please wait for a few minutes.</p>
      <p className={styles.subText}>This process can take up to 5 minutes.</p>
    </div>
  );
};

export default Loader;
