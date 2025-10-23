import { useEffect, useState } from "react";
import { FileText, ArrowUp } from "lucide-react";
import "./HomePage.css";
import Logo from "../assets/photos/logo.png";
import ImageA from "../assets/photos/A.png";
import ImageB from "../assets/photos/B.png";
import ImageC from "../assets/photos/C.png";
import ImageD from "../assets/photos/D.png";
import ImageE from "../assets/photos/E.png";
import ImageF from "../assets/photos/F.png";
import ImageH from "../assets/photos/H.png";
import ImageG from "../assets/photos/G.png";
import facebook_icon from "../assets/icons/facebook_icon.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { IoNotificationsSharp } from "react-icons/io5";
import Address from "../assets/icons/Address.png";
import RingerVolume from "../assets/icons/RingerVolume.png";
import google_icon from "../assets/icons/google_icon.png";
import x from "../assets/icons/x.png";
import insta from "../assets/icons/insta.png";
import Swal from "sweetalert2";
import UserModal from "../components/UserModal";
import { FaArrowRightFromBracket } from "react-icons/fa6";
// import ServicesDropdown from "../components/ServiceDropdown";
import ChatButton from "../components/ChatButton";
import ChatModal from "../components/ChatModal";

const HomePage = () => {
  const { user, setUser, fetchUser } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [notification, setNotification] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    message: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // useEffect(() => {
  //   const role = localStorage.getItem("userRole");
  //   if (!role) {
  //     window.location.href = "/login";
  //   } else if (role === "admin") {
  //     window.location.href = "/admin/dashboard";
  //   } else if (role === "mechanic") {
  //     window.location.href = "/mdashboard";
  //   }
  //   }, []);

  useEffect(() => {
    if (user == null) {
      fetchUser();
    }

    const getNotifications = async () => {
      if (user) {
        const response = await fetch(
          `http://localhost:3000/api/notification/getNotification/${user._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        setNotification(result.data.reverse());
        if (!response.ok) {
          console.error("Error: " + result.error);
        }
      }
    };

    getNotifications();
  }, [user, fetchUser]); // Added user as a dependency

  const getBookingById = async (bookingId) => {
    setBookingDetails();
    if (user) {
      const response = await fetch(
        `http://localhost:3000/api/booking/${bookingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setShowBookingModal(true);
        setShowModal(false);
        setBookingDetails(data.data);
      } else {
        console.error("Error: " + data.error);
      }
    }
  };

  //handle feedback form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok) {
      Swal.fire({
        title: "Noted 😊",
        text: "Thank you for your feedback.",
        icon: "success",
        confirmButtonText: "Awesome",
      });
      setFormData({ name: "", number: "", message: "" }); // Reset form after submission
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error: ${data.error}`, // Display the dynamic error message
        confirmButtonText: "OK",
      });
    }
  };

  const handleSignup = () => navigate("/signupoption");
  const handleLogin = () => navigate("/login");
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
        // If the user clicked 'Yes, logout!'
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.clear();
        navigate("/");
        setUser(null);
      }
    });
  };

  const toggleBookingModal = () => setShowBookingModal(!showBookingModal);
  const toggleModal = () => setShowModal(!showModal);

  const handleNotificationClick = (bookingId) => {
    getBookingById(bookingId);
  };

  return (
    <>
      {showBookingModal && (
        <UserModal
          bookingDetails={bookingDetails}
          toggleModal={toggleBookingModal}
          showModal={showBookingModal}
        />
      )}
      <div className="home-page">
        {/* Header */}
        <header className="header px-4 sm:px-10 lg:px-20">
          <div className="flex w-full justify-between items-center">
            <img
              className="Logo"
              src={Logo}
              style={{ width: "90px", height: "70px" }}
              alt="Logo"
            />
            <nav className="nav-menu">
              <div className="nav-links">
                <Link to="/">HOME</Link>
                {token && <Link to="/bookings">BOOKINGS</Link>}
                {token && <Link to="/contact">CONTACT</Link>}
                <Link to="/servicepage">SERVICES</Link>
                <Link to="/offerpage">OFFERS</Link>
                {token && <Link to="/store">STORE</Link>}
                {token ? (
                  <>
                    <button
                      className="hover:bg-transparent notification-btn"
                      onClick={toggleModal}
                    >
                      <IoNotificationsSharp size={20} />
                    </button>
                    {showModal && (
                      <div className="notification-modal z-[10000]">
                        <button
                          className="absolute bg-gray-200 h-[30px] w-[30px] top-[5px] right-[5px] text-black rounded-2xl text-[20px]"
                          onClick={toggleModal}
                        >
                          &times;
                        </button>
                        {notification.map((note, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleNotificationClick(note.bookingId)
                            }
                            className="notification-content"
                          >
                            <h5>{note.topic}</h5>
                            <p>{note.message}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      className="btn text-white px-3 w-[100px] rounded hover:bg-blue-700 h-[40px] bg-primary"
                      onClick={handleLogout}
                    >
                      LOGOUT
                    </button>
                  </>
                ) : (
                  <button
                    className="sign-up-btn1 px-4 py-1 rounded hover:bg-blue-700"
                    onClick={handleSignup}
                  >
                    SIGN UP
                  </button>
                )}
              </div>
            </nav>
          </div>
        </header>
  
        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <section className="hero-section container mx-auto px-4 sm:px-10 lg:px-20">
            <div className="hero-content text-center mt-1 sm:text-left">
              <p className="text-[25px] sm:text-[40px] font-serif font-bold text-gray-500 mt-5">
                Welcome, {user ? user.fullname : "Guest"}!
              </p>
  
              <h1 className="text-[2.5rem] sm:text-[3rem] font-bold">
                <span className="text-primary">INNOVATIVE</span> VEHICLE
                <br />
                SERVICE <span className="text-primary">SOLUTIONS</span>
              </h1>
              <p className="text-gray-700 text-[20px] mt-4">
                REVOLUTIONIZING VEHICLE CARE: STREAMLINING
                <br />
                SERVICE CENTERS WITH AUTOMATED SOLUTIONS
              </p>
              <div className="hero-actions mt-8">
                {token ? (
                  <Link to="/ebservice">
                    <button className="book-btn px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center">
                      <FileText className="mr-2" />
                      BOOK NOW
                    </button>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center  sm:flex-row">
                    <Link
                      to="/signupoption"
                      className="sign-up-btn px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 mr-4"
                    >
                      SIGN UP
                    </Link>
                    <p className="px-5 mb-0 sm:mt-0">
                      or{" "}
                      <a
                        href="#"
                        className="text-blue-700 underline"
                        onClick={handleLogin}
                      >
                        CLICK HERE
                      </a>{" "}
                      to Log in
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-8 sm:mt-0">
              <img
                className="ImageA hidden sm:block"
                src={ImageA}
                style={{ width: "350px", height: "auto" }}
                alt="Hero"
              />
            </div>
          </section>
  
          {/* What We Do Section */}
          <section className="flex flex-col sm:flex-row justify-center items-center px-4 sm:px-10 lg:px-20">
            <div className="mechanic-image mb-4 sm:mb-0">
              <img
                className="ImageB"
                src={ImageB}
                style={{ width: "350px", height: "300px" }}
                alt="Mechanic"
              />
            </div>
            <div className="service-details text-center sm:text-left sm:ml-8">
              <h2
                className="text-4xl font-extrabold mb-1"
                style={{ color: "#13496b" }}
              >
                What we do?
              </h2>
              <p className="text-gray-700 mb-4">
                Streamlining vehicle service operations with smart solutions for
                efficiency and ease.
              </p>
              <ul className="service-list list-disc pl-5 text-gray-700">
                <li>🔧 Online Appointment Scheduling</li>
                <li>🔧 Automated Service Reminders</li>
                <li>🔧 Real-Time Service Tracking</li>
                <li>🔧 Digital Invoices & Payment</li>
                <li>🔧 Inventory & Parts Management</li>
                <li>🔧 Technician Assignment System</li>
              </ul>
              <div className="flex gap-2 items-center w-[180px] cursor-pointer mt-4">
                <h2 style={{ color: "#13496b" }} className="text-[24px]">
                  Contact Us
                </h2>
                <FaArrowRightFromBracket />
              </div>
            </div>
          </section>

          <div className="WheelSet hidden sm:block">
            <img
              className="ImageC"
              src={ImageC}
              style={{ width: "auto", height: "700px" }}
              alt="Wheel Set"
            />
          </div>

          {/* History Section */}
          <section className="history-section-container">
            <h2
              style={{ color: "#13496b" }}
              className="text-[48px] uppercase font-semibold text-3xl mt-20"
            >
              History
            </h2>
            <p className="history-text">
              Established in 2010, our vehicle service center began as a small
              family-owned garage with a passion for quality and customer care.
              Over the years, we have grown into a trusted name in vehicle
              maintenance and repair through dedicated customer relationships.
              Our journey has always been driven by innovation, ensuring we
              offer the latest technology and services to keep vehicles running
              smoothly. Today, we continue to uphold our commitment to
              excellence, providing fast, reliable, and professional service for
              every vehicle that comes through our doors.
            </p>
          </section>

          {/* Our Services Section */}
          <section className="p-5">
            <h2
              style={{ color: "#13496b" }}
              className="flex justify-center text-[48px] items-center uppercase font-semibold text-3xl mb-4 p-2"
            >
              Our Services
            </h2>

            <div className="flex flex-wrap justify-center px-3 space-x-4">
              {/* Service D */}
              <div
                className="service-card flex flex-col items-center justify-between w-[350px] h-[750px] p-4 bg-white rounded-lg shadow-md  mb-6"
                style={{ boxShadow: "0 0 10px 0 rgba(19, 73, 107, 0.6)" }}
              >
                <img
                  className="ImageD"
                  src={ImageD}
                  style={{ width: "350px", height: "300px" }}
                  alt="Service D"
                />
                <p
                  className="service-description text-center mt-auto text-[24px]"
                  style={{ color: "#13496b" }}
                >
                  ADMIN
                </p>
                <p>
                  our administrator can deliver several benefits to enhance your
                  experience: efficient task management ensures your service
                  requests are handled promptly; real-time monitoring of repairs
                  keeps you updated on your vehicle's status; direct
                  communication allows you to ask questions and receive timely
                  responses; insightful reports help improve our service
                  quality; convenient appointment scheduling fits your busy
                  life; and tracking your preferences allows us to personalize
                  our services just for you. Your satisfaction is our top
                  priority!
                </p>
              </div>

              {/* Service E */}
              <div
                style={{ boxShadow: "0 0 10px 0 rgba(19, 73, 107, 0.6)" }}
                className="service-card flex flex-col items-center justify-between w-[350px] h-[800px] p-4 bg-white rounded-lg shadow-xl mb-6"
              >
                <img
                  className="ImageE"
                  src={ImageE}
                  style={{ width: "350px", height: "300px" }}
                  alt="Service E"
                />
                <p
                  className="service-description text-center mt-auto text-[24px]"
                  style={{ color: "#13496b" }}
                >
                  CUSTOMER
                </p>
                <p>
                  As a valued customer, you can easily manage your vehicle
                  service needs through our web application. Effortlessly book
                  appointments for various services at your convenience and
                  track your vehicle’s repair status in real time. Stay informed
                  with instant notifications about service updates, special
                  promotions, and reminders. You can also request necessary
                  vehicle spare parts and access a comprehensive list of
                  services tailored to your vehicle. Additionally, communicate
                  directly with our team for any questions or concerns
                  throughout the service process. With these features, we aim to
                  provide you with a seamless and satisfying service experience!
                </p>
              </div>

              {/* Service F */}
              <div
                style={{ boxShadow: "0 0 10px 0 rgba(19, 73, 107, 0.6)" }}
                className="service-card flex flex-col items-center justify-between w-[350px] h-[780px] p-4 bg-white rounded-lg shadow-md mb-6"
              >
                <img
                  src={ImageF}
                  style={{ width: "350px", height: "300px" }}
                  alt="Service F"
                />
                <p
                  className="service-description text-center mt-auto text-[24px]"
                  style={{ color: "#13496b" }}
                >
                  MECHANIC
                </p>
                <p>
                  Through the web application, our mechanics play a crucial role
                  in enhancing your service experience. They handle repairs with
                  precision and can update you on the progress of your vehicle
                  in real time, ensuring you’re always informed about the status
                  of your service. Mechanics can also send instant notifications
                  regarding service completion, any additional repairs needed,
                  and estimated timelines, allowing you to stay in the loop.
                  Additionally, they can provide insights on vehicle
                  maintenance, answer your questions, and ensure timely
                  completion of all services, ultimately delivering a smooth and
                  satisfactory experience for you.
                </p>
              </div>
            </div>
          </section>
          <div className="relative  hidden sm:block">
            <div className="absolute h-[800px] w-[400px] top-[-450px] ">
              <img src={ImageH} alt="Service H" className="h-[800px]" />
            </div>
          </div>

          <button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp />
          </button>

          {/*Chat Button*/}
          <div>
            <ChatButton onClick={handleButtonClick} />
            <ChatModal isOpen={isModalOpen} onClose={handleCloseModal} />
          </div>

          {/* Feedback Section */}
        </main>
        <div className="relative">
          <div className="py-[70px]">
            <div className="w-full flex flex-col sm:flex-row justify-center items-center bg-transparent relative z-[1]">
              <div
                style={{ boxShadow: "0 0 20px 0 rgba(19, 73, 107, 0.2)" }}
                className="bg-white bg-opacity-40 shadow-2xl rounded-3xl w-full sm:w-[60%] p-4 sm:p-[50px] "
              >
                <p
                  className="text-center underline text-[22px] sm:text-[26px] font-bold"
                  style={{ color: "#13496b" }}
                >
                  Need Help!
                </p>

                <div className="w-full flex justify-center">
                  <img
                    className="border-1 w-[250px] sm:w-[350px]"
                    src={ImageG}
                    alt="Service G"
                  />
                </div>

                <p className="text-center py-5 text-[14px] sm:text-[15px]">
                  We’re here to provide expert assistance every step of the way.
                  Whether you need guidance on services, help with scheduling,
                  or any other support, our dedicated team is ready to ensure
                  your experience is seamless and stress-free.
                </p>

                <div className="w-full flex flex-col sm:flex-row gap-8 items-center">
                  <div className="w-full sm:w-[50%] h-[400px] p-4 flex flex-col justify-center items-center rounded-[20px] text-white">
                    <div className="text-center mb-4">
                      <h3 className="font-bold bg-red-700 text-white rounded-2 mb-4">
                        OPENING HOURS
                      </h3>
                      <p className="text-left text-black">
                        Mon - Fri : 7 AM - 6 PM
                      </p>
                      <p className="text-left text-black">
                        Sat - Sun: 7 AM - 6 PM
                      </p>
                    </div>

                    <div className="flex items-center mb-4">
                      <img
                        src={Address}
                        alt="Address Icon"
                        className="w-6 h-6 mr-2 address_1"
                      />
                      <p className="text-black">Kandy road, Colombo - 10</p>
                    </div>

                    <div className="flex items-center mb-4">
                      <img
                        src={RingerVolume}
                        alt="Phone Icon"
                        className="w-6 h-6 mr-2"
                      />
                      <p className="text-black">0778353336 / 0771234567</p>
                    </div>

                    <div className="flex gap-3">
                      <div className="border border-black rounded bg-white cursor-pointer h p-[5px]">
                        <img
                          src={google_icon}
                          alt="Google Icon"
                          className="h-[30px]"
                        />
                      </div>
                      <div className="border border-black rounded bg-white cursor-pointer h p-[5px]">
                        <img
                          src={facebook_icon}
                          alt="Facebook Icon"
                          className="h-[30px]"
                        />
                      </div>
                      <div className="border border-black rounded bg-white cursor-pointer h p-[5px]">
                        <img
                          src={insta}
                          alt="Insta Icon"
                          className="h-[30px]"
                        />
                      </div>
                      <div className="border border-black rounded bg-white cursor-pointer h p-[5px]">
                        <img src={x} alt="X Icon" className="h-[30px]" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-[50%]">
                    <h2
                      className="text-black-300 text-xl sm:text-2xl mb-0 px-4 sm:px-8 font-bold"
                      style={{ color: "#13496b" }}
                    >
                      Feedback
                    </h2>
                    <form
                      onSubmit={handleSubmit}
                      className="feedback-form p-4 sm:p-8"
                    >
                      <input
                        className="mb-[30px] w-full h-[50px] p-4 border-2 border-blue-600"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Your Name"
                        required
                      />
                      <input
                        className="mb-[30px] w-full h-[50px] py-3 px-4 rounded-lg border-2 border-blue-600"
                        type="tel"
                        value={formData.number}
                        onChange={(e) =>
                          setFormData({ ...formData, number: e.target.value })
                        }
                        placeholder="Your Phone Number"
                        required
                      />
                      <textarea
                        className="mb-[30px] w-full h-[50px] py-3 px-4 rounded-lg border-2 border-blue-600"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Your Feedback"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-green-700 text-white w-full sm:w-[200px] rounded-lg p-[10px] hover:bg-green-900"
                      >
                        Submit Feedback
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="polygon-box absolute bottom-0 z-[0]"></div>
        </div>

        <footer className="footer flex justify-center items-center py-5 bg-gray-200">
          <p className="">&copy; 2024 AutoCare. All Rights Reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
