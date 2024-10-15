import React from "react";
import Header from "../components/Header"; // Adjust path as needed

import Footer from "../components/Footer";
import Verify from "../components/Verify";

const LoginPage = () => {
  return (
    <div>
      <Header />
      <main>
        <Verify />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
