import { useState } from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/photos/logo.png";
import "./ADashboard.css";

const ASideBar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Apply theme to body
    document.body.classList.toggle('dark-theme');
  };

  // Helper to provide classes to NavLink.
  const navLinkClass = ({ isActive }) =>
    `flex items-center justify-center w-[100%] p-3 m-2
      bg-gradient-to-r from-slate-50 to-blue-500
      text-[#204a64] font-medium
      rounded-lg shadow-sm
      border border-slate-200
      transition-all duration-300
      hover:shadow-md hover:scale-[1.02]
      ${isActive ? 'text-white font-bold' : 'hover:bg-gradient-to-r hover:from-emerald-500 hover:to-green-600 hover:text-white'}`;

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        // Clear any other user-related data
        navigate("/login", { replace: true });

        // Prevent back navigation after logout
        try {
          window.history.pushState(null, '', window.location.href);
          window.addEventListener('popstate', function () {
            window.history.pushState(null, '', window.location.href);
          });
        } catch (e) {
          console.error("Error setting up popstate handler:", e);
        }
      }
    });
  };

  return (
    <div className="Admin-sidebar fixed flex-2">
      <div className="flex flex-col justify-center items-center h-[100%] w-[100%] relative">
        <div className="mt-2 absolute top-0">
          <img src={logo} alt="logo" className="w-[200px] h-[200px]" />
        </div>
        <div className="flex flex-col justify-center items-center mt-[200px] uppercase text-[16px] font-bold">
          <NavLink to="/admin/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/managebooking" className={navLinkClass}>
            Manage Booking
          </NavLink>
          <NavLink to="/admin/inventory" className={navLinkClass}>
            Store
          </NavLink>
          <button
            className="flex items-center justify-center w-[100%] p-3 m-2
              bg-gradient-to-r from-slate-50 to-blue-500
              text-[#204a64] font-medium uppercase
              rounded-lg shadow-sm
              border border-slate-200
              transition-all duration-300
              hover:shadow-md hover:scale-[1.02]
              hover:bg-gradient-to-r hover:from-emerald-500 hover:to-green-600
              hover:text-white"
          >
            Setting
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-[100%] p-3 m-2
              bg-gradient-to-r from-slate-50 to-blue-500
              text-[#204a64] font-medium
              rounded-lg shadow-sm
              border border-slate-200
              transition-all duration-300
              hover:shadow-md hover:scale-[1.02]
              hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600
              hover:text-white"
          >
            Log Out
          </button>
        </div>
        <div 
  onClick={toggleTheme}
  className="flex items-center gap-2 p-2 cursor-pointer rounded-full
    bg-gradient-to-r from-slate-100 to-slate-200
    dark:from-slate-700 dark:to-slate-800
    transition-all duration-300 hover:scale-105"
>
  <div className={`theme-toggle w-12 h-6 rounded-full relative
    ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}
    transition-colors duration-300`}
  >
    <div className={`absolute w-5 h-5 rounded-full top-0.5 
      transition-all duration-300 transform
      ${isDarkMode ? 'right-0.5 bg-slate-100' : 'left-0.5 bg-white'}
      shadow-md`}
    />
  </div>
</div>
      </div>
    </div>
  );
};

export default ASideBar;
