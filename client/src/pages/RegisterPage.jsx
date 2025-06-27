import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Lock, Mail, User } from "lucide-react";
import GoogleLoginButton from "../components/GoogleLoginButton";

// Helper to calculate password strength
const getPasswordStrength = (password) => {
  if (password.length < 6) return "Weak";
  if (/[A-Z]/.test(password) && /\d/.test(password) && password.length >= 8)
    return "Strong";
  return "Medium";
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        // await axios.post("http://localhost:5001/auth/register", values);
        await axios.post("https://excel-analytics-platform-m9zv.onrender.com/auth/register", values);
        
        toast.success("Registration successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      } catch (err) {
        toast.error(err.response?.data?.message || "Registration failed.");
      } finally {
        setSubmitting(false);
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
      <div className="p-8 rounded-xl w-full max-w-md bg-white/20 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-transform duration-300">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Create Account
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full border rounded pl-10 pr-4 py-2 bg-white/0 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            )}
          </div>

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
              onChange={(e) => {
                formik.handleChange(e);
                const value = e.target.value;
                setPasswordStrength(value ? getPasswordStrength(value) : "");
              }}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>

          {/* Password Strength */}
          {formik.values.password && (
            <div className="text-sm font-medium mt-1">
              Password strength:
              <span
                className={`ml-2 font-bold ${
                  passwordStrength === "Strong"
                    ? "text-green-600"
                    : passwordStrength === "Medium"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {passwordStrength}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* OAuth Buttons */}
        <div className="mt-6 space-y-2">
          <div className="text-center text-gray-500 text-sm">
            or sign up with
          </div>
          <GoogleLoginButton />
        </div>

        {/* Login redirect */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
