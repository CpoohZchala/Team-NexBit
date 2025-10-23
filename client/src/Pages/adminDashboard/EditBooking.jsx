import { useState } from "react";

function EditBookingModal({ currentBooking, allMechanics, onClose, onSubmit }) {
  const [assignedMechanic, setAssignedMechanic] = useState(currentBooking.mechanicId._id);

  const handleMechanicChange = (e) => {
    setAssignedMechanic(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(assignedMechanic);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10001] bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Edit Booking</h2>
        <form onSubmit={handleSubmit}>
          {/* User Name (Read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">User Name</label>
            <input
              type="text"
              value={currentBooking.userId.fullname}
              readOnly
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Date and Time (Read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Mechanic Name</label>
            <input
              type="text"
              value={`${currentBooking.mechanicId.firstname} ${currentBooking.mechanicId.lastname}`}
              readOnly
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Status (Read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <input
              type="text"
              value={currentBooking.isAccepted}
              readOnly
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Mechanic Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Assign Mechanic</label>
            <select
              value={assignedMechanic}
              onChange={handleMechanicChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-white"
            >
              {allMechanics.map((mechanic) => (
                <option key={mechanic._id} value={mechanic._id}>
                  {mechanic.firstname} {mechanic.lastname}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBookingModal;
