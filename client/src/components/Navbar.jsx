// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../redux/slices/authSlice";
// import { Menu, X } from "lucide-react";

// const Navbar = () => {
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const user = useSelector((state) => state.auth.user);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   return (
//     <nav className="fixed w-full top-0 left-0 bg-blue-600 text-white p-4 shadow-md z-50">
//       <div className="container mx-auto flex justify-between items-center px-4 md:px-12">
//         <div className="text-xl font-bold">Excel Analytics</div>

//         <button
//           className="md:hidden text-white"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           {menuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>

//         <div className="hidden md:flex space-x-6 items-center">
//           {isAuthenticated ? (
//             <>
//               <Link to="/dashboard" className="hover:underline">
//                 Dashboard
//               </Link>
//               <Link to="/uploadhistory" className="hover:underline">
//                 Upload History
//               </Link>
//               <Link to="/upload" className="hover:underline">
//                 Upload
//               </Link>
//               <Link to="/chart" className="hover:underline">
//                 Charts
//               </Link>
//               {user?.isAdmin && (
//                 <Link to="/admin" className="hover:underline text-yellow-300">
//                   Admin Panel
//                 </Link>
//               )}
//               <button onClick={handleLogout} className="hover:underline">
//                 Logout ({user?.name})
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="hover:underline">
//                 Login
//               </Link>
//               <Link to="/register" className="hover:underline">
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>

//       {menuOpen && (
//         <div className="md:hidden px-6 pt-4 pb-6 space-y-4">
//           {isAuthenticated ? (
//             <>
//               <Link
//                 to="/dashboard"
//                 onClick={() => setMenuOpen(false)}
//                 className="block hover:underline"
//               >
//                 Dashboard
//               </Link>
//               <Link
//                 to="/upload"
//                 onClick={() => setMenuOpen(false)}
//                 className="block hover:underline"
//               >
//                 Upload
//               </Link>
//               <Link
//                 to="/chart"
//                 onClick={() => setMenuOpen(false)}
//                 className="block hover:underline"
//               >
//                 Charts
//               </Link>
//               {user?.isAdmin && (
//                 <Link
//                   to="/admin"
//                   onClick={() => setMenuOpen(false)}
//                   className="block hover:underline text-yellow-300"
//                 >
//                   Admin Panel
//                 </Link>
//               )}
//               <button
//                 onClick={() => {
//                   handleLogout();
//                   setMenuOpen(false);
//                 }}
//                 className="block hover:underline"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/"
//                 onClick={() => setMenuOpen(false)}
//                 className="block hover:underline"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 onClick={() => setMenuOpen(false)}
//                 className="block hover:underline"
//               >
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

// import React from "react";
// import { Link } from "react-router-dom";

// const Navbar = ({ isAuthenticated }) => {
//   return (
//     <nav className="bg-white shadow px-4 py-3 flex items-center justify-between">
//       <Link to="/" className="text-xl font-bold text-indigo-600">
//         Excel Analytics
//       </Link>

//       <div className="space-x-4">
//         <Link
//           to="/"
//           className="text-gray-700 hover:text-indigo-600 font-medium transition"
//         >
//           Home
//         </Link>

//         {isAuthenticated ? (
//           <>
//             <Link
//               to="/dashboard"
//               className="text-gray-700 hover:text-indigo-600 font-medium transition"
//             >
//               Dashboard
//             </Link>
//             <button
//               onClick={() => console.log("Logout triggered")}
//               className="text-red-500 hover:text-red-600 font-medium"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link
//               to="/login"
//               className="text-gray-700 hover:text-indigo-600 font-medium"
//             >
//               Login
//             </Link>
//             <Link
//               to="/register"
//               className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
//             >
//               Register
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Navbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        Excel Analytics
      </Link>

      <div className="space-x-4 flex items-center">
        <Link
          to="/"
          className="text-gray-700 hover:text-indigo-600 font-medium"
        >
          Home
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/upload"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Upload
            </Link>
            <Link
              to="/uploadhistory"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              History
            </Link>
            <Link
              to="/chart"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Charts
            </Link>

            {/* Avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md transition"
              >
                <div className="w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : user?.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || user?.email}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-2 border border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

