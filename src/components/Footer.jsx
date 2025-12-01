import React from "react";

const Footer = ({ theme }) => {
  return (
    <footer
      className={`mt-12 py-6 border-t ${
        theme === "dark" ? "border-gray-800" : "border-gray-300"
      } text-center ${theme === "dark" ? "text-white" : "text-black"}`}
    >
      © 2025 Xplore | Designed with ❤️ by Hussain
    </footer>
  );
};

export default Footer;
