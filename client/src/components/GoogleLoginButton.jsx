import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthData } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        // Send the code to backend
        const res = await axios.post("http://localhost:5001/auth/google", {
          code: authResult.code,
        });

        const { token, user } = res.data;

        // Set auth data in Redux and localStorage
        dispatch(setAuthData({ token, user }));

        // Redirect based on role
        if (user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  const googlelogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <button
      className="flex items-center justify-center gap-2 w-full border px-4 py-2 rounded hover:bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200"
      onClick={googlelogin}
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />
      Google
    </button>
  );
};

export default GoogleLoginButton;
