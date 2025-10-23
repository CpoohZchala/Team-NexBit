import { useNavigate } from 'react-router-dom';
import { GiCancel } from "react-icons/gi";

const PaymentCancel = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 w-[100%]">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col justify-center items-center text-center">
        <GiCancel className='w-[200px] h-[200px] mb-4' />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Canceled</h1>
        <p className="text-gray-600 mb-6">Your payment was not completed. If you have any questions, please contact support.</p>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={handleReturnHome}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;