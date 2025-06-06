import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        await axios.post("http://localhost:5001/auth/register", values);
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <ToastContainer position="top-center" />
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Create Account
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
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
          <button className="flex items-center justify-center gap-2 w-full border px-4 py-2 rounded hover:bg-gray-100">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign up with Google
          </button>
          <button className="flex items-center justify-center gap-2 w-full border px-4 py-2 rounded hover:bg-gray-100">
            <img
              src="https://www.svgrepo.com/show/157810/facebook.svg"
              alt="Facebook"
              className="w-5 h-5"
            />
            Sign up with Facebook
          </button>
        </div>

        {/* Login redirect */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
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

