// BookService.jsx
import './BookService.css'; 
//import Footer from './components/Footer';
import logo from './assets/logo1.png'; 
import carServiceImage from'./assets/bookemergency.png';

function BookService() {
  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="Auto Care Logo" className="logo" />
      </header>

      <div className="main-content">
        <div className="button-container">
          <button className="service-button">Book Service</button>
          <button className="service-button">Emergency Service</button>
        </div>

        <div className="image-container">
          <img src={carServiceImage} alt="Car Service" className="car-service-image" />
        </div>
      </div>
    </div>
  );
}

export default BookService;
