import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const AIPage = () => {
  const { id } = useParams(); // file ID
  const [fileData, setFileData] = useState([]);
  const [question, setQuestion] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/upload/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
      const response = await axios.post("http://localhost:5001/insights", {
        data: fileData,
        question,
      });

      setInsight(response.data.insight || "No response received.");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch insight from AI.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          🤖 Ask AI About Your File
        </h1>

        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Ask a question about this file..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          onClick={handleAskQuestion}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          disabled={loading}
        >
          {loading ? "Getting Answer..." : "Ask AI"}
        </button>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {insight && (
          <div className="mt-6 bg-gray-50 p-4 border border-gray-300 rounded-md">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              🧠 AI Answer:
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{insight}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPage;
