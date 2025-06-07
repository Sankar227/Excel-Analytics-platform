import React from "react";
import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";

const HomePage = () => {
  return (
    <div className="min-h-screen  text-gray-800">
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Excel Analytics Platform
        </h1>
        <p className="max-w-2xl text-lg md:text-xl mb-6">
          Upload your Excel files and generate dynamic 2D and 3D charts
          effortlessly. Download them in JPG, PNG, or PDF formats with just a
          click.
        </p>
        <Link
          to="/dashboard"
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </section>

      <section className="py-16 px-6 md:px-20 ">
        <h2 className="text-3xl font-bold text-center mb-10">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon="📊"
            title="Generate 2D Charts"
            description="Create line, bar, pie, and scatter plots using your Excel data with interactive 2D charts."
          />
          <FeatureCard
            icon="📈"
            title="Visualize with 3D Charts"
            description="Experience immersive 3D charts using Plotly.js and Three.js for deeper data insights."
          />
          <FeatureCard
            icon="⬇️"
            title="Export Charts"
            description="Download your charts in high-quality JPG, PNG, and PDF formats for reporting and sharing."
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
