import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleProfile = () => {
    if (user?._id) {
      navigate(`/profile/${user._id}`);
    } else {
      console.error("User ID is undefined");
    }
  };

  // Close dropdown when clicking outside
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
    <nav className="bg-gradient-to-br from-cyan-200 to-gray-300 shadow px-4 py-3 flex items-center justify-between">
      <Link
        to="/"
        className="text-xl font-bold text-indigo-600 flex items-center space-x-2"
      >
        <img
          src="https://img.icons8.com/?size=100&id=DqL6HmxuqMzX&format=png&color=000000"
          alt="Logo"
          className="w-10 h-10"
        />
        <span>Excel Analytics</span>
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
            {user?.isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/all-users"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  All Users
                </Link>
              </>
            ) : (
              <>
                {/* Regular User Links */}
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
              </>
            )}

            {/* Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md transition"
              >
                <div className="w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full rounded-full"
                    />
                  ) : user?.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    user?.email.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 hover:text-indigo-600 hover:underline">
                  {user?.name.toUpperCase() || user?.email.toUpperCase()}
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
                  {!user?.isAdmin && (
                    <button
                      onClick={handleProfile}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                  )}
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
