import React from 'react';
import './ServicePage.css';
import Navbar from "../components/Navbar"

const ServicesPage = () => {
  return (
    <div className="services-background">
       <Navbar/>
      <div className="services-container">
       
        <div className="header">
          <h2>Our Vehicle Service Solutions</h2>
          <p>Offering a range of services to keep your vehicle in perfect condition, from regular maintenance to collision repairs.</p>
        </div>
      
        <div className="services-list">
          <div className="service-category">
            <h3>Periodic Maintenance</h3>
            <p>Keep your vehicle running smoothly with our comprehensive maintenance packages. We provide expert washing, lubing, and detailing services to ensure your vehicle stays in top condition.</p>
            <ul>
              <li>🚿 Washing Packages</li>
              <li>🔧 Lube Services</li>
              <li>🚗 Exterior & Interior Detailing</li>
              <li>🛠️ Engine Tune ups</li>
              <li>🪟 Windscreen Treatments</li>
            </ul>
          </div>

          <div className="service-category">
            <h3>Nano Coating</h3>
            <p>Protect your car’s paint and undercarriage with our premium nano coating services. We offer durable treatments that provide a high gloss finish and lasting protection.</p>
            <ul>
              <li>📦 Packages</li>
              <li>🔩 Undercarriage Degreasing</li>
              <li>🧴 Treatments</li>
            </ul>
          </div>

          <div className="service-category">
            <h3>Tyre Services</h3>
            <p>We offer a full range of tyre services to keep you safe on the road. From battery checks to waxing and tyre replacements, we’ve got you covered.</p>
            <ul>
              <li>🔋 Battery Services</li>
              <li>✨ Waxing</li>
              <li>🚙 Tyre Replacements</li>
            </ul>
          </div>

          <div className="service-category">
            <h3>Mechanical Repair</h3>
            <p>Our experienced technicians are equipped to handle all mechanical repairs, including spare parts replacements, inspections, and hybrid services.</p>
            <ul>
              <li>🔧 Spare Parts Replacements</li>
              <li>📑 Inspection Reports</li>
              <li>🔋 Hybrid Services</li>
            </ul>
          </div>

          <div className="service-category">
            <h3>Collision Repairs</h3>
            <p>We offer comprehensive collision repair services, including insurance claims, wheel alignment, full paint jobs, and part replacements to restore your vehicle.</p>
            <ul>
              <li>📋 Insurance Claims</li>
              <li>📐 Wheel Alignment</li>
              <li>🎨 Full Paints</li>
              <li>🧰 Part Replacements</li>
            </ul>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ServicesPage;
