import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import PartsModal from "./PartsModal";
import UpdateModal from "./UpdateModal";
import { MdDashboard } from "react-icons/md";

function InventorySection() {
  const [items, setItems] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/inventory");
        const fetchedParts = response.data.map((part) => ({
          _id: part._id, // Ensure _id is included
          itemCode: part.partCode,
          itemName: part.partName,
          itemPrice: part.price,
          itemQuantity: part.quantity,
          description: part.description,
          itemImage: part.partImageUrl ? part.partImageUrl : (part.partImage ? `http://localhost:3000${part.partImage}` : ''),
        }));

        // Use a Map to ensure unique items based on itemCode
        const itemsMap = new Map();
        [...items, ...fetchedParts].forEach((item) => {
          itemsMap.set(item.itemCode, item);
        });

        setItems(Array.from(itemsMap.values()));
      } catch (error) {
        console.error("Error fetching inventory parts:", error);
      }
    };

    fetchParts();
  }, []); 

  const handlePartClick = (part) => {
    setSelectedPart(part);
  };

  const handleCloseModal = () => {
    setSelectedPart(null);
  };

  const handleUpdatePart = () => {
    setIsUpdateModalOpen(true);
  };

  const handleSaveUpdate = async (updatedPart) => {
    try {
      await axios.put(
        `http://localhost:3000/api/inventory/${updatedPart._id}`,
        {
          quantity: updatedPart.itemQuantity,
          price: updatedPart.itemPrice,
        }
      );
      setItems(
        items.map((item) => (item._id === updatedPart._id ? updatedPart : item))
      );
      setIsUpdateModalOpen(false);
      Swal.fire({
        title: "Updated!",
        text: "Your item has been updated.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating item:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error updating the item.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleDeletePart = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:3000/api/inventory/${selectedPart._id}`
          );
          setItems(
            items.filter((item) => item.itemCode !== selectedPart.itemCode)
          );
          setSelectedPart(null);
          Swal.fire({
            title: "Deleted!",
            text: "Your item has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting item:", error);
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the item.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  return (
    <>
      <div className="mx-4">
        <div className="flex border-b-2 items-center justify-between">
          <h1 className="my-4 text-[48px] font-extrabold uppercase text-[#204a64]">
            Inventory Panel
          </h1>
          <Link to={"/admin/dashboard"} className="mx-4 cursor-pointer">
            <MdDashboard className="h-[35px] w-[35px]" />
          </Link>
        </div>
        <div className="mt-4">
          <Link
            to={"/admin/additem"}
            className="bg-blue-500 hover:bg-blue-700 text-white uppercase p-2  rounded-md "
          >
            Add Item
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-2 mt-3 mx-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="mt-4 flex items-center justify-center text-[#204a64]"
              onClick={() => handlePartClick(item)}
            >
              <div className="flex flex-col justify-center cursor-pointer transform transition-transform duration-300 hover:scale-95 items-center p-2 bg-gray-100 border rounded-md">
                <div className="flex items-center gap-4 justify-between w-[100%] border-b-2 py-2 text-[16px]">
                  <span>ID: {item.itemCode} </span>
                  {item.itemQuantity > 0 ? (
                    <span className="bg-green-500 text-white px-2 rounded-md">
                      Available
                    </span>
                  ) : (
                    <span className="bg-red-500  text-white px-2 rounded-md">
                      Out of Stock
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center mt-2">
                  <img
                    src={item.itemImage}
                    alt={item.itemName}
                    className="w-32 h-32 object-cover mb-2"
                  />
                  <span className="uppercase">{item.itemName}</span>
                  <span>Price: {item.itemPrice}/=</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PartsModal
        part={selectedPart}
        onClose={handleCloseModal}
        onUpdate={handleUpdatePart}
        onDelete={handleDeletePart}
      />
      {isUpdateModalOpen && (
        <UpdateModal
          part={selectedPart}
          onClose={() => setIsUpdateModalOpen(false)}
          onSave={handleSaveUpdate}
        />
      )}
    </>
  );
}

export default InventorySection;
