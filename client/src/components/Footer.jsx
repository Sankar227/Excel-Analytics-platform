import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-gradient-to-br from-gray-200 to-indigo-100 text-center text-sm text-slate-950 py-8">
        © {new Date().getFullYear()} Excel Analytics Platform. All rights
        reserved.
      </footer>
    </>
  );
};

export default Footer;
