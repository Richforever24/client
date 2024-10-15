import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Links Section */}
      <div className={styles.links}>
        <a href="#mobile">Mobile</a>
        <a href="#browser">Browser Support</a>
        <a href="#privacy">Privacy Policy</a>
      </div>

      {/* Certifications Section */}
      <div className={styles.certifications}>
        <img src="/ncua.jpg" alt="NCUA" />
        <img src="/equalho.png" alt="Equal Housing Lender" />
      </div>

      {/* Routing Number Section */}
      <div className={styles.routing}>
        <p>
          Routing number: <strong>324173626</strong>
        </p>
      </div>

      {/* App Links Section */}
      <div className={styles.appLinks}>
        <img src="/appstore.png" alt="Download on the App Store" />
        <img src="/playstore.png" alt="Get it on Google Play" />
      </div>

      {/* Chat Now Button */}
      <button className={styles.chatButton}>CHAT NOW</button>
    </footer>
  );
};

export default Footer;
