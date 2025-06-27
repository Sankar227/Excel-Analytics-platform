import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setAuthData } from "../redux/slices/authSlice";
import { Mail, Lock } from "lucide-react";

import GoogleLoginButton from "../components/GoogleLoginButton";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await axios.post(
          // "http://localhost:5001/auth/login",
          "https://excel-analytics-platform-m9zv.onrender.com/auth/login",
          
          values
        );
        toast.success("Login successful!");
        const { token, user } = res.data;
        dispatch(setAuthData({ token, user }));

        setTimeout(() => {
          if (user.isAdmin) {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }, 1000);
      } catch (err) {
        const status = err.response?.status;
        const message = err.response?.data?.error || "Invalid Details";

        if (status === 403) {
          toast.error("Your account has been blocked by the admin.");
        } else {
          toast.error(message);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
      <div
        className="
          p-8 rounded-3xl w-full max-w-md
          bg-white/20 backdrop-blur-md
          border border-white/40
          shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
          transition-transform duration-300
        "
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Login
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border rounded pl-10 pr-4 py-2 bg-white/0 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 border rounded py-2 bg-white/0 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* OAuth Buttons */}
        <div className="mt-6 space-y-2">
          <div className="text-center text-gray-600 text-sm">or login with</div>

          <GoogleLoginButton />
        </div>

        {/* Register redirect */}
        <p className="text-center text-sm text-gray-700 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
