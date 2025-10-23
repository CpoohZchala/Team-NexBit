import Swal from "sweetalert2";
import "../../components/Modal.css"; // Import your CSS file
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MechanicModal = ({ showModal, toggleModal, bookingDetails }) => {
  const navigate = useNavigate();

  if (!bookingDetails) return null; // Early return if no booking details are provided

  const handleAccept = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/acceptBooking/${bookingDetails._id}`,
        {}
      );
      if (response.status === 200) {
        closeModal();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Booking accepted",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/rejectBooking/${bookingDetails._id}`,
        {}
      );
      if (response.status === 200) {
        closeModal();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Booking rejected",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddWork = async () => {
    navigate("/addwork", { state: { bookingDetails } });
    localStorage.setItem("bookingId", bookingDetails._id);
  };

  const closeModal = () => {
    toggleModal();
    localStorage.removeItem("bookingId");
  };

  return (
    <div className={`modal ${showModal ? "show" : ""}`}>
      <div className="modal-content relative text-gray-100">
        <button
          className="absolute bg-gray-200 h-[30px] w-[30px] top-[5px] right-[5px] text-black rounded-2xl text-[20px]"
          onClick={closeModal}
        >
          &times;
        </button>
        <h2 className="text-center font-bold text-xl mb-2">Booking Details</h2>
        <div className="w-[100%] flex my-2">
          <div className="w-[50%]">
            <ul className="popup-ul">
              <li>Vehicle Make: {bookingDetails.vehiclemake}</li>
              <li>Vehicle Type: {bookingDetails.vehicletype}</li>
              <li>Vehicle Number: {bookingDetails.vehiclenumber}</li>
              <li>Manufactured Year: {bookingDetails.manufecturedyear}</li>
              <li>Preferred Date: {bookingDetails.preferreddate}</li>
            </ul>
          </div>
          <div className="w-[50%]">
            <ul className="popup-ul">
              <li>Preferred Time: {bookingDetails.preferredtime}</li>
              <li>Vehicle Owner Name: {bookingDetails.vehicleownername}</li>
              <li>Mobile Number: {bookingDetails.mobilenumber}</li>
              <li>Email: {bookingDetails.email}</li>
              <li>Message: {bookingDetails.message}</li>
            </ul>
          </div>
        </div>
        <div className="w-[100%] flex justify-center items-center mt-6">
          <div className="flex gap-5">
            {/* Conditional Rendering */}
            {bookingDetails.isAccepted === "pending" && (
              <>
                <button
                  onClick={handleAccept}
                  className="w-[100px] h-[40px] bg-green-600 hover:bg-green-800 text-white rounded-lg shadow-lg"
                >
                  Accept
                </button>
                <button
                  onClick={handleReject}
                  className="w-[100px] h-[40px] bg-red-600 hover:bg-red-800 text-white rounded-lg shadow-lg"
                >
                  Reject
                </button>
              </>
            )}

            {bookingDetails.isAccepted === "accepted" && (
              <button
                onClick={handleAddWork}
                className="w-[100px] h-[40px] bg-blue-600 hover:bg-blue-800 text-white rounded-lg shadow-lg"
              >
                Add Work
              </button>
            )}

            {bookingDetails.isAccepted === "completed" && (
              <span className="text-green-400 font-bold">
                Booking is Completed
              </span>
            )}
            {bookingDetails.isAccepted === "rejected" && (
              <span className="text-red-600 font-bold">
                Booking is rejected
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicModal;
