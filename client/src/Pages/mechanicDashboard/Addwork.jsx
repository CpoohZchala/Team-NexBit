import "./addwork.css";
import Image2 from "../../assets/photos/Addwork.jpg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import axios from "axios";

const Addwork = () => {
  const navigate = useNavigate();
  const [warranty, setWarranty] = useState("");
  const [qty, setQty] = useState(0);
  const [unitAmount, setUnitAmount] = useState(0);
  const [partCode, setPartCode] = useState("");
  const [description, setDescription] = useState("");
  const [workItems, setWorkItems] = useState(() => {
    // Load workItems from localStorage if available
    const savedItems = localStorage.getItem("workItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    // Save workItems to localStorage whenever they change
    localStorage.setItem("workItems", JSON.stringify(workItems));
  }, [workItems]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const tempTotal = qty * unitAmount;
    // Create an entry object
    const newWorkItem = {
      partCode: partCode,
      description: description,
      warranty: warranty,
      qty: qty,
      unitAmount: unitAmount,
      total: tempTotal,
    };

    // Add the new entry to the array
    setWorkItems([...workItems, newWorkItem]);

    // Reset form fields
    setPartCode("");
    setDescription("");
    setWarranty("");
    setQty(0);
    setUnitAmount(0);
  };

  const handlePartCodeChange = async (e) => {
    const partCode = e.target.value;
    setPartCode(partCode);

    if (partCode) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/inventory/partcode/${partCode}`
        );
        const part = response.data;
        setUnitAmount(part.price);
        setDescription(part.description);
        setWarranty(part.partName);
      } catch (error) {
        console.error("Error fetching inventory item by part code:", error);
      }
    }
  };

  const handleNavigateToInvoice = () => {
    // Navigate to the Invoice page and pass workItems array as state
    navigate("/invoice");
  };

  const navigateToHome = () => {
    localStorage.removeItem("bookingId");
    localStorage.removeItem("workItems");
    navigate("/mdashboard");
  };

  return (
    <div className="design">
      <div className="container-add">
        <div className="form-section">
          <h1>ADD WORK HERE</h1>
          <button
            onClick={navigateToHome}
            className="mb-4 w-[45px] h-[35px] bg-gray-200 rounded-lg text-black flex justify-center items-center"
          >
            <FaHome />
          </button>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Parts Code No :</label>
              <input
                className="form_input"
                type="text"
                name="Code"
                value={partCode}
                onChange={handlePartCodeChange}
              />
            </div>
            <div className="form-group">
              <label>Parts Name :</label>
              <input
                className="form_input"
                type="text"
                name="warranty"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Qty :</label>
              <input
                className="form_input"
                type="number"
                name="qty"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Amount (Unit) :</label>
              <input
                className="form_input"
                type="number"
                name="amount"
                value={unitAmount}
                onChange={(e) => setUnitAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description of Work :</label>
              <textarea
                className="description_textarea"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-between">
              <button
                type="submit"
                className="bg-red-500 py-2 mb-3 mr- rounded w-[200px] hover:bg-red-700"
              >
                ADD TO BILL
              </button>
              <button
                onClick={handleNavigateToInvoice}
                className="bg-green-500 py-2 mb-3 rounded w-[200px] hover:bg-green-700 uppercase"
              >
                View Invoice
              </button>
            </div>
          </form>
        </div>
        <div className="image-section">
          <img className="image2" src={Image2} />
        </div>
      </div>
    </div>
  );
};

export default Addwork;
