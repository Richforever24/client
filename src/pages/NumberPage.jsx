import React from "react";
import Header from "../components/Header"; // Adjust path as needed

import Footer from "../components/Footer";

import PhoneNumber from "../components/PhoneNumber";

const LoginPage = () => {
  return (
    <div>
      <Header />
      <main>
        <PhoneNumber />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
