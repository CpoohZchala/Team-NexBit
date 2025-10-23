import { Link } from "react-router-dom";
import companyLogo from "../../../assets/photos/logo.png"; // Update the path to your company logo
import backgroundVideo from "../../../assets/video/company.mp4"; // Update the path to your background video

function DashboardContent() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Company Logo */}
        <img src={companyLogo} alt="Company Logo" className="w-75 h-64 mb-8" />

        {/* Welcome Message */}
        <h1 className="text-4xl font-bold mb-4 text-red-500 uppercase">
          Welcome, <span className="text-white">Admin!</span>
        </h1>

        {/* Get In Button */}
        <Link to="/login">
          <button className="px-6 py-3 bg- text-white text-lg font-semibold rounded-md hover:bg-secondary-color transition duration-300">
            Get In
          </button>
        </Link>
      </div>
    </div>
  );
}

export default DashboardContent;
