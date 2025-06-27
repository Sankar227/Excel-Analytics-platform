import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthData } from "../redux/slices/authSlice";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle token from URL (Google login redirect)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");

    if (urlToken && !token) {
      axios
        // .get("http://localhost:5001/auth/me", {
        .get("https://excel-analytics-platform-m9zv.onrender.com/auth/me", {
          
          headers: { Authorization: `Bearer ${urlToken}` },
        })
        .then((res) => {
          dispatch(setAuthData({ token: urlToken, user: res.data }));
          navigate("/dashboard", { replace: true }); // remove token param
        })
        .catch((err) => {
          console.error("Failed to fetch user data", err);
          navigate("/login");
        });
    }
  }, [location, dispatch, navigate, token]);

  // Fetch upload history
  const fetchHistory = async () => {
    try {
      // const res = await axios.get("http://localhost:5001/upload/history", {
       const res = await axios.get("https://excel-analytics-platform-m9zv.onrender.com/upload/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  const uploadsByDate = history.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const allDates = Object.keys(uploadsByDate);
  if (allDates.length === 0) {
    return (
      <p className="text-center text-gray-500 text-lg mt-10">
        No uploads yet. Upload a file to get started.
      </p>
    );
  }

  const startDate = new Date(
    Math.min(...allDates.map((d) => new Date(d).getTime()))
  );
  const endDate = new Date(
    Math.max(...allDates.map((d) => new Date(d).getTime()))
  );

  const dateRange = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dateRange.push(currentDate.toLocaleDateString());
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const chartData = dateRange.map((date) => ({
    date,
    count: uploadsByDate[date] || 0,
  }));

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
    <div className="px-4 md:px-8 lg:px-16 pt-20 max-w-6xl mx-auto">
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
    </div>
  );
};

export default DashBoard;
