import './Offerpage.css';
import { Clock, Settings, Shield, Car } from 'lucide-react';
import Navbar from '../components/Navbar';

const OffersPage = () => {
  const offers = [
    {
      title: "Complete Car Service",
      description: "Comprehensive service package including oil change, filter replacement, and full inspection",
      discount: "25% OFF",
      validity: "Valid till Dec 2024",
      icon: Settings,
      features: ["Free pickup & drop", "Genuine parts", "90 days warranty"],
      color: "#4F46E5" // Indigo
    },
    {
      title: "Periodic Maintenance",
      description: "Regular maintenance service to keep your vehicle in top condition",
      discount: "20% OFF",
      validity: "Valid till Nov 2024",
      icon: Car,
      features: ["Multi-point inspection", "Free car wash", "Service reminder"],
      color: "#2563EB" // Blue
    },
    {
      title: "AC Service Special",
      description: "Complete AC system check and service with gas refill",
      discount: "30% OFF",
      validity: "Valid till Oct 2024",
      icon: Settings,
      features: ["Gas leak check", "Filter cleaning", "Performance test"],
      color: "#7C3AED" // Purple
    },
    {
      title: "Engine Protection",
      description: "Advanced engine diagnosis and protection package",
      discount: "15% OFF",
      validity: "Valid till Sep 2024",
      icon: Shield,
      features: ["Engine scanning", "Oil treatment", "Performance boost"],
      color: "#DC2626" // Red
    }
  ];

  return (
    
    <div className="offers-container">
      <div><Navbar/></div>
      
      <div className="offers-header">
        <h1>Special Offers</h1>

      </div>

      <div className="offers-grid">
        {offers.map((offer, index) => (
          <div key={index} className="offer-card">
            <div className="offer-header">
              <div className="offer-title">
                <offer.icon size={24} color={offer.color} />
                <h2>{offer.title}</h2>
              </div>
              <span className="discount-badge" style={{ backgroundColor: offer.color }}>
                {offer.discount}
              </span>
            </div>

            <p className="offer-description">{offer.description}</p>

            <div className="offer-features">
              {offer.features.map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <span className="feature-dot" style={{ backgroundColor: offer.color }}></span>
                  {feature}
                </div>
              ))}
            </div>

            <div className="offer-validity">
              <Clock size={16} />
              <span>{offer.validity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;