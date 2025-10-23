import { useState } from "react";
import "./Store.css";
// import bearingImage from './assets/Bearing.png';  // Example image import
// import steeringCoverImage from './assets/Steering.png';
// import engineImage from './assets/engine.png';
// import batteryimage from './assets/Battery.png';
// import headlightimage from './assets/Headlight.png';

const Store = () => {
  const [parts, setParts] = useState([
    {
      id: 1,
      name: "BEARING",
      qty: 20,
      unitPrice: 2300,
      brand: "Nachi",
      model: null,
      warranty: "no warranty",
      changed: false,
      imgSrc: 'https://www.google.com/imgres?q=bearings&imgurl=https%3A%2F%2Foilfieldmaterial.com%2Fimages%2Fdetailed%2F8%2Fbearings.jpg&imgrefurl=https%3A%2F%2Foilfieldmaterial.com%2Fbearings%2Ftop-industrial-bearings%2F&docid=Iniq1gdsMX2_vM&tbnid=4vDK0egEd3G2VM&w=5625&h=3750&hcb=2',  // Example image URL
      //imgSrc: bearingImage,  // Use the imported image without {}
    },
    {
      id: 2,
      name: "STEERING",
      qty: 20,
      unitPrice: 1200,
      brand: "Zodix",
      model: "Hybrid",
      warranty: "no warranty",
      changed: false,
      // imgSrc: steeringCoverImage,  // Use the imported image without {}
    },
    {
      id: 3,
      name: "ENGINE",
      qty: 20,
      unitPrice: 1200,
      brand: "Nachi",
      model: null,
      warranty: "no warranty",
      changed: false,
      // imgSrc: engineImage,  // Use the imported image without {}
    },
    {
      id: 4,
      name: "BATTERY",
      qty: 25,
      unitPrice: 1800,
      brand: "EXIDE",
      model: null,
      warranty: "no warranty",
      changed: false,
      // imgSrc: batteryimage,  // Use the imported image without {}
    },
    {
      id: 5,
      name: "HEADLIGHT",
      qty: 20,
      unitPrice: 2500,
      brand: "EXIDE",
      model: null,
      warranty: "no warranty",
      changed: false,
      // imgSrc: headlightimage,  // Use the imported image without {}
    },
  ]);

  const handleAdd = (id) => {
    const updatedParts = parts.map((part) => {
      if (part.id === id) {
        return { ...part, qty: part.qty + 1, changed: true };
      }
      return part;
    });
    setParts(updatedParts);
  };

  const handleDelete = (id) => {
    const updatedParts = parts.map((part) => {
      if (part.id === id && part.qty > 0) {
        return { ...part, qty: part.qty - 1, changed: true };
      }
      return part;
    });
    setParts(updatedParts);
  };

  const handleUpdatePrice = (id, newPrice) => {
    const updatedParts = parts.map((part) => {
      if (part.id === id && newPrice > 0) {
        return { ...part, unitPrice: newPrice, changed: true };
      }
      return part;
    });
    setParts(updatedParts);
  };

  return (
    <div className="car-parts">
      <div className="search-section">
        <input type="text" placeholder="Brand" />
        <input type="text" placeholder="Model" />
        <input type="text" placeholder="Year" />
        <button>SEARCH</button>
      </div>
      <div className="Addnewparts">
  <button>Add New Parts</button>
</div>
      {parts.map((part) => (
        <div key={part.id} className="part-item">
          <div className="image-container"> {/* New div for image and name */}
            <img src={part.imgSrc} alt={part.name} className="part-image" />
            <p className="part-name">{part.name}</p> {/* Added name below the image */}
          </div>
          <div className="part-details">
            <p>QTY: {part.qty}pcs</p>
            <p>Unit price: Rs {part.unitPrice}</p>
            <p>Brand: {part.brand}</p>
            {part.model && <p>Model: {part.model}</p>}
            <p>Warranty: {part.warranty}</p>
          </div>
          <div className="actions">
            <button onClick={() => handleAdd(part.id)}>Add Item</button>
            <button onClick={() => handleDelete(part.id)}>Delete Item</button>
            <button onClick={() => handleUpdatePrice(part.id)}>Update Price</button>
            {part.changed && <p className="status-changed">Changed</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Store;
