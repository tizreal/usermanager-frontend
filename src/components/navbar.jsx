import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { removeToken, getToken } from "../api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!getToken();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  if (!isLoggedIn) return null;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
        location.pathname === to
          ? "bg-white/20 text-white"
          : "text-indigo-100 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 h-14 bg-indigo-700 text-white px-3 sm:px-6 flex justify-between items-center shadow-md">
      <Link to="/home" className="text-base sm:text-xl font-bold tracking-wide hover:text-indigo-200 flex-shrink-0">
        UserManager
      </Link>
      <div className="flex gap-1 sm:gap-2 items-center">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        <button
          onClick={handleLogout}
          className="ml-1 sm:ml-2 bg-red-500 hover:bg-red-600 px-2 sm:px-4 py-1.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
