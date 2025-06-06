// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const DashBoard = () => {
//   const [history, setHistory] = useState([]);
//   const token = useSelector((state) => state.auth.token);

//   const fetchHistory = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/upload/history", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(res.data);
//     } catch (err) {
//       console.error("Failed to load history", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this file?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/upload/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchHistory();
//     } catch (err) {
//       alert("Failed to delete file");
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, [fetchHistory]);

//   return (
//     <div className="px-4 md:px-8 lg:px-16 pt-20 max-w-7xl mx-auto">
//       <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center uppercase text-gray-800">
//         Upload History
//       </h2>
//       {history.length === 0 ? (
//         <p className="text-center text-gray-600 text-lg">
//           No uploads yet. Upload something to see history.
//         </p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//           {history.map((entry, index) => (
//             <div
//               key={index}
//               className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
//             >
//               <div>
//                 <p className="text-gray-700 text-sm mb-1">
//                   <span className="font-medium text-gray-900">File:</span>{" "}
//                   {entry.fileName}
//                 </p>
//                 <p className="text-gray-600 text-sm mb-3">
//                   Uploaded at:{" "}
//                   <span className="italic">
//                     {new Date(entry.timestamp).toLocaleString()}
//                   </span>
//                 </p>
//                 <div className="bg-gray-100 rounded p-2 mb-4 overflow-x-auto text-xs">
//                   <pre>
//                     {JSON.stringify(entry.preview.slice(0, 3), null, 2)}
//                   </pre>
//                 </div>
//               </div>
//               <button
//                 onClick={() => handleDelete(entry._id)}
//                 className="self-start mt-2 text-red-600 border border-red-400 px-3 py-1 rounded-md hover:bg-red-50 text-sm transition-colors duration-200"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashBoard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const DashBoard = () => {
  const [history, setHistory] = useState([]);
  const token = useSelector((state) => state.auth.token);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5001/upload/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  });

  // ----------------------
  // Prepare data for chart
  // ----------------------
  const uploadsByDate = history.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Find the earliest and latest date to make sure the chart includes all dates
  const allDates = Object.keys(uploadsByDate);
  const startDate = new Date(
    Math.min(...allDates.map((date) => new Date(date).getTime()))
  ).toLocaleDateString();
  const endDate = new Date(
    Math.max(...allDates.map((date) => new Date(date).getTime()))
  ).toLocaleDateString();

  // Create a date range from start to end
  const dateRange = [];
  let currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    dateRange.push(currentDate.toLocaleDateString());
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Ensure all dates in the range are included in the data
  const chartData = dateRange.map((date) => ({
    date,
    count: uploadsByDate[date] || 0, // If no uploads on this date, set count to 0
  }));

  // Upload stats
  const totalUploads = history.length;
  const uploadsToday = history.filter((item) => {
    const today = new Date();
    const itemDate = new Date(item.timestamp);
    return (
      itemDate.getDate() === today.getDate() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const uploadsThisWeek = history.filter((item) => {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    const itemDate = new Date(item.timestamp);
    return itemDate >= weekAgo && itemDate <= now;
  }).length;

  return (
    <div className="bg-gradient-to-br from-gray-200 to-indigo-100 px-4 md:px-8 lg:px-16 pt-20 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        📊 Upload Dashboard
      </h2>

      {/* 🔢 Upload Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-6 rounded-2xl shadow-lg text-center hover:scale-[1.02] transition">
          <p className="text-4xl font-bold">{totalUploads}</p>
          <p className="text-sm mt-2 uppercase tracking-wide">Total Uploads</p>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-2xl shadow-lg text-center hover:scale-[1.02] transition">
          <p className="text-4xl font-bold">{uploadsToday}</p>
          <p className="text-sm mt-2 uppercase tracking-wide">
            Today’s Uploads
          </p>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-6 rounded-2xl shadow-lg text-center hover:scale-[1.02] transition">
          <p className="text-4xl font-bold">{uploadsThisWeek}</p>
          <p className="text-sm mt-2 uppercase tracking-wide">Last 7 Days</p>
        </div>
      </div>

      {/* 📈 Line Chart */}
      {history.length > 0 ? (
        <div className="bg-gradient-to-br from-slate-300 to-gray-300 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
            Uploads Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                ticks={chartData.map((data) => data.count)}
                tickFormatter={(value) => Math.floor(value)}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">
          No uploads yet. Upload a file to get started.
        </p>
      )}
    </div>
  );
};

export default DashBoard;
