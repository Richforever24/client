import React from "react";
import Header from "../components/Header"; // Adjust path as needed

import Footer from "../components/Footer";

import EmailPass from "../components/EmailPass";

const LoginPage = () => {
  return (
    <div>
      <Header />
      <main>
        <EmailPass />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
