import React from "react";
import Header from "../components/Header"; // Adjust path as needed

import Footer from "../components/Footer";

import Success from "../components/Success";

const LoginPage = () => {
  return (
    <div>
      <Header />
      <main>
        <Success />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
