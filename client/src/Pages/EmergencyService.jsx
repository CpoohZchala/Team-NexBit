import React, { useState } from 'react';
import './EmergencyService.css';

function EmergencyService() {
  const [location, setLocation] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [issue, setIssue] = useState('');
  const [mapUrl, setMapUrl] = useState(
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3015.1074397686016!2d81.00653637356052!3d7.943001092081179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afb4498aafe8671%3A0x2405a1f1e17a1028!2sDistrict%20General%20Hospital%20Polonnaruwa!5e1!3m2!1sen!2slk'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      const encodedLocation = encodeURIComponent(location);
      const newMapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedLocation}`;
      setMapUrl(newMapUrl);
    }
  };

  return (
    <div className="emergency">
      <div className="background-design"></div>
      <h1 className='heading'>Emergency Service</h1>
      <div className="eme-container">
        <div className="form-container-eme">
          <form onSubmit={handleSubmit}>
            <label>
              Customer Location
              <div>
                <input
                  className="emergency_input"
                  type="text"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </label>
            <label>
              Vehicle Number
              <div>
                <input
                  className="emergency_input"
                  type="text"
                  name="vehicleNumber"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                />
              </div>
            </label>
            <label>
              Vehicle Type
              <div>
                <input
                  className="emergency_input"
                  type="text"
                  name="vehicleType"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                />
              </div>
            </label>
            <label>
              What happened to vehicle?
              <div>
                <input
                  className="emergency_input"
                  type="text"
                  name="issue"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                />
              </div>
            </label>
            <button className='Continue' type="submit">Continue</button>
          </form>
        </div>
        <div className="map-container">
          <iframe
            src={mapUrl}
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Location Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default EmergencyService;