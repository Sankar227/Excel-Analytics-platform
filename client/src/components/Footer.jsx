import React from "react";
import { Facebook, Twitter, Linkedin, Github, Mail } from "lucide-react"; // You can replace this with react-icons if you prefer

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-center text-slate-700 text-sm py-6 mt-auto">
      <div className="flex justify-center gap-4 mb-2">
        <a href="https://facebook.com" target="_blank" rel="noreferrer">
          <Facebook className="h-5 w-5 hover:text-blue-600 transition duration-200" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <Twitter className="h-5 w-5 hover:text-blue-400 transition duration-200" />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
          <Linkedin className="h-5 w-5 hover:text-blue-700 transition duration-200" />
        </a>
        <a href="https://github.com" target="_blank" rel="noreferrer">
          <Github className="h-5 w-5 hover:text-gray-900 transition duration-200" />
        </a>
        <a href="mailto:support@example.com">
          <Mail className="h-5 w-5 hover:text-rose-600 transition duration-200" />
        </a>
      </div>
      <p>
        © {new Date().getFullYear()} Excel Analytics Platform. All rights
        reserved.
      </p>
    </footer>
  );
};

export default Footer;
