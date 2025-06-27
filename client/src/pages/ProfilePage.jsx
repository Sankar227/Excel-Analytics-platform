import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../redux/slices/authSlice";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const isGoogleUserWithoutPassword = user?.isGoogleUser && !user?.password;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          // `http://localhost:5001/auth/profile/users/${id}`,
          `https://excel-analytics-platform-m9zv.onrender.com/auth/profile/users/${id}`,          
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFormData((prev) => ({
          ...prev,
          username: res.data.name,
          email: res.data.email,
        }));
        dispatch(updateUser({ name: res.data.name, email: res.data.email }));
      } catch (err) {
        toast.error("Failed to load profile");
        console.error(err);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id, token, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.newPassword)
      newErrors.newPassword = "New password is required";
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await axios.put(
        // `http://localhost:5001/auth/profile/users/${id}`,
         `https://excel-analytics-platform-m9zv.onrender.com/auth/profile/users/${id}`,
        {
          name: formData.username,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(updateUser({ name: formData.username, email: formData.email }));
      toast.success("Profile updated successfully");

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setErrors({});
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg transition-all duration-300"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Profile Settings
        </h2>

        <div className="mb-5">
          <label className="block text-gray-700 font-medium">Username</label>
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            disabled
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            disabled
          />
        </div>

        {!isGoogleUserWithoutPassword && (
          <>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium">
                New Password
              </label>
              <input
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full mt-1 p-3 border rounded-lg transition duration-200 ${
                  errors.newPassword
                    ? "border-red-400 focus:ring-red-400"
                    : "border-indigo-300 focus:ring-indigo-400"
                } focus:outline-none focus:ring-2`}
                placeholder="Enter new password"
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 font-medium">
                Confirm New Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full mt-1 p-3 border rounded-lg transition duration-200 ${
                  errors.confirmPassword
                    ? "border-red-400 focus:ring-red-400"
                    : "border-indigo-300 focus:ring-indigo-400"
                } focus:outline-none focus:ring-2`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
