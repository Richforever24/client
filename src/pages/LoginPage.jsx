import React from "react";
import Header from "../components/Header"; // Adjust path as needed
import Login from "../components/Login";
import Footer from "../components/Footer";

const LoginPage = () => {
  return (
    <div>
      <Header />
      <main>
        <Login />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;

