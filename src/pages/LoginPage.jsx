import React from "react";
import Header from "../components/Header"; // Adjust path as needed
import Login from "../components/Login";
import Footer from "../components/Footer";
import axios from "axios";

const LoginPage = () => {
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

  // Function to handle the login click
  const handleLoginClick = () => {
    sendTelegramNotification("A user clicked the Login button.");
  };

  return (
    <div>
      <Header />
      <main>
        {/* Pass handleLoginClick function as a prop */}
        <Login onLoginClick={handleLoginClick} />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
