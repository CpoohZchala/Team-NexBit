import { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineCancel } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
// import { MdDashboard } from "react-icons/md";
// import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserModal from "../components/UserModal";

const BookingDashboard = () => {
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
        console.log({ ss: data.data });
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
      console.error(error);
    }
  };

  const handleEdit = (booking) => {
    setCurrentBooking(booking);
    setShowBookingModal(true);
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
      <div className="">
        <Navbar />
      </div>
      <div className="m-6 mt-14 text-[48px] font-extrabold flex items-center justify-between uppercase text-[#204a64]">
        <div>Bookings</div>
        {/* <Link to="/admin/dashboard" className="cursor:pointer">
          <MdDashboard />
        </Link> */}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block container mx-auto p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left  border-b-2">
                  User Name
                </th>
                <th className="px-6 py-3 text-left  border-b-5">
                  Mechanic Name
                </th>
                <th className="px-6 py-3 text-left  border-b">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left  border-b">
                  Accept Status
                </th>
                <th className="px-6 py-3 text-left  border-b">
                  Paid Status
                </th>
                <th className="px-6 py-3 text-left  border-b">
                  See More
                </th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">
                    {booking.userId.fullname}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {booking.mechanicId.firstname}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {booking.preferreddate} - {booking.preferredtime}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {booking.isAccepted === "pending" && (
                      <button className="px-4 py-2 text-sm text-white bg-orange-500 rounded-lg">
                        Pending
                      </button>
                    )}
                    {booking.isAccepted === "accepted" && (
                      <button className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg">
                        Ongoing
                      </button>
                    )}
                    {booking.isAccepted === "rejected" && (
                      <button className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg">
                        Rejected
                      </button>
                    )}
                    {booking.isAccepted === "completed" && (
                      <button className="px-4 py-2 text-sm text-white bg-green-500 rounded-lg">
                        Completed
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {booking.isPaid ? (
                      <button className="px-4 py-2 text-sm text-white bg-green-500 rounded-lg">
                        <TiTick />
                      </button>
                    ) : (
                      <button className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg">
                        <MdOutlineCancel />
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                      onClick={() => handleEdit(booking)}
                    >
                      <FaRegEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View - Receipt Style */}
      <div className="md:hidden px-4">
        {allBookings.map((booking, index) => (
          <div key={index} className="bg-white mb-4 border-b border-gray-200">
            {/* Header Section */}
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{booking.userId.fullname}</h3>
                <button
                  onClick={() => handleEdit(booking)}
                  className="px-3 py-1 text-white bg-indigo-600 rounded"
                >
                  <FaRegEdit />
                </button>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 text-sm">
                <span className="text-gray-600">Mechanic Name:</span>
                <span className="text-right">
                  {booking.mechanicId.firstname}
                </span>
              </div>

              <div className="grid grid-cols-2 text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="text-right">{booking.preferreddate}</span>
              </div>

              <div className="grid grid-cols-2 text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="text-right">{booking.preferredtime}</span>
              </div>

              <div className="grid grid-cols-2 text-sm items-center">
                <span className="text-gray-600">Status:</span>
                <div className="text-right">
                  {booking.isAccepted === "pending" && (
                    <span className="px-2 py-1 text-xs text-white bg-orange-500 rounded">
                      Pending
                    </span>
                  )}
                  {booking.isAccepted === "accepted" && (
                    <span className="px-2 py-1 text-xs text-white bg-blue-500 rounded">
                      Ongoing
                    </span>
                  )}
                  {booking.isAccepted === "rejected" && (
                    <span className="px-2 py-1 text-xs text-white bg-red-500 rounded">
                      Rejected
                    </span>
                  )}
                  {booking.isAccepted === "completed" && (
                    <span className="px-2 py-1 text-xs text-white bg-green-500 rounded">
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 text-sm items-center">
                <span className="text-gray-600">Payment Status:</span>
                <div className="text-right">
                  {booking.isPaid ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                      <TiTick className="text-white" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
                      <MdOutlineCancel className="text-white" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BookingDashboard;
