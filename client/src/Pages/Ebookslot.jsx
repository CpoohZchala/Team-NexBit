import React from 'react';
import './Ebookslot.css'; // Assuming you'll style in a CSS file

const SlotBooking = () => {
  return (
    <div className="booking-container">
      <div className="booking-box">
        <h1>Book Slot Service</h1>
        <p>Customer need to Book the slot</p>
        <div className="mechanic-info">
          <p>Mechanic</p>
          <p>Mr. Abdullah</p>
          <p>It's your time</p>
        </div>
       
        <div className="action-buttons">
          <button className="confirm-btn">
            <p>Confirm</p>
          </button>
          <button className="cancel-btn">
          <p>Cancel</p>     
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotBooking;
