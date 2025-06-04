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

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SignUp = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const auth = localStorage.getItem("user");
//     if (auth) {
//       navigate("/dashboard");
//     }
//   }, [navigate]);

//   const collectData = async (e) => {
//     e.preventDefault();
//     const data = { name, email, password };
//     //   let result = await fetch("http://localhost:5000/register", {
//     //     method: "post",
//     //     body: JSON.stringify(data),
//     //     headers: { "Content-Type": "application/json" },
//     //   });
//     //   result = await result.json();
//     //   // localStorage.setItem("user", JSON.stringify(result.result));
//     //   // localStorage.setItem("token", JSON.stringify(result.auth));
//     //   if (result.success) {
//     //     alert("Registration successful");
//     //     navigate("/login");
//     //   } else {
//     //     alert("Registration failed");
//     //   }
//     // };

//     try {
//       let response = await fetch("http://localhost:5000/auth/register", {
//         method: "POST",
//         body: JSON.stringify(data),
//         headers: { "Content-Type": "application/json" },
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert("Registration successful! Please login.");
//         navigate("/login");
//       } else {
//         alert(result.message || "Registration failed. Try again!");
//       }
//     } catch (error) {
//       console.error("Error during registration:", error);
//       // alert("Something went wrong. Please try again later.");
//       alert("User already exists");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100 pt-20 px-4">
//       {/* Form Section */}
//       <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-sm">
//         <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
//           Create Account
//         </h2>
//         <form onSubmit={collectData} className="space-y-5">
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Name"
//             className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded"
//           >
//             Sign Up
//           </button>
//         </form>
//         <p className="text-center text-sm text-gray-600 mt-4">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/login")}
//             className="text-indigo-500 hover:underline cursor-pointer"
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // const SignUp = () => {
// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const auth = localStorage.getItem("user");
// //     if (auth) {
// //       navigate("/");
// //     }
// //   }, []);

// //   const collectData = async (e) => {
// //     e.preventDefault();
// //     const data = {
// //       name,
// //       email,
// //       password,
// //     };
// //     // console.log(data);
// //     let result = await fetch("http://localhost:5000/register", {
// //       method: "post",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify(data),
// //     });
// //     result = await result.json();
// //     console.log(result);
// //     setName("");
// //     setEmail("");
// //     setPassword("");
// //     console.log(result);
// //     localStorage.setItem("user", JSON.stringify(result));
// //     alert("Registration successful");
// //     navigate("/");
// //   };

// //   return (
// //     <div className="min-h-screen overflow-hidden bg-gray-100 flex items-center justify-center px-4">
// //       <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
// //         <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
// //           Create Account
// //         </h2>
// //         <form className="space-y-4">
// //           {/* Name */}
// //           <input
// //             type="text"
// //             name="name"
// //             placeholder="Name"
// //             className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
// //             value={name}
// //             onChange={(e) => setName(e.target.value)}
// //           />

// //           {/* Email */}
// //           <input
// //             type="email"
// //             name="email"
// //             placeholder="Email"
// //             className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //           />

// //           {/* Password */}
// //           <input
// //             type="password"
// //             name="password"
// //             placeholder="Password"
// //             className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //           />

// //           {/* Submit */}
// //           <button
// //             type="submit"
// //             className="w-full py-2 rounded text-white font-semibold cursor-pointer bg-lime-500 hover:bg-lime-600"
// //             onClick={collectData}
// //           >
// //             Sign Up
// //           </button>
// //         </form>

// //         {/* OAuth Buttons */}
// //         {/* <div className="mt-6 space-y-2">
// //           <div className="text-center text-gray-500 text-sm">
// //             or sign up with
// //           </div>
// //           <button className="flex items-center justify-center gap-2 w-full border px-4 py-2 rounded hover:bg-gray-100">
// //             <img
// //               src="https://www.svgrepo.com/show/475656/google-color.svg"
// //               alt="Google"
// //               className="w-5 h-5"
// //             />
// //             Google
// //           </button>
// //           <button className="flex items-center justify-center gap-2 w-full border px-4 py-2 rounded hover:bg-gray-100">
// //             <img
// //               src="https://www.svgrepo.com/show/157810/facebook.svg"
// //               alt="Facebook"
// //               className="w-5 h-5"
// //             />
// //             Facebook
// //           </button>
// //         </div> */}

// //         {/* Login redirect */}
// //         {/* <p className="text-center text-sm text-gray-600 mt-4">
// //           Already have an account?{" "}
// //           <span
// //             // onClick={() => navigate("/")}
// //             className="text-blue-500 hover:underline cursor-pointer"
// //           >
// //             Login here
// //           </span>
// //         </p> */}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SignUp;

// // import React, { useState } from "react";
// // import { useFormik, FormikHelpers } from "formik";
// // import * as Yup from "yup";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // // type RegisterFormValues = {
// // //   name: string;
// // //   email: string;
// // //   password: string;
// // // };

// // // Helper to calculate password strength
// // const getPasswordStrength = (password) => {
// //   if (password.length < 6) return "Weak";
// //   if (/[A-Z]/.test(password) && /\d/.test(password) && password.length >= 8)
// //     return "Strong";
// //   return "Medium";
// // };

// // const RegisterPage = () => {
// //   const navigate = useNavigate();
// //   const [passwordStrength, setPasswordStrength] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const formik = useFormik({
// //     initialValues: {
// //       name: "",
// //       email: "",
// //       password: "",
// //     },
// //     validationSchema: Yup.object({
// //       name: Yup.string().required("Name is required"),
// //       email: Yup.string().email("Invalid email").required("Email is required"),
// //       password: Yup.string()
// //         .min(6, "Password must be at least 6 characters")
// //         .required("Password is required"),
// //     }),
// //     onSubmit: async (values, { setSubmitting }) => {
// //       setLoading(true);
// //       try {
// //         await axios.post("http://localhost:5000/api/auth/register", values);
// //         toast.success("Registration successful! Redirecting...");
// //         setTimeout(() => navigate("/"), 2000);
// //       } catch (err) {
// //         toast.error(err.response?.data?.message || "Registration failed.");
// //       } finally {
// //         setSubmitting(false);
// //         setLoading(false);
// //       }
// //     },
// //   });

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
// //       <ToastContainer position="top-center" />
// //       <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
// //         <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
// //           Create Account
// //         </h2>
// //         <form onSubmit={formik.handleSubmit} className="space-y-4">
// //           {/* Name */}
// //           <input
// //             type="text"
// //             name="name"
// //             placeholder="Name"
// //             className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
// //             onChange={formik.handleChange}
// //             onBlur={formik.handleBlur}
// //             value={formik.values.name}
// //           />
// //           {formik.touched.name && formik.errors.name && (
// //             <p className="text-red-500 text-sm">{formik.errors.name}</p>
// //           )}

// //           {/* Email */}
// //           <input
// //             type="email"
// //             name="email"
// //             placeholder="Email"
// //             className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
// //             onChange={formik.handleChange}
// //             onBlur={formik.handleBlur}
// //             value={formik.values.email}
// //           />
// //           {formik.touched.email && formik.errors.email && (
// //             <p className="text-red-500 text-sm">{formik.errors.email}</p>
// //           )}

// //           {/* Password */}
// //           <input
// //             type="password"
// //             name="password"
// //             placeholder="Password"
// //             className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
// //             onChange={(e) => {
// //               formik.handleChange(e);
// //               const value = e.target.value;
// //               setPasswordStrength(value ? getPasswordStrength(value) : "");
// //             }}
// //             onBlur={formik.handleBlur}
// //             value={formik.values.password}
// //           />
// //           {formik.touched.password && formik.errors.password && (
// //             <p className="text-red-500 text-sm">{formik.errors.password}</p>
// //           )}

// //           {/* Password Strength */}
// //           {formik.values.password && (
// //             <div className="text-sm font-medium mt-1">
// //               Password strength:
// //               <span
// //                 className={`ml-2 font-bold ${
// //                   passwordStrength === "Strong"
// //                     ? "text-green-600"
// //                     : passwordStrength === "Medium"
// //                     ? "text-yellow-500"
// //                     : "text-red-500"
// //                 }`}
// //               >
// //                 {passwordStrength}
// //               </span>
// //             </div>
// //           )}

// //           {/* Submit */}
// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className={`w-full py-2 rounded text-white font-semibold ${
// //               loading
// //                 ? "bg-green-400 cursor-not-allowed"
// //                 : "bg-green-500 hover:bg-green-600"
// //             }`}
// //           >
// //             {loading ? "Registering..." : "Register"}
// //           </button>
// //         </form>

// //         {/* OAuth Buttons */}
// //         <div className="mt-6 space-y-2">
// //           <div className="text-center text-gray-500 text-sm">
// //             or sign up with
// //           </div>
// //           <button className="flex items-center justify-center gap-2 w-full border px-4 py-2 rounded hover:bg-gray-100">
// //             <img
// //               src="https://www.svgrepo.com/show/475656/google-color.svg"
// //               alt="Google"
// //               className="w-5 h-5"
// //             />
// //             Sign up with Google
// //           </button>
// //           <button className="flex items-center justify-center gap-2 w-full border px-4 py-2 rounded hover:bg-gray-100">
// //             <img
// //               src="https://www.svgrepo.com/show/157810/facebook.svg"
// //               alt="Facebook"
// //               className="w-5 h-5"
// //             />
// //             Sign up with Facebook
// //           </button>
// //         </div>

// //         {/* Login redirect */}
// //         <p className="text-center text-sm text-gray-600 mt-4">
// //           Already have an account?{" "}
// //           <span
// //             onClick={() => navigate("/")}
// //             className="text-blue-500 hover:underline cursor-pointer"
// //           >
// //             Login here
// //           </span>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default RegisterPage;
