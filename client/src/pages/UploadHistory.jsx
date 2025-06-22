import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

const UploadHistory = () => {
  const [history, setHistory] = useState([]);
  const [viewData, setViewData] = useState(null);
  const token = useSelector((state) => state.auth.token);

  const [aiInsight, setAIInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5001/upload/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`http://localhost:5001/upload/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHistory();
    } catch (err) {
      alert("Failed to delete file");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="px-4 md:px-8 lg:px-16 pt-20 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center uppercase text-gray-800">
        Upload History
      </h2>
      {history.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No uploads yet. Upload something to see history.
        </p>
      ) : (
        <div className=" w-full overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200 shadow-sm rounded-lg">
            <thead className="bg-gray-300">
              <tr>
                <th className="text-center px-4 py-2 text-sm font-semibold text-gray-700">
                  File
                </th>
                <th className="text-center px-4 py-2 text-sm font-semibold text-gray-700">
                  Uploaded at
                </th>
                <th className="text-center px-4 py-2 text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-200 divide-y divide-gray-100">
              {history.map((entry, index) => (
                <tr key={index}>
                  <td className="text-center px-4 py-2 text-sm text-gray-800 whitespace-nowrap">
                    {entry.fileName}
                  </td>
                  <td className="text-center px-4 py-2 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="text-center px-4 py-2 space-x-2">
                    <button
                      onClick={() => setViewData(entry.preview)}
                      className="text-blue-600 border border-blue-400 px-3 py-1 rounded-md hover:bg-blue-50 text-sm transition-colors duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="text-red-600 border border-red-400 px-3 py-1 rounded-md hover:bg-red-50 text-sm transition-colors duration-200"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => navigate(`/insights/${entry._id}`)}
                      className="text-green-600 border border-green-400 px-3 py-1 rounded-md hover:bg-green-50 text-sm"
                    >
                      Get Insight
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* view Data Modal */}
      {viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Full Data View
              </h3>
              <button
                onClick={() => setViewData(null)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                ✖ Close
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border border-gray-200">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    {Object.keys(viewData[0] || {}).map((key) => (
                      <th
                        key={key}
                        className="px-4 py-2 font-semibold text-gray-700 border-r border-gray-200"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {viewData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {Object.values(row).map((val, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-2 border-r border-gray-100"
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadHistory;
