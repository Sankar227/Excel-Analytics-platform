import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setAuthData } from "../redux/slices/authSlice";

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
          "http://localhost:5001/auth/login",
          values
        );
        toast.success("Login successful!");
        dispatch(setAuthData({ token: res.data.token, user: res.data.user }));
        setTimeout(() => navigate("/dashboard"), 1500);
      } catch (err) {
        toast.error(err.response?.data?.message || "Invalid Credentials");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <ToastContainer position="top-center" />
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Login
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

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
          <div className="text-center text-gray-500 text-sm">or login with</div>
          <button className="flex items-center justify-center gap-2 w-full border px-4 py-2 rounded hover:bg-gray-100">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
          <button className="flex items-center justify-center gap-2 w-full border px-4 py-2 rounded hover:bg-gray-100">
            <img
              src="https://www.svgrepo.com/show/157810/facebook.svg"
              alt="Facebook"
              className="w-5 h-5"
            />
            Continue with Facebook
          </button>
        </div>

        {/* Register redirect */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const auth = localStorage.getItem("user");
//     if (auth) {
//       navigate("/dashboard");
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const credentials = { email, password };

//     let result = await fetch("http://localhost:5000/auth/login", {
//       method: "post",
//       body: JSON.stringify(credentials),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     result = await result.json();
//     // console.log(result);

//     if (result) {
//       localStorage.setItem("user", JSON.stringify(result.user));
//       localStorage.setItem("token", result.token);
//       navigate("/dashboard");
//     } else {
//       alert("Invalid login details");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm md:max-w-md">
//         <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
//           Login
//         </h2>
//         <form className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button
//             type="submit"
//             onClick={handleLogin}
//             className="w-full py-2 rounded text-white font-semibold bg-blue-500 hover:bg-blue-600"
//           >
//             Login
//           </button>
//         </form>
//         <p className="text-center text-sm text-gray-600 mt-4">
//           Don't have an account?{" "}
//           <span
//             className="text-blue-500 hover:underline cursor-pointer"
//             onClick={() => navigate("/signup")}
//           >
//             Sign Up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
