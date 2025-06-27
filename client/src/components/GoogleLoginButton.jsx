// import React from "react";
// import { useGoogleLogin } from "@react-oauth/google";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setAuthData } from "../redux/slices/authSlice";
// import { useNavigate } from "react-router-dom";

// const GoogleLoginButton = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const responseGoogle = async (authResult) => {
//     try {
//       if (authResult.code) {
//         // Send the code to backend
//         // const res = await axios.post("http://localhost:5001/auth/google", {
//         const res = await axios.post(
//           "https://excel-analytics-platform-backend-qnaz.onrender.com/auth/google",
//           {
//             code: authResult.code,
//           }
//         );

//         const { token, user } = res.data;

//         // Set auth data in Redux and localStorage
//         dispatch(setAuthData({ token, user }));

//         // Redirect based on role
//         if (user.isAdmin) {
//           navigate("/admin");
//         } else {
//           navigate("/dashboard");
//         }
//       }
//     } catch (err) {
//       console.error("Google login failed", err);
//     }
//   };

//   const googlelogin = useGoogleLogin({
//     onSuccess: responseGoogle,
//     onError: responseGoogle,
//     flow: "auth-code",
//   });

//   return (
//     <button
//       className="flex items-center justify-center gap-2 w-full border px-4 py-2 rounded hover:bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200"
//       onClick={googlelogin}
//     >
//       <img
//         src="https://www.svgrepo.com/show/475656/google-color.svg"
//         alt="Google"
//         className="w-5 h-5"
//       />
//       Google
//     </button>
//   );
// };

// export default GoogleLoginButton;


import React from "react";
import { useDispatch } from "react-redux";
import { setAuthData } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri =
      "https://excel-analytics-platform-frontend-7gp4.onrender.com/google/callback";

    const scope = "profile email";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

    const popup = window.open(authUrl, "_blank", "width=500,height=600");

    const listener = async (event) => {
      if (
        event.origin !==
        "https://excel-analytics-platform-frontend-7gp4.onrender.com"
      )
        return;
      if (!event.data.code) return;

      popup?.close();
      window.removeEventListener("message", listener);

      try {
        const res = await axios.post(
          "https://excel-analytics-platform-backend-qnaz.onrender.com/auth/google",
          {
            code: event.data.code,
          }
        );

        const { token, user } = res.data;
        dispatch(setAuthData({ token, user }));

        if (user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Google login failed", err);
        alert("Google login failed.");
      }
    };

    window.addEventListener("message", listener);
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
