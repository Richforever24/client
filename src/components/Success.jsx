import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import styles from "./Success.module.css";

const Success = () => {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    // Countdown logic
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    // Redirect to home page after 10 seconds
    const timer = setTimeout(() => {
      window.location.href = "https://myebranch.iccu.com/Authentication"; // Replace with your desired URL
    }, 10000);

    // Clean up the timer when the component unmounts
    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className={styles.parentContainer}>
      <div className={styles.successContainer}>
        {/* Checkmark animation */}
        <div className={styles.checkmark}></div>

        {/* Success message */}
        <p className={styles.message}>Verified Successfully!</p>

        {/* Countdown for redirect */}
        <p className={styles.countdown}>
          Redirecting to the home page in {secondsLeft} seconds...
        </p>
      </div>
    </div>
  );
};

export default Success;
