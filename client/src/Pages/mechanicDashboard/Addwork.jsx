import "./addwork.css";
import Image2 from "../../assets/photos/Addwork.jpg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import axios from "axios";

const Addwork = () => {
  const navigate = useNavigate();

  // Form states
  const [warranty, setWarranty] = useState("");
  const [qty, setQty] = useState(0);
  const [unitAmount, setUnitAmount] = useState(0);
  const [partCode, setPartCode] = useState("");
  const [description, setDescription] = useState("");
  const [parts, setParts] = useState([]); // ✅ all parts list

  // Work items (persisted in localStorage)
  const [workItems, setWorkItems] = useState(() => {
    const savedItems = localStorage.getItem("workItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // Save work items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("workItems", JSON.stringify(workItems));
  }, [workItems]);

  // ✅ Fetch all parts when page loads
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/inventory");
        setParts(response.data);
      } catch (error) {
        console.error("Error fetching parts list:", error);
      }
    };
    fetchParts();
  }, []);

  // ✅ Handle part code selection
  const handlePartCodeChange = async (e) => {
    const selectedCode = e.target.value;
    setPartCode(selectedCode);

    // If no code selected, reset fields
    if (!selectedCode) {
      setUnitAmount(0);
      setDescription("");
      setWarranty("");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/api/inventory/partcode/${selectedCode}`
      );
      const part = response.data;
      setUnitAmount(part.price || 0);
      setDescription(part.description || "");
      setWarranty(part.partName || "");
    } catch (error) {
      console.error("Error fetching inventory item by part code:", error);
    }
  };

  // ✅ Add to work items
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!partCode || qty <= 0 || unitAmount <= 0) {
      alert("Please select a valid part and enter quantity/amount.");
      return;
    }

    const tempTotal = Number(qty) * Number(unitAmount);

    const newWorkItem = {
      partCode: partCode,
      description: description,
      warranty: warranty,
      qty: Number(qty),
      unitAmount: Number(unitAmount),
      total: tempTotal,
    };

    setWorkItems([...workItems, newWorkItem]);

    // Reset fields
    setPartCode("");
    setDescription("");
    setWarranty("");
    setQty(0);
    setUnitAmount(0);
  };

  // ✅ Navigation to Invoice
  const handleNavigateToInvoice = () => {
    navigate("/invoice");
  };

  // ✅ Navigation to Home
  const navigateToHome = () => {
    localStorage.removeItem("bookingId");
    localStorage.removeItem("workItems");
    navigate("/mdashboard");
  };

  return (
    <div className="design">
      <div className="container-add">
        {/* ================= FORM SECTION ================= */}
        <div className="form-section">
          <h1>ADD WORK HERE</h1>

          <button
            onClick={navigateToHome}
            className="mb-4 w-[45px] h-[35px] bg-gray-200 rounded-lg text-black flex justify-center items-center"
          >
            <FaHome />
          </button>

          <form onSubmit={handleSubmit}>
            {/* ✅ Dropdown list for part codes */}
            <div className="form-group">
              <label>Parts Code No :</label>
              <select
                className="form_input"
                value={partCode}
                onChange={handlePartCodeChange}
              >
                <option value="">-- Select a Part Code --</option>
                {parts.map((p) => (
                  <option
                    key={p.partCode}
                    value={p.partCode}
                    disabled={p.quantity === 0} // ✅ Disable if quantity = 0
                  >
                    {p.partCode} - {p.partName}{" "}
                    {p.quantity === 0 ? "(Out of Stock)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Part Name */}
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

            {/* Quantity */}
            <div className="form-group">
              <label>Qty :</label>
              <input
                className="form_input"
                type="number"
                name="qty"
                min="1" // ✅ Prevent selecting minus or zero
                value={qty}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0) setQty(val); // ✅ Prevent negative values
                }}
              />
            </div>

            {/* Unit Amount */}
            <div className="form-group">
              <label>Amount (Unit) :</label>
              <input
                className="form_input"
                type="number"
                name="amount"
                min="0" // ✅ Prevent negative prices
                value={unitAmount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0) setUnitAmount(val);
                }}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description of Work :</label>
              <textarea
                className="description_textarea"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 justify-between">
              <button
                type="submit"
                className="bg-red-500 py-2 mb-3 rounded w-[200px] hover:bg-red-700"
              >
                ADD TO BILL
              </button>

              <button
                onClick={handleNavigateToInvoice}
                type="button"
                className="bg-green-500 py-2 mb-3 rounded w-[200px] hover:bg-green-700 uppercase"
              >
                View Invoice
              </button>
            </div>
          </form>
        </div>

        {/* ================= IMAGE SECTION ================= */}
        <div className="image-section">
          <img className="image2" src={Image2} alt="Add work" />
        </div>
      </div>
    </div>
  );
};

export default Addwork;
