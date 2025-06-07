import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashBoard from "./pages/DashBoard";
import UploadHistory from "./pages/UploadHistory";
import UploadPage from "./pages/UploadPage";
import ChartPage from "./pages/ChartPage";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRouteAdmin from "./admin/PrivateRouteAdmin";
import AdminPanel from "./admin/AdminPanel";
import AllUsersPage from "./pages/Admin/AllUsersPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
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

            <Route
              path="/dashboard"
              element={isAuthenticated ? <DashBoard /> : <Navigate to="/" />}
            />
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
  );
}

export default App;
