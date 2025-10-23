import { useState, useEffect } from 'react';
import { MdDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import axios from 'axios';

function MechanicProfile() {
  const [mechanics, setAllMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Avatar styles array
  const avatarStyles = [
    'avataaars-neutral',    
    'bottts-neutral',       
    'initials',            
    'identicon',           
    'pixel-art-neutral',   
    'shapes',              
    'thumbs',
  ];

  // Generate random avatar URL
  const getRandomAvatar = (seed) => {
    const randomStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}`;
  };

  // Add this function for fixed random rating
  const getFixedRandomRating = (mechanicId) => {
    const seed = mechanicId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ((seed % 50) / 10); 
  };

  const getFixedRandomExperience = (mechanicId) => {
    const seed = mechanicId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (seed % 10) + 1;
  };

  const getFixedRandomGradient = (mechanicId) => {
    const gradients = [
      'bg-gradient-to-r from-blue-500 to-indigo-600',
      'bg-gradient-to-r from-purple-500 to-pink-600',
      'bg-gradient-to-r from-emerald-500 to-teal-600',
      'bg-gradient-to-r from-orange-500 to-red-600',
      'bg-gradient-to-r from-cyan-500 to-blue-600',
      'bg-gradient-to-r from-violet-500 to-purple-600',
      'bg-gradient-to-r from-rose-500 to-pink-600',
    ];
    
    const seed = mechanicId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[seed % gradients.length];
  };

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api//bookingSlot/getAllMechanics",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == "200") {
          // Add avatar URL to each mechanic
          const mechanicsWithAvatars = response.data.data.map(mechanic => ({
            ...mechanic,
            profile: mechanic.profile || getRandomAvatar(mechanic._id)
          }));
          setAllMechanics(mechanicsWithAvatars);
        }
      } catch (error) {
        console.error("Error during getting mechanics", error);
      }
    };

    fetchMechanics();
  }, []);

  const handleMechanicClick = (mechanic) => {
    setSelectedMechanic(mechanic);
    setShowModal(true);
  };

  // Star Rating component
  const StarRating = ({ rating, light = false }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${
              index < Math.floor(rating)
                ? light ? 'text-white' : 'text-yellow-400'
                : light ? 'text-white/30' : 'text-gray-300'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className={`ml-1 text-sm ${light ? 'text-white' : 'text-gray-600'}`}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b-2">
        <h1 className="m-4 text-[36px] text-primary-color font-bold uppercase">
          Mechanic Profile
        </h1>
        <Link
          to={"/admin/dashboard"}
          className="text-[24px] mr-4 cursor-pointer"
        >
          <MdDashboard />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {mechanics.map((mechanic) => (
          <div
            key={mechanic._id}
            onClick={() => handleMechanicClick(mechanic)}
            className={`${getFixedRandomGradient(mechanic._id)} 
              p-6 rounded-xl shadow-lg hover:shadow-2xl 
              transition-all duration-300 transform hover:-translate-y-1 
              cursor-pointer`}
          >
            <div className="text-white space-y-3">
              <div className="flex items-center space-x-4">
                <img
                  src={getRandomAvatar(mechanic._id)}
                  alt="avatar"
                  className="w-16 h-16 rounded-full bg-white p-1"
                />
                <div>
                  <h3 className="text-xl font-semibold">{mechanic.firstname} {mechanic.lastname}</h3>
                  <p className="text-white/80">{mechanic.email}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-white/80">Experience</p>
                  <p className="font-medium">{getFixedRandomExperience(mechanic._id)} years</p>
                </div>
                <div>
                  <p className="text-sm text-white/80">Rating</p>
                  <StarRating rating={getFixedRandomRating(mechanic._id)} light={true} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedMechanic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-lg p-4 max-w-xl w-11/12" // Reduced padding
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-3"> {/* Reduced gap */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mechanic Details</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-white-700 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center">
                  <img 
                    src={selectedMechanic.profile || `${CgProfile}`}
                    alt="Profile" 
                    className="w-40 h-40 rounded-full object-cover ring-4 ring-primary-color"
                  />
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedMechanic.firstname} {selectedMechanic.lastname}
                  </h3>
                  <div className="text-gray-600">
                    <p>{selectedMechanic.email}</p>
                    <p>{selectedMechanic.phone}</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold
                    ${selectedMechanic.status === "IN" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"}`}
                  >
                    {selectedMechanic.status}
                  </span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="text-gray-700">
                    {selectedMechanic.address || "No address provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2"> {/* Reduced gap */}
                  <div className="bg-gray-50 p-3 rounded-lg"> {/* Reduced padding */}
                    <p className="text-sm text-gray-500">Rating</p>
                    <StarRating rating={getFixedRandomRating(selectedMechanic._id)} />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-semibold">
                      {getFixedRandomExperience(selectedMechanic._id)} years
                    </p>
                  </div>
                </div>

                {selectedMechanic.description && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">About</p>
                    <p className="text-gray-700">{selectedMechanic.description}</p>
                  </div>
                )}

                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MechanicProfile;
