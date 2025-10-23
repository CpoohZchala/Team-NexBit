import { useEffect, useState } from "react";
import "./Bookingdetails.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Bookingdetails() {
  const { user, addedItem } = useAuth(); // Get addedItem from AuthContext
  const [allMechanics, setAllMechanics] = useState([]);
  const [userName, setUserName] = useState(user?.fullname || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");
  const [mobileNumber, setMobileNumber] = useState(user?.phone || "");
  const [selectedMechanic, setSelectedMechanic] = useState("");
  const [yearError, setYearError] = useState("");
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/bookingSlot/getAllMechanics",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setAllMechanics(response.data.data);
        }
      } catch (error) {
        console.error("Error during getting mechanics", error);
      }
    };

    fetchMechanics();
  }, []);

  const [form, setForm] = useState({
    vehicleMake: "",
    vehicleModel: "",
    vehicleNumber: "",
    manufacturedYear: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'manufacturedYear') {
      const year = parseInt(value);
      if (year > currentYear) {
        setYearError(`Year cannot be greater than ${currentYear}`);
      } else {
        setYearError("");
      }
    }
    
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleMechanicChange = (e) => {
    const mechanicId = e.target.value;
    setSelectedMechanic(mechanicId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation
    if (
      !form.vehicleMake ||
      !form.vehicleModel ||
      !form.vehicleNumber ||
      !form.manufacturedYear ||
      !userName ||
      !mobileNumber ||
      !userEmail
    ) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
      });
      return;
    }

    const bookingData = {
      vehiclemake: form.vehicleMake,
      vehicletype: form.vehicleModel,
      vehiclenumber: form.vehicleNumber,
      manufecturedyear: form.manufacturedYear,
      preferreddate: form.preferredDate,
      preferredtime: form.preferredTime,
      vehicleownername: userName,
      mobilenumber: mobileNumber,
      model: addedItem ?? "No item selected",
      email: userEmail,
      message: form.message,
      userId: user._id,
      mechanicId: selectedMechanic,
    };

    try {
      let bookingId;
      const response = await fetch("http://localhost:3000/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Booking creation failed:", errorData);
        throw new Error("Failed to create booking");
      }
      const responseData = await response.json();

      // Access the new booking's _id
      if (response.status === 200) {
        bookingId = responseData.data._id;
        // console.log("New booking ID:", bookingId);
      }
      // console.log("Booking created successfully", user._id);

      const sendNotification = await fetch(
        `http://localhost:3000/api/notification/createNotification/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: bookingId,
            mechanicId: selectedMechanic,
            topic: "Booking",
            message: "Booking created successfully",
          }),
        }
      );
      // console.log("Notification response:", sendNotification);

      if (!sendNotification.ok) {
        const notificationError = await sendNotification.json();
        console.error("Notification sending failed:", notificationError);
        throw new Error("Failed to send notification");
      }

      Swal.fire({
        title: "Success!",
        text: "Your operation was successful.",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/");
      setForm({
        vehicleMake: "",
        vehicleModel: "",
        vehicleNumber: "",
        manufacturedYear: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
        mechanicId: "",
      });
      setUserName("");
      setMobileNumber("");
      setUserEmail("");
    } catch (error) {
      console.error(
        "Error during booking creation or notification sending:",
        error
      );
      Swal.fire({
        icon: "error",
        title: "Booking Failed!",
        text: "Failed to create booking or send notification. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 15; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        times.push(time);
      }
    }
    return times;
  };

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const handleCancel = (e) => {
    e.preventDefault(); // Prevent default behavior if needed

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel your booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/"); // Redirect to home or another relevant page after cancellation
        Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
      }
    });
  };

  return (
    <main className="booking-details flex justify-center text-white relative">
      <div className="background-design"></div>
      <div className="app-booking pb-4">
        <h1>SLOT BOOKING DETAILS</h1>
        <div className="container-booking bg-gray-500">
          <form onSubmit={handleSubmit}>
            <div className="left">
              <div className="form-group">
                <label>Vehicle Make</label>
                <input
                  className="input-area"
                  type="text"
                  name="vehicleMake"
                  placeholder=" Ex: Hybrid"
                  value={form.vehicleMake}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Vehicle Model</label>
                <input
                  className="input-area"
                  type="text"
                  name="vehicleModel"
                  placeholder=" Ex: Vezel"
                  value={form.vehicleModel}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Vehicle Number</label>
                <input
                  className="input-area"
                  type="text"
                  name="vehicleNumber"
                  placeholder=" Ex: CAB - 1234"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Manufactured Year</label>
                <div className="relative">
                  <input
                    type="number"
                    name="manufacturedYear"
                    className="input-area"
                    placeholder="Manufactured Year"
                    value={form.manufacturedYear}
                    onChange={handleChange}
                  />
                  {yearError && (
                    <p className="text-red-500 text-sm mt-1">{yearError}</p>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-md font-bold mb-2">
                  Preferred Date:
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={form.preferredDate}
                  onChange={handleChange}
                  min={today} // Set minimum date to today
                  className="shadow appearance-none border rounded-lg w-[300px]  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-mdfont-bold mb-2">
                  Preferred Time:
                </label>
                <select
                  name="preferredTime"
                  value={form.preferredTime}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-[300px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select a time</option>
                  {generateTimeOptions().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="right">
              <div className="form-group">
                <label>Vehicle Owner Name</label>
                <input
                  className="input-area"
                  type="text"
                  name="ownerName"
                  placeholder=" Ex: Mr. Perera"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  className="input-area"
                  type="text"
                  name="mobileNumber"
                  placeholder=" Ex: 078-7587700"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Selected Item</label>{" "}
                {/* Changed label to Selected Item */}
                <input
                  className="input-area"
                  type="text"
                  name="selectedItem"
                  placeholder="Selected Item"
                  value={addedItem} // Use addedItem from context
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  className="input-area"
                  type="email"
                  name="email"
                  placeholder=" Ex: abcdefgh@gmail.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  className="textarea-last text-black"
                  name="message"
                  placeholder=" Enter your message here"
                  value={form.message}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between w-full px-8 mb-4 items-center">
              {/* <h2 className="text-center text-lg font-bold mb-4 md:mb-0">
                Please select a mechanic
              </h2> */}
              <div className="flex flex-wrap justify-center mt-2 w-full md:w-auto">
                <select
                  className="dropdown rounded-lg text-gray-700 p-2 w-[300px] "
                  value={selectedMechanic}
                  onChange={handleMechanicChange}
                >
                  <option className="text-gray-700" value="">Select a Mechanic</option>
                  {allMechanics.map((mechanic) => (
                    <option key={mechanic._id} className="text-gray-700" value={mechanic._id}>
                      {mechanic.firstname} ({mechanic.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-center  ">
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-300 text-white p-3 w-full ml-8 text-uppercase rounded-[10px] md:w-[300px]"
              >
                Cancel Booking
              </button>
              <button type="submit" className="btn">
                Book Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Bookingdetails;
