import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Pages
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashBoard from "./pages/DashBoard";
import UploadHistory from "./pages/UploadHistory";
import UploadPage from "./pages/UploadPage";
import ChartPage from "./pages/ChartPage";
import AllUsersPage from "./pages/Admin/AllUsersPage";
import ProfilePage from "./pages/ProfilePage";
import SetPasswordPage from "./pages/SetPasswordPage";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRouteAdmin from "./admin/PrivateRouteAdmin";
import AdminPanel from "./admin/AdminPanel";
import AIPage from "./pages/AIPage";
import GoogleCallback from "./pages/GoogleCallback";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const user = useSelector((state) => state.auth.user);

  const ProtectedDashboard = () => {
    if (!isAuthenticated) return <Navigate to="/login" />;

    if (user?.isGoogleUser && !user?.password) {
      return <Navigate to="/set-password" />;
    }

    //  if (!user?.password) return <Navigate to="/set-password" />;

    return <DashBoard />;
  };

  return (
    <GoogleOAuthProvider clientId="521672164776-2kgs8nad06kgu3kp8undg3vo9bbsuc0c.apps.googleusercontent.com">
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          {/* Navbar always visible */}
          <Navbar isAuthenticated={isAuthenticated} />

          {/* Main page content */}
          <main className="flex-grow bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route
                path="/login"
                element={
                  isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
                }
              />
              <Route
                path="/register"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <RegisterPage />
                  )
                }
              />

              <Route path="/dashboard" element={<ProtectedDashboard />} />

              <Route path="/google/callback" element={<GoogleCallback />} />

              <Route
                path="/set-password"
                element={
                  isAuthenticated ? (
                    <SetPasswordPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* <Route
                path="/dashboard"
                element={isAuthenticated ? <DashBoard /> : <Navigate to="/" />}
              /> */}

              <Route
                path="/uploadhistory"
                element={
                  isAuthenticated ? <UploadHistory /> : <Navigate to="/" />
                }
              />
              <Route
                path="/upload"
                element={isAuthenticated ? <UploadPage /> : <Navigate to="/" />}
              />
              <Route
                path="/chart"
                element={isAuthenticated ? <ChartPage /> : <Navigate to="/" />}
              />

              <Route
                path="/insights/:id"
                element={
                  isAuthenticated ? <AIPage /> : <Navigate to="/login" />
                }
              />

              <Route path="/profile/:id" element={<ProfilePage />} />

              <Route
                path="/admin"
                element={
                  <PrivateRouteAdmin>
                    <AdminPanel />
                  </PrivateRouteAdmin>
                }
              />
              <Route
                path="/all-users"
                element={
                  <PrivateRouteAdmin>
                    <AllUsersPage />
                  </PrivateRouteAdmin>
                }
              />
            </Routes>
          </main>

          {/* Footer always visible */}
          <Footer />
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
