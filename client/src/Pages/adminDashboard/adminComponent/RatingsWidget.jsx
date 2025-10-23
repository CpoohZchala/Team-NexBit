// adminComponent/RatingsWidget.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const RatingsWidget = () => {
  const [averageRating, setAverageRating] = useState(0);
  const [recentRatings, setRecentRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const [avgResponse, recentResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/ratings/average'),
          axios.get('http://localhost:3000/api/ratings/recent')
        ]);
        setAverageRating(avgResponse.data.averageRating);
        setRecentRatings(recentResponse.data);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };
    fetchRatings();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Service Ratings</h3>
      <div className="text-3xl font-bold text-yellow-500 mb-4">
        {averageRating.toFixed(1)} / 5.0
      </div>
      <div className="space-y-4">
        {recentRatings.map(rating => (
          <div key={rating._id} className="border-b pb-2">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  color={i < rating.rating ? "#ffc107" : "#e4e5e9"}
                  size={16}
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-1">{rating.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingsWidget;