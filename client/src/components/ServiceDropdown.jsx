// ServicesDropdown.jsx
import React, { useState } from 'react';
import './ServiceDropdown.css';

const ServicesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const services = {
    'PERIODIC MAINTENANCE': [
      { icon: '❄️', name: 'Washing Packages' },
      { icon: '🛢️', name: 'Lube Services' },
      { icon: '🚗', name: 'Exterior & Interior Detailing' },
      { icon: '⚙️', name: 'Engine Tune ups' },
      { icon: '🚪', name: 'Windscreen Treatments' }
    ],
    'NANO COATING': [
      { icon: '📦', name: 'Packages' },
      { icon: '🔧', name: 'Undercarriage Degreasing' },
      { icon: '💆', name: 'Treatments' }
    ],
    'TYRE SERVICES': [
      { icon: '🔋', name: 'Battery Services' },
      { icon: '✨', name: 'Waxing' },
      { icon: '🛞', name: 'Tyre Replacements' }
    ],
    'MECHANICAL REPAIR': [
      { icon: '🔧', name: 'Spare Parts Replacements' },
      { icon: '📋', name: 'Inspection Reports' },
      { icon: '🔌', name: 'Hybrid Services' }
    ],
    'COLLISION REPAIRS': [
      { icon: '🏥', name: 'Insurance Claims' },
      { icon: '🎯', name: 'Wheel Alignment' },
      { icon: '🎨', name: 'Full Paints' },
      { icon: '🔧', name: 'Part Replacements' }
    ]
  };

  return (
    <div className="relative">
      <button
        className="services-button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >SERVICES
      </button>
      
      {isOpen && (
        <div
          className="services-dropdown"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {Object.entries(services).map(([category, items]) => (
            <div key={category} className="category">
              <h3 className="category-title">
                {category}
              </h3>
              <ul className="items-list">
                {items.map((item, index) => (
                  <li 
                    key={index}
                    className="item"
                  >
                    <span>{item.icon}</span>
                    <span className="item-name">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesDropdown;
