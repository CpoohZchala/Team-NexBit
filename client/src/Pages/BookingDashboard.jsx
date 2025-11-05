import { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineCancel } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserModal from "../components/UserModal";

const BookingDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [currentBooking, setCurrentBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const toggleBookingModal = () => setShowBookingModal(!showBookingModal);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/getAllBookings/${userId}`
      );
      const data = response.data;
      if (response.status === 200) {
        setAllBookings(data.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error: ${data.error}`,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleEdit = (booking) => {
    setCurrentBooking(booking);
    setShowBookingModal(true);
  };

 const handleCancel = async (e, bookingId) => {
  e.preventDefault();

  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to cancel your booking?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, cancel it!",
    cancelButtonText: "No, keep it",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:3000/api/cancelBooking/${bookingId}`);
        Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
        await fetchBooking(); // reloads same page
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to cancel booking. Try again.", "error");
      }
    }
  });
};
const handleBookservice = () => {
    navigate('/bdetails')
  };

 return (
    <>
      {showBookingModal && (
        <UserModal
          bookingDetails={currentBooking}
          toggleModal={toggleBookingModal}
          showModal={showBookingModal}
        />
      )}
      <div>
        <Navbar />
      </div>

      <div className="m-6 mt-14 text-[48px] font-extrabold flex items-center justify-between uppercase text-[#204a64]">
        <div>Bookings</div>
         <button
            onClick={handleBookservice}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow">
            Book Now
          </button>
      </div>

      {/* Desktop View */}
        <div className="hidden md:block container mx-auto p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-left">
            <tr>
              <th className="px-6 py-3 text-left border-b-2">User Name</th>
              <th className="px-6 py-3 text-left border-b-2">Mechanic Name</th>
              <th className="px-6 py-3 text-left border-b-2">Date & Time</th>
              <th className="px-6 py-3 text-left border-b-2">Accept Status</th>
              <th className="px-6 py-3 text-center border-b-2">Paid Status</th>
              <th className="px-6 py-3 text-left border-b-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allBookings.map((booking, index) => (
              <tr key={index} className="hover:bg-gray-50">
          <td className="px-6 py-4 border-b">{booking.userId?.fullname || "N/A"}</td>
           <td className="px-6 py-4 border-b">{booking.mechanicId?.firstname || "N/A"}</td>
            <td className="px-6 py-4 border-b">
              {booking.preferreddate} - {booking.preferredtime}
            </td>
            <td className="px-6 py-4 border-b">
              {booking.isAccepted === "pending" && (
                <span className="px-4 py-2 text-sm text-white bg-orange-500 rounded-lg">
              Pending
                </span>
              )}
              {booking.isAccepted === "accepted" && (
                <span className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg">
              Ongoing
                </span>
              )}
              {booking.isAccepted === "rejected" && (
                <span className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg">
              Rejected
                </span>
              )}
              {booking.isAccepted === "completed" && (
                <span className="px-4 py-2 text-sm text-white bg-green-500 rounded-lg">
              Completed
                </span>
              )}
               {booking.isAccepted === "cancelled" && (
                <span className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg">
              Cancelled
                </span>
              )}
            </td>
            <td className="border-b px-6 py-4 text-center align-middle">
              {booking.isPaid ? (
                <TiTick className="text-green-500 text-2xl inline-block align-middle" />
              ) : (
                <MdOutlineCancel className="text-red-500 text-2xl inline-block align-middle" />
              )}
            </td>
            <td className="px-6 py-4 border-b flex gap-1">
              <button
                className="px-3 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                onClick={() => handleEdit(booking)}>
                <FaRegEdit />
              </button>

              {(booking.isAccepted === "pending") && (
              <button
                onClick={(e) => handleCancel(e, booking._id)}
                title="Cancel booking"
                aria-label="Cancel booking"
                className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg">
                <MdOutlineCancel className="text-xl" />
              </button>
            )}
            </td>
              </tr>
            ))}
          </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
      <div className="md:hidden px-4">
        {allBookings.map((booking, index) => (
          <div key={index} className="bg-white mb-4 border-b border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">{booking.userId.fullname }</h3>
              <button
                onClick={() => handleEdit(booking)}
                className="px-3 py-1 text-white bg-indigo-600 rounded"
              >
                <FaRegEdit />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 text-sm">
                <span className="text-gray-600">Mechanic:</span>
                <span className="text-right">{booking.mechanicId?.firstname || "N/A"}</span>

              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="text-right">{booking.preferreddate || "N/A"}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="text-right">{booking.preferredtime || "N/A"}</span>
              </div>

              <div className="grid grid-cols-2 text-sm items-center">
                <span className="text-gray-600">Status:</span>
                <span className="text-right capitalize">{booking.isAccepted}</span>
              </div>

              <div className="grid grid-cols-2 text-sm items-center">
                <span className="text-gray-600">Payment:</span>
                <div className="text-right">
                  {booking.isPaid ? (
                    <TiTick className="inline text-green-500 text-lg" />
                  ) : (
                    <MdOutlineCancel className="inline text-red-500 text-lg" />
                  )}
                </div>
              </div>
             {(booking.isAccepted === "pending") && (
              <button
                onClick={(e) => handleCancel(e, booking._id)}
                className="px-3 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Cancel
              </button>
            )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BookingDashboard;
