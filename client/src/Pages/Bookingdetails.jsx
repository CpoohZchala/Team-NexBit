import { useEffect, useState } from "react";
import "./Bookingdetails.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";


function Bookingdetails() {
  const { user, addedItem , setAddedItem} = useAuth(); 
  const [allMechanics, setAllMechanics] = useState([]);
  const [userName, setUserName] = useState(user?.fullname || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");
  const [mobileNumber, setMobileNumber] = useState(user?.phone || "");
  const [selectedMechanic, setSelectedMechanic] = useState("");
  const [yearError, setYearError] = useState("");
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});



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

let newErrors = {};
// validation (keep your existing checks)
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
  if (!form.message.trim()) {
    newErrors.message = "Message is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    Swal.fire({
      icon: "error",
      title: "Missing Fields",
      text: newErrors.general || "Please fill in all required fields.",
    });
    return;
  }
  setErrors({});
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
    const response = await fetch("http://localhost:3000/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    // parse body (always try to parse JSON)
    let responseData = null;
    try {
      responseData = await response.json();
    } catch (parseErr) {
      // response had no JSON body
      responseData = null;
    }

    // If backend returned non-2xx, show backend message if present
    if (!response.ok) {
      const backendMessage =
        responseData?.message || responseData?.error || `Request failed (${response.status})`;
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: backendMessage,
      });
      return; // stop here
    }

    // success: proceed with notification and success flow
    const bookingId = responseData?.data?._id;

    // send notification (existing code) - also handle errors gracefully
    const sendNotification = await fetch(
      `http://localhost:3000/api/notification/createNotification/${user._id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          mechanicId: selectedMechanic,
          topic: "Booking",
          message: "Booking created successfully",
        }),
      }
    );

    if (!sendNotification.ok) {
      const notifBody = await sendNotification.json().catch(() => null);
      throw new Error(notifBody?.message || "Failed to send notification");
    }

    Swal.fire({
      title: "Success!",
      text: "Your booking has been created successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });

    // reset form + context
    setForm({
      vehicleMake: "",
      vehicleModel: "",
      vehicleNumber: "",
      manufacturedYear: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    });
    setUserName("");
    setMobileNumber("");
    setUserEmail("");
    setSelectedMechanic("");
    setAddedItem(""); // clear selected item in context

    navigate("/");

  } catch (error) {
    console.error("Error during booking creation:", error);
    Swal.fire({
      icon: "error",
      title: "Booking Failed!",
      text: error.message || "Failed to create booking. Please try again.",
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

  return (

   <>
    <Navbar />
    <main className="booking-details flex justify-center text-white relative mt-20">
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
                <label>Selected Item Code:</label>
                {/* Changed label to Selected Item */}
                <input
                  className="input-area"
                  type="text"
                  name="selectedItem"
                  placeholder="Selected Item"
                  value={addedItem || ""}  // Use addedItem from context
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
                  placeholder="Enter your message here"
                  value={form.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
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
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setForm({
                    vehicleMake: "",
                    vehicleModel: "",
                    vehicleNumber: "",
                    manufacturedYear: "",
                    preferredDate: "",
                    preferredTime: "",                  
                    message: "",
                  });
                  setUserName(user?.fullname || "");
                  setUserEmail(user?.email || "");
                  setMobileNumber(user?.phone || "");
                  setSelectedMechanic("");
                  setYearError("");
                  setAddedItem("");
                }}
                className="bg-gray-700 hover:bg-gray-400 text-white p-3 w-full text-uppercase rounded-[10px] md:w-[300px]">
                Clear Form
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 w-full text-uppercase rounded-[10px] md:w-[300px]">
                Book Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
    </>
  );
}

export default Bookingdetails;
