import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const AIPage = () => {
  const { id } = useParams();
  const [fileData, setFileData] = useState([]);
  const [question, setQuestion] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        // const res = await axios.get(`http://localhost:5001/upload/${id}`, {
        const res = await axios.get(
          `https://excel-analytics-platform-backend-qnaz.onrender.com/upload/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFileData(res.data.preview);
      } catch (err) {
        console.error(err);
        setError("Failed to load file data.");
      }
    };

    fetchFile();
  }, [id, token]);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    setError("");
    setInsight("");
    setLoading(true);

    try {
      // const response = await axios.post("http://localhost:5001/insights", {
      const response = await axios.post(
        "https://excel-analytics-platform-backend-qnaz.onrender.com/insights",
        {
          data: fileData,
          question,
        }
      );

      setInsight(response.data.insight || "No response received.");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch insight from AI.");
    }

    setLoading(false);
    // setQuestion(""); // Clear question after asking
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-3xl relative overflow-hidden border border-gray-200 transition-all duration-500">
        {/* Floating AI Avatar */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-300 w-16 h-16 rounded-full flex items-center justify-center shadow-md animate-bounce-slow">
          <span className="text-3xl">🤖</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-700 mb-10 pt-10">
          Ask AI About Your File
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Ask a question about your uploaded data..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            onClick={handleAskQuestion}
            disabled={loading}
            className={`w-full py-3 text-base sm:text-lg font-semibold rounded-xl transform transition-all duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white"
            }`}
          >
            {loading ? "Getting Answer..." : "Ask AI"}
          </button>

          {error && (
            <div className="text-center text-red-500 font-medium">{error}</div>
          )}

          {/* AI Answer with fade-in animation */}
          {insight && (
            <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 shadow-md animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                🧠 AI Answer
              </h2>

              <p className="text-gray-700 text-base sm:text-lg whitespace-pre-wrap">
                {insight}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPage;
