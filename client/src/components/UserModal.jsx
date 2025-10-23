import "./Modal.css"; // Import your CSS file
// import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const UserModal = ({ showModal, toggleModal, bookingDetails }) => {
  // const navigate = useNavigate();

  const closeModal = () => {
    toggleModal();
    localStorage.removeItem("bookingId");
  };

  const handlePayNow = async () => {
    const stripe = await loadStripe(
      "pk_test_51QCdaCJBXxkFYDYBrGmETclo8gPYlnXMfXBvK3lscr2DCbsPKMpS1QTys6FdAcQCHzld74pDpYIY203TquPRYAvO00ePwgzlf4"
    );
    const body = {
      // workItems: bookingDetails.workItems,
      bookingId: bookingDetails._id,
      netTotal: bookingDetails.netTotal,
    };
    const header = {
      "content-type": "application/json",
    };
    const response = await fetch(
      "http://localhost:3000/api/create-checkout-session",
      {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    console.log(result);

    if (result.error) {
      console.error(result.error.message);
    }
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
        {bookingDetails.isAccepted === "completed" ? (
          <div>
            <h3 className="text-center font-bold text-lg mb-2">Bill Details</h3>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Item Name</th>
                  <th>Parts Code No</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {bookingDetails.works.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td>{item.warranty}</td>
                    <td>{item.partCode}</td>
                    <td>{item.qty}</td>
                    <td>{item.unitAmount}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <span className="font-bold">Net Total:</span>
              <span>{bookingDetails.netTotal}</span>
            </div>
            <div className="flex justify-center items-center mt-6">
              {bookingDetails.isPaid == false && (
                <button
                  onClick={handlePayNow}
                  className="h-[40px] w-[150px] px-2 bg-gray-100 text-black hover:bg-gray-700 hover:text-white"
                >
                  Pay Now
                </button>
              )}
              {bookingDetails.isPaid == true && (
                <span className="text-green-600 font-bold">
                  Payment is completed
                </span>
              )}
            </div>
          </div>
        ) : (
          <div>
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
              <div>
                {bookingDetails.isAccepted === "pending" && (
                  <span className="text-yellow-600 font-bold">
                    Booking is Pending...
                  </span>
                )}
                {bookingDetails.isAccepted === "accepted" && (
                  <span className="text-yellow-600 font-bold">
                    Booking is accepted, He will come soon...
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
        )}
      </div>
    </div>
  );
};

export default UserModal;
