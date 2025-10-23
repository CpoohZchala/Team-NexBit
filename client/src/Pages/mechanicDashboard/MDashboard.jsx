// MDashboard.jsx file

import "./mdashboard.css";
import logo from "../../assets/photos/logo.png";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LuRefreshCw } from "react-icons/lu";
import MechanicModal from "./mechanicModal";

const Dashboard = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [allBookingCount, setAllBookingCount] = useState(0);
  const [acceptedBookingCount, setAcceptedCountBookingCount] = useState(0);
  const [pendingBookingCount, setPendingBookingCount] = useState(0);
  const [rejectedBookingCount, setRejectedBookingCount] = useState(0);
  const [completedBookingCount, setCompletedBookingCount] = useState(0);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const role = localStorage.getItem("userRole");
  //   if (!role) {
  //     window.location.href = "/login";
  //   } else if (role === "admin") {
  //     window.location.href = "/admin/dashboard";
  //   } else if (role === "user" )  {
  //     window.location.href = "/home";
  //   }
  //   }, []);

  useEffect(() => {
    fetchAllDetails();
  }, [user]);

  const fetchAllDetails = () => {
    localStorage.removeItem("bookingId");
    localStorage.removeItem("workItems");
    getAllNotification();
    getAllBookingDetails();
  };

  const getAllNotification = async () => {
    if (user) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/notification/getNotificationForMechanic/${user._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          setNotification(result.data.reverse());
        } else {
          console.error("Error: " + result.error);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  const getAllBookingDetails = async () => {
    if (user) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/bookingForMechanic/${user._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setBookingDetails(data.data);

          // Calculate counts based on booking status
          setAllBookingCount(data.data.length);
          const acceptedCount = data.data.filter(
            (booking) => booking.isAccepted === "accepted"
          ).length;
          const pendingCount = data.data.filter(
            (booking) => booking.isAccepted === "pending"
          ).length;
          const rejectedCount = data.data.filter(
            (booking) => booking.isAccepted === "rejected"
          ).length;
          const completedCount = data.data.filter(
            (booking) => booking.isAccepted === "completed"
          ).length;

          setAcceptedCountBookingCount(acceptedCount);
          setPendingBookingCount(pendingCount);
          setRejectedBookingCount(rejectedCount);
          setCompletedBookingCount(completedCount);
        } else {
          console.error("Error: " + data.error);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    }
  };

  const toggleModal = () => setShowModal(!showModal);

  const openNotificationPopup = () => {
    setShowModal(true);
    setShowBookingModal(false);
  };

  const handleNotificationClick = async (bookingId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/bookingById/${bookingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setBookingDetails(data.data);
        setShowModal(false);
        setShowBookingModal(true);
      } else {
        console.error("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
    }
  };

  const handlelogout = () => {
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
        navigate("/login");
      }
    });
  };

  const navigateToProfile = () => {
    navigate("/mprofile");
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    fetchAllDetails();
  };

  return (
    <>
      {showBookingModal && bookingDetails && (
        <MechanicModal
          bookingDetails={bookingDetails}
          toggleModal={closeBookingModal}
          showModal={showBookingModal}
        />
      )}
      <div className="dashboard-container">
        <aside className="flex flex-col justify-center items-center sidebar">
          <div className="m-2">
            <img src={logo} alt="AutoCare Logo" className="w-[200px]" />
          </div>
          <nav className="menu flex justify-center items-center p-4">
            <ul>
              <li className="relative">
                <button onClick={openNotificationPopup}>Notification</button>
                {showModal && (
                  <div className="notification-modal2 absolute top-[-100px] right-[-150px] bg-white rounded-lg shadow-lg w-[250px] px-2 z-[10]">
                    <span
                      className="close bg-black h-[40px] px-2"
                      onClick={toggleModal}
                    >
                      &times;
                    </span>
                    {notification.map((note, index) => {
                      const matchedBooking = bookingDetails.find(
                        (booking) => booking._id === note.bookingId
                      );

                      return (
                        <div
                          key={index}
                          onClick={() =>
                            handleNotificationClick(note.bookingId)
                          }
                          className="max-w-sm w-full lg:max-w-full lg:flex bg-gray-100 shadow-md rounded-lg overflow-hidden my-2 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="px-3 flex flex-col leading-normal">
                            <div className="flex w-[100%] justify-between items-center">
                              <h2 className="text-gray-900 font-bold text-md">
                                {note.topic}
                              </h2>

                              {matchedBooking &&
                                matchedBooking.isAccepted === "pending" && (
                                  <span className="w-[10px] h-[10px] bg-yellow-600 rounded-full"></span>
                                )}
                              {matchedBooking &&
                                matchedBooking.isAccepted === "accepted" && (
                                  <span className="w-[10px] h-[10px] bg-blue-600 rounded-full"></span>
                                )}
                              {matchedBooking &&
                                matchedBooking.isAccepted === "rejected" && (
                                  <span className="w-[10px] h-[10px] bg-red-600 rounded-full"></span>
                                )}
                              {matchedBooking &&
                                matchedBooking.isAccepted === "completed" && (
                                  <span className="w-[10px] h-[10px] bg-green-600 rounded-full"></span>
                                )}

                              {/* In case there's no matching booking, handle it if necessary */}
                              {!matchedBooking && (
                                <span className="w-[10px] h-[10px] bg-gray-400 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-gray-700 text-base">
                              From: {note.recieverId.fullname}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </li>
              <li>
                <button onClick={ToggleEvent}>Settings</button>
              </li>
              <li>
                <button onClick={navigateToProfile}>Profile</button>
              </li>
              <li>
                <button onClick={handlelogout}>Log Out</button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="dashboard">
          <div className="flex w-[100%] justify-between items-center">
            {user && (
              <h1 className="my-4 font-semibold text-[24px] uppercase">
                Dashboard -{" "}
                {user.userRole === "user"
                  ? user.fullname
                  : `${user.firstname} ${user.lastname}`}
              </h1>
            )}

            <button
              onClick={fetchAllDetails}
              className="w-[40px] h-[30px] mb-2 rounded-md shadow-md bg-gray-300 hover:bg-gray-500 hover:text-gray-100 flex justify-center items-center"
            >
              <LuRefreshCw />
            </button>
          </div>
          <div className="work-grid">
            {/* Pending works style */}
            <div className="p-6 max-w-m bg-yellow-100 rounded-lg border border-gray-200 shadow-md">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                Pending Works
              </h5>
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-4xl font-bold text-yellow-600">
                  {pendingBookingCount}{" "}
                  {/* Replace with actual pending works count */}
                </span>
                <span className="text-gray-500 text-lg">Work Items</span>
              </div>
              <div className="relative pt-1 mt-4 ">
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-yellow-200 ">
                  <div
                    style={{
                      width: `${
                        (pendingBookingCount / allBookingCount) * 100
                      }%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                  >
                    {" "}
                  </div>
                </div>
              </div>
            </div>

            {/* ongoing work style */}
            <div className="p-6 max-w-m bg-blue-50 rounded-lg border border-gray-200 shadow-md">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                Ongoing Work
              </h5>
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-4xl font-bold text-blue-600">
                  {acceptedBookingCount}
                </span>
                <span className="text-gray-500 text-lg">Work Items</span>
              </div>
              <div className="relative pt-1 mt-4">
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{
                      width: `${
                        (acceptedBookingCount / allBookingCount) * 100
                      }%`,
                    }} // Assuming count max is 10, modify as needed
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Rejected works style */}
            <div className="p-6 max-w-m bg-red-50 rounded-lg border border-red-300 shadow-lg">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-red-700">
                Rejected Works
              </h5>
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-4xl font-bold text-red-600">
                  {rejectedBookingCount}{" "}
                  {/* Replace with actual rejected works count */}
                </span>
                <span className="text-gray-500 text-lg">Work Items</span>
              </div>
              <div className="relative pt-1 mt-4">
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-red-200">
                  <div
                    style={{
                      width: `${
                        (rejectedBookingCount / allBookingCount) * 100
                      }%`,
                    }} // Assuming count max is 10, modify as needed
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Work Completed style */}
            <div className="p-6 max-w-m bg-green-50 rounded-lg border border-green-300 shadow-lg">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-green-700">
                Work Completed
              </h5>
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-4xl font-bold text-green-600">
                  {completedBookingCount}{" "}
                  {/* Replace with actual completed works count */}
                </span>
                <span className="text-gray-500 text-lg">Work Items</span>
              </div>
              <div className="relative pt-1 mt-4">
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-green-200">
                  <div
                    style={{
                      width: `${
                        (completedBookingCount / allBookingCount) * 100
                      }%`,
                    }} // Assuming count max is 10, modify as needed
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
