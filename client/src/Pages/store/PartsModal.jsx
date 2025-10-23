

const PartsModal = ({ part, onClose, onUpdate, onDelete }) => {
  if (!part) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white  p-4 rounded-lg w-1/4 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4  ">{part.itemName}</h2>
        <div className="mb-4 flex flex-col w-[100%] justify-center ">
        <div className="flex justify-center">
          <img src={part.itemImage} alt={part.itemName} className="w-[200px] h-[120px] object-cover mb-4" />
        </div>
        <div className="flex flex-col text-center ">
          <p><strong>Item Code:</strong> {part.itemCode}</p>
          <p><strong>Price:</strong> {part.itemPrice}/=</p>
          <p><strong>Description:</strong> {part.description}</p>
          <p><strong>Quantity:</strong> {part.itemQuantity}</p>
        </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
          <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PartsModal;