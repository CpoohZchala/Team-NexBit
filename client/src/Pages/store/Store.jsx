import { useEffect, useState } from "react";
import "./Store.css";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar.jsx"
import axios from "axios";


const Store = () => {
  const [items, setItems] = useState([]);
  const { setAddedItem } = useAuth();

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/inventory");
        const fetchedParts = response.data.map((part) => ({
          _id: part._id,
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


 const handleAdd = (part) => {
  // Update quantity after adding
  const updatedItems = items.map((p) => {
    if (p._id === part._id) {
      return { ...p, itemQuantity: Math.max(p.itemQuantity - 1, 0) };
    }
    return p;
  });

  setItems(updatedItems);

  // Store selected item in context
  setAddedItem(part.itemCode);

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Item added successfully",
    showConfirmButton: false,
    timer: 1500,
  });
};


  // const handleDelete = (code) => {
  //   const updateditem = item.map((part) => {
  //     if (part.code === code && part.quantity > ) {
  //       return { ...part, quantity: prt.quantity - 1 };
  //     }
  //     return part;
  //   });
  //   setitem(updateditem);
  // };

  

  return (
    <div className="car-item">
     <div className="mt-[80px]">
      <Navbar />
     </div>
      

      {items.map((part) => (
        <div key={part.code} className="part-item">
          <div className="image-container">
            <img src={part.itemImage} alt={part.itemName} className="part-image" />
            <p className="part-name">{part.itemNameName}</p>
          </div>
          <div className="part-details">
            <p>Code: {part.itemCode}</p> 
            {part.itemQuantity === 0 ? (
              <p className="bg-red-600 text-white text-center w-[120px] rounded">
                Out of Stock
              </p>
            ) : (
              <p>Qty    : {part.itemQuantity} pcs</p>
            )}
            <p>Price: Rs {part.itemPrice}</p>
          </div>
          <div className="actions">
            <button onClick={() => handleAdd(part)}>Add Item</button>
            {/* <button onClick={() => handleDelete(part.code)}>Delete Item</button> */}
          </div>
        </div>
      ))}
    </div>
  );
};


export default Store;
