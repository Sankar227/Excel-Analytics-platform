import React from "react";

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-100 rounded-2xl p-6 shadow hover:shadow-lg transition">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-700">{description}</p>
  </div>
);

export default FeatureCard;
