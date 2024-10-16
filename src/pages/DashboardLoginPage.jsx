import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirecting
import axios from "axios"; // Axios to call the API
import styles from "./DashboardLoginPage.module.css";

const DashboardLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Hook to navigate after successful login

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setErrorMessage("Username and password are required.");
      return;
    }

    try {
      // Call the admin login API
      const response = await axios.post("https://serverside-nn15.onrender.com/auth/login", {
        username,
        password,
      });

      // If login is successful, save the JWT and redirect to dashboard
      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Save token to localStorage
        navigate("/admin-dashboard"); // Redirect to Admin Dashboard
      }
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.innerContainer}>
        {/* Heading */}
        <h2 className={styles.heading}>Admin Dashboard Login</h2>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
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
          </div>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>

        {/* Error Message */}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default DashboardLoginPage;
