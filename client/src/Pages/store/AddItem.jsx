import { useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link } from "react-router-dom";

function AddItem() {
  const [partName, setPartName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const imageInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // required to allow drop
    e.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type && !file.type.startsWith('image/')) {
        Swal.fire({ icon: 'warning', title: 'Invalid file', text: 'Please drop an image file.' });
        return;
      }
      setImage(file);
      // try to set the file input's files for consistency
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        if (imageInputRef.current) imageInputRef.current.files = dt.files;
      } catch (err) {
        // ignore if DataTransfer isn't available
      }
    }
  };

  // Generate part code with "AC" prefix
  const generatePartCode = () => {
    const randomNum = Math.floor(100 + Math.random() * 900); // Generate a random 3-digit number
    return `AC${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!image) {
      await Swal.fire({ icon: 'warning', title: 'Add image', text: 'Please upload an image of the item.' });
      return;
    }
    if (quantity === "") {
      await Swal.fire({ icon: 'warning', title: 'Add quantity', text: 'Please enter the quantity.' });
      return;
    }

    // if (parseInt(quantity, 10) < 0) {
    //   setMessage("Quantity cannot be less than 0.");
    //   return;
    // }

    if (price === "" || parseFloat(price) < 1) {
      await Swal.fire({ icon: 'warning', title: 'Invalid price', text: 'Please enter a valid price' });
      return;
    }

    const partCode = generatePartCode(); // Generate the part code with prefix "AC"

    const formData = new FormData();
    formData.append("partName", partName);
    formData.append("partCode", partCode);
    formData.append("quantity", parseInt(quantity));
    formData.append("price", parseFloat(price));
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/inventory/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response); // Log the response after receiving it
      // Show success modal with generated part code
      await Swal.fire({
        icon: "success",
        title: "Item added successfully!",
        html: `Part code: <strong>${partCode}</strong>`,
        confirmButtonText: "OK",
      });
      clearForm(); // Clears form after successful submission
    } catch (error) {
      console.error("Error adding item:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      // Show error modal
      const errText = error.response?.data?.message || error.message || "Failed to add item.";
      await Swal.fire({
        icon: "error",
        title: "Failed",
        text: errText,
        confirmButtonText: "OK",
      });
    }
  };

  //cancel image selection
  const cancelSelection = () => {
    setImage(null);
    if (imageInputRef.current) imageInputRef.current.value = null;
  };

  //clear form
  const clearForm = () => {
    setPartName("");
    setQuantity("");
    setPrice("");
    setDescription("");
    setImage(null);
    if (imageInputRef.current) imageInputRef.current.value = null;
  };


  return (
    <div className="m-4 p-4 bg-white shadow-md rounded-lg">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-primary-color uppercase mb-4">
        Add Inventory Item
      </h1>
      <Link to={"/admin/inventory"} className="mr-4 cursor-pointer">
        <RiArrowGoBackLine className="w-5 h-5" />
      </Link>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-wrap flex-row">
        <div className="w-full md:w-1/2 pr-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="partName"
            >
              Part Name
            </label>
            <input
              type="text"
              id="partName"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="quantity"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="1"
              step="1"
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  setQuantity("");
                  return;
                }
                const parsed = parseInt(raw, 10);
                if (Number.isNaN(parsed)) {
                  setQuantity("");
                  return;
                }
                // Clamp to zero as minimum
                setQuantity(String(Math.max(0, parsed)));
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              id="price"
              value={price}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  setPrice("");
                  return;
                }
                const parsed = parseFloat(raw);
                if (Number.isNaN(parsed)) {
                  setPrice("");
                  return;
                }
                // Enforce minimum 1
                setPrice(String(Math.max(1, parsed)));
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Item
            </button>
            <button
              onClick={clearForm}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 pl-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Upload Image
            </label>
            <div className="flex items-center justify-between gap-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <input ref={imageInputRef} type="file" id="image" onChange={handleImageChange} />
              <span onClick={cancelSelection} className="cursor-pointer">
                X
              </span>
            </div>
          </div>
          {image ? (
            <div className="mb-4">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-full h-[300px] rounded"
              />
            </div>
          ) : (
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mb-4 rounded h-[300px] flex items-center justify-center transition-all duration-150 ${
                isDragging
                  ? 'border-2 border-blue-400 bg-blue-50'
                  : 'border-dotted border-2 border-gray-300'
              }`}
            >
              <span className="text-gray-500">Drag image here</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddItem;