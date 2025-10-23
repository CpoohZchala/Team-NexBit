import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { useEffect, useState } from 'react';

const PaymentSuccess = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        await axios.get(`http://localhost:3000/api/changePaymentStatus/${id}`);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleReturnHome = async () => {
    window.location.href = "http://localhost:5173/";
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRatingSubmit = async () => {
    try {
      await axios.post('http://localhost:3000/api/ratings', {
        bookingId: id,
        rating,
        feedback
      });
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful</h1>
        <p className="text-gray-600 mb-6">Thank you for your payment. Your transaction was successful.</p>
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handlePrint}
          >
            Print
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleReturnHome}
          >
            Return to Home
          </button>
        </div>
        <div className="rating-section mt-8">
          <h3 className="text-xl font-semibold mb-4">Rate Our Service</h3>
          <div className="flex gap-2 mb-4">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <FaStar
                  key={index}
                  className="cursor-pointer"
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  size={24}
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(rating)}
                />
              );
            })}
          </div>
          <textarea
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Share your experience (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button
            onClick={handleRatingSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;