import React, { useState } from "react";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { setAuthData } from "../redux/slices/authSlice";
import "react-toastify/dist/ReactToastify.css";

const SetPasswordPage = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
    const navigate = useNavigate();
    
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

//   const token = useSelector((state) => state.auth.token);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // const res = await axios.post(
      //   "http://localhost:5001/auth/set-password",
      const res = await axios.post(
        "https://excel-analytics-platform-backend-qnaz.onrender.com/auth/set-password",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Update Redux with new user object
      dispatch(setAuthData({ user: res.data.user}));

      toast.success("Password set successfully");
    //   setTimeout(() => {
        navigate("/dashboard");
    //   }, 200); // 200ms delay
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to set password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ToastContainer position="top-center" />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-600">
          Set Password
        </h2>

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700"
        >
          Set Password
        </button>
      </form>
    </div>
  );
};

export default SetPasswordPage;
