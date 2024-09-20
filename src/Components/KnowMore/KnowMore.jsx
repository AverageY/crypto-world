import React from 'react';
import crypto_logo from '../../assets/crypto-logo.png';
import { useNavigate } from 'react-router-dom';
import knowMore from '../../assets/knowMore.webp'
const KnowMore = () => {
  const navigate = useNavigate();

  // Create a function that will be called when the button is clicked
  const handleNavigate = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="w-full p-4 bg-black flex items-center justify-between" style={{ boxShadow: '0 0px 12px rgba(255, 255, 255, 0.5)' }}>
        <img src={crypto_logo} style={{ width: '50px', height: '50px' }} alt="Crypto Logo" />

        <div className="flex space-x-4">
          {/* Use the handleNavigate function in the onClick handler */}
          <button 
            onClick={handleNavigate}
            className="border border-white text-white bg-black px-4 py-2 hover:bg-white hover:text-black transition duration-300"
          >
            X
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row h-screen min-h-screen bg-gradient-to-b from-black to-gray-800 text-white font-sans overflow-x-hidden">
        {/* Left Section - Image */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full">
          <img
            src={knowMore}
            alt="Know More"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Section - Content */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center p-8">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg mb-6">
          Our platform offers a comprehensive suite of services for cryptocurrency enthusiasts and investors. With seamless integration through MetaMask, users can easily send and receive crypto assets securely. We provide detailed historical data for various cryptocurrencies, allowing users to track performance trends over time and make informed decisions. The platform also features a customizable watchlist, enabling users to monitor their favorite cryptocurrencies at a glance. To keep users informed, we aggregate the latest crypto news, providing real-time updates on market trends and developments. Additionally, users can access a complete transaction history, giving them a clear overview of their past activities and ensuring transparency in their crypto dealings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KnowMore;
