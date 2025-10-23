import Widget from './adminComponent/widget';
import BookingsEarningsGraph from './adminComponent/BookingsEarningsGraph';
import RatingsWidget from './adminComponent/RatingsWidget';
import "./ADashboard.css"; // Add your own styling

import { useState } from 'react';

const ADashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <div className={`Adashboard ${isDarkMode ? 'dark' : ''}`}>
  <h2 className="m-6 text-[56px] font-extrabold uppercase
    text-primary-color dark:text-white">
    Dashboard
  </h2>

      <div className="flex p-[20px] w-[100%] gap-[20px]">
        <Widget type="user" />
        <Widget type="mechanic" />
        <Widget type="earning" />
        <Widget type="booking" />
      </div>

      {/* Updated grid with 75/25 split */}
      <div className="flex gap-6 mt-8 px-[20px]">
        <div className="w-3/4">
          <BookingsEarningsGraph />
        </div>
        <div className="w-1/4">
          <RatingsWidget />
        </div>
      </div>
    </div>
  );
};

export default ADashboard;
