import './EBService.css'; // Add necessary CSS styles here
import  ImageT from '../assets/photos/T.png'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar"



function EBService() {

  const navigate = useNavigate();

  const handleBookservice = () => {
    navigate('/bdetails')
  };


    const handleEmergencyService = () => {
      navigate('/emergencyservice')
  };

  return (
    <div className="EBService">
      <div className='mt-10'><Navbar /></div>
      
      <main>
        {/* Slot Booking Section */} 
        <section className="slot-booking-section">
          <h1>Book Your Service Slot in Seconds!</h1>
          <p>
            Skip the wait and secure your spot with our easy online slot booking. 
            Choose your preferred<br/> time, and let us take care of your vehicle-quick, hassle-free, and at your convenience.
          </p>
          
            <button className="book-service-button" onClick={handleBookservice}>Book Service</button>
        </section>
        <img className='ImageT' src={ImageT} />

        {/* Emergency Section */}
        
        {/* <section className="emergency-section">
        <button className="emergency-service-button"  onClick={handleEmergencyService}>Emergency Service</button>
        
          <h1>Help When You Need It Most !</h1>
          <p>
            Car trouble? We’re just a call away! Whether it’s a flat tire, engine failure, or you’re out of<br/> gas, 
            our team is available 24/7 to help you on the spot. Quick, reliable, and always ready!
          </p>
         
        </section> */}
      </main>
      <div className="background-design"></div>
    </div>
  );
}


export default EBService;
