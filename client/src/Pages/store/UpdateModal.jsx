import { useState } from 'react';

const UpdateModal = ({ part, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(part.itemQuantity);
  const [price, setPrice] = useState(part.itemPrice);


  
  const handleSave = () => {
    // Ensure numeric values when saving
    const qty = Number(quantity);
    const pr = Number(price);
    onSave({ ...part, itemQuantity: isNaN(qty) ? 0 : Math.max(0, qty), itemPrice: isNaN(pr) ? pr : pr });
  };

  if (!part) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Update {part.itemName}</h2>
        <div className="mb-4">
          <label className="block mb-2">Quantity</label>
          <input
            type="number"
            min={0}
            step={1}
            value={quantity}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") {
                setQuantity(0);
                return;
              }
              const parsed = parseInt(raw, 10);
              if (Number.isNaN(parsed)) {
                setQuantity(0);
                return;
              }
              setQuantity(Math.max(0, parsed));
            }}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;