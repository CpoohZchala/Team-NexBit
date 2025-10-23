import { useState } from "react";
import logo from "../assets/photos/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-10">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="h-10" />
        </div>

        <div
          className={`navbar-links flex space-x-4 ${
            isMenuOpen ? "block" : "hidden"
          } md:flex`}
        >
          <Link to="/" className="text-gray-700 hover:text-blue-500">
            HOME
          </Link>
          {token && (
            <Link to="/bookings" className="text-gray-700 hover:text-blue-500">
              BOOKINGS
            </Link>
          )}
          <Link to="/servicepage" className="text-gray-700 hover:text-blue-500">
            SERVICES
          </Link>
          <Link to="/offerpage" className="text-gray-700 hover:text-blue-500">
            OFFERS
          </Link>
          {token && (
            <Link to="/store" className="text-gray-700 hover:text-blue-500">
              STORE
            </Link>
          )}
          {token && (
            <Link to="/contactus" className="text-gray-700 hover:text-blue-500">
              CONTACT
            </Link>
          )}
        </div>

        <div className="navbar-menu md:hidden" onClick={toggleMenu}>
          <div className={`menu-icon ${isMenuOpen ? "open" : ""}`}>
            <div className="bar1 bg-gray-700"></div>
            <div className="bar2 bg-gray-700"></div>
            <div className="bar3 bg-gray-700"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
