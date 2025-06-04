// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import Navbar from "./components/Navbar";

// import Home from "./pages/HomePage";

// import DashBoard from "./pages/DashBoard";
// import UploadHistory from "./pages/UploadHistory";
// import UploadPage from "./pages/UploadPage";
// import ChartPage from "./pages/ChartPage";
// import AdminPanel from "./pages/AdminPanel";
// import Footer from "./components/Footer";

// function App() {
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <BrowserRouter>
//         {/* <Navbar /> */}
//         <main className="flex-grow">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route
//               path="/login"
//               element={
//                 isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
//               }
//             />
//             <Route path="/register" element={<RegisterPage />} />
//             <Route
//               path="/dashboard"
//               element={isAuthenticated ? <DashBoard /> : <Navigate to="/" />}
//             />
//             <Route
//               path="/uploadhistory"
//               element={
//                 isAuthenticated ? <UploadHistory /> : <Navigate to="/" />
//               }
//             />
//             <Route
//               path="/upload"
//               element={isAuthenticated ? <UploadPage /> : <Navigate to="/" />}
//             />
//             <Route
//               path="/chart"
//               element={isAuthenticated ? <ChartPage /> : <Navigate to="/" />}
//             />
//             <Route path="/admin" element={<AdminPanel />} />
//           </Routes>
//         </main>
//         {/* <Footer /> */}
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;



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
import AdminPanel from "./pages/AdminPanel";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {/* Navbar always visible */}
        <Navbar isAuthenticated={isAuthenticated} />

        {/* Main page content */}
        <main className="flex-grow">
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

            {/* Optional: Protect admin route or manage with role-based logic */}
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        {/* Footer always visible */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
