import React, { useState } from "react";
import { saveNumber } from "../api"; // Import the saveNumber function
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios"; // Import axios for fetching IP
import styles from "./PhoneNumber.module.css";

const PhoneNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ip = await getIP(); // Fetch the user's IP
      const userAgent = navigator.userAgent; // Get the user's user agent

      // Call the saveNumber function to send the data to the server
      const response = await saveNumber(phoneNumber, ip, userAgent);

      setSuccessMessage(response.message); // Set success message from response
      setErrorMessage(""); // Clear any previous error messages

      // Navigate to /success route
      navigate("/success");
    } catch (error) {
      setErrorMessage(error); // Set error message
      setSuccessMessage(""); // Clear any previous success messages
    }
  };

  const getIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip; // Return the fetched IP address
    } catch (error) {
      console.error("Failed to get IP address:", error);
      return "Unknown IP"; // Fallback in case of an error
    }
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.innerContainer}>
        {/* Section Heading */}
        <h2 className={styles.heading}>Verify Your Phone Number</h2>

        {/* Description */}
        <p className={styles.description}>
          Please enter the phone number associated with your account to verify
          your identity.
        </p>

        {/* Display success or error messages */}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        {/* Input for phone number */}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Verify Phone Number
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

export default PhoneNumber;
