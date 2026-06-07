import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { removeToken, getToken } from "../api";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  if (!isLoggedIn) return null; // Don't show on login/register pages

  return (
    <nav
      className="bg-indigo-700 text-white px-6 py-3 flex justify-between items-center 
shadow-md"
    >
      <Link
        to="/home"
        className="text-xl font-bold tracking-wide hover:text-indigo-200"
      >
        UserManager
      </Link>
      <div className="flex gap-4 items-center">
        <Link to="/home" className="hover:text-indigo-200 font-medium">
          Home
        </Link>
        <Link to="/profile" className="hover:text-indigo-200 font-medium">
          Profile
        </Link>
        <Link to="/admin" className="hover:text-indigo-200 font-medium">
          Admin
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg font-semibold 
text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
