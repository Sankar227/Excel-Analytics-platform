import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="text-center text-sm text-gray-500 py-8">
        © {new Date().getFullYear()} Excel Analytics Platform. All rights
        reserved.
      </footer>
    </>
  );
};

export default Footer;
