import { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineCancel } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { FaRegEdit } from "react-icons/fa";
import EditBookingModal from "./EditBooking";
import Swal from "sweetalert2";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";

const ManageBooking = () => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [allMechanics, setAllMechanics] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchBooking();
    fetchMechanics();
  }, []);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/admin/getAllBookings`
      );
      const data = response.data;
      if (response.status === 200) {
        console.log({ ss: data.data });
        setAllBookings(data.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error: ${data.error}`, // Display the dynamic error message
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchMechanics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api//bookingSlot/getAllMechanics",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == "200") {
        setAllMechanics(response.data.data);
      }
    } catch (error) {
      console.error("Error during getting mechanics", error);
    }
  };

  const handleEdit = (booking) => {
    setCurrentBooking(booking);
    setIsEditModalOpen(true);
  };
  const handleSave = async (assignedMechanicId) => {
    console.log("assignedMechanic", assignedMechanicId);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/admin/assignMechanic/${currentBooking._id}`,
        {
          mechanicId: assignedMechanicId,
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Mechanic assigned Successfully',
          confirmButtonText: 'OK'
        });
        fetchBooking();
        setIsEditModalOpen(false);
        setCurrentBooking(null);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed!',
          text: 'can not assign mechanic.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Error during updating booking", error);
    }
  };

  return (
    <>
      {isEditModalOpen && (
        <EditBookingModal
          currentBooking={currentBooking}
          allMechanics={allMechanics}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleSave}
        />
      )}
  
      <div className="m-6 text-[48px] font-extrabold flex items-center justify-between uppercase text-primary-color">
      <div>Manage booking</div>
      <Link to="/admin/dashboard" className="cursor:pointer">
      <MdDashboard className="text-[24px]" />
      </Link>
      </div>
      <div className="container mx-auto p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full  rounded-lg">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left  border-b">
                  User Name
                </th>
                <th className="px-6 py-3 text-left  border-b">
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
                  Actions
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
                    {booking.preferreddate} - {booking.preferredtime}{" "}
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
                    {booking.isPaid && (
                      <button className="px-4 py-2 text-sm text-white bg-green-500 rounded-lg">
                        <TiTick />
                      </button>
                    )}
                    {!booking.isPaid && (
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
    </>
  );
};

export default ManageBooking;
