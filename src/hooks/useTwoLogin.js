import { useState } from "react";

export const useTwoLogin = (attemptCount, setAttemptCount) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [twoLogin, setTwoLogin] = useState("off");

  const handleLogin = (username, password, deviceFingerprint) => {
    if (twoLogin === "on" && attemptCount === 0) {
      setErrorMessage(
        "That combination doesn't match our records. You can try again, or we can help you create a new password or find your username."
      );
      setAttemptCount(1);
      return false; // Failure case
    }
    return true; // Success case
  };

  return { errorMessage, handleLogin };
};
