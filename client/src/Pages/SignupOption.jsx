import './SignupOption.css'; 
import logo2 from '../assets/photos/logo.png'; 
import employeeImage from '../assets/photos/Esignup.png'; 
import customerImage from '../assets/photos/Csignup.png'; 
import { useNavigate } from 'react-router-dom';



function SignupOption () {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/esignup');
  }

  const handleCustomerClick = () => {
    navigate('/csignup');
  }

 return (
    <div className="signupoption-container">
      <div className="logo-wrapper">
      <img src={logo2} />
      </div>
      
      <div className="signup-content">
        <div className="signup-options">
          <div className="signup-option">
            <h2 className="option-title">
              <span className="highlight">Mechanic</span>
              <br />Sign up
            </h2>
            <button 
              className="image-button"
              onClick={handleClick}
            >
              <img src={employeeImage} />
            </button>
          </div>

          <div className="signup-option">
            <h2 className="option-title">
              <span className="highlight">Customer</span>
              <br />Sign up
            </h2>
            <button 
              className="image-button"
              onClick={handleCustomerClick}
            >
             <img src={customerImage} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default SignupOption;