import React from 'react';
import crypto_logo from '../../assets/crypto-logo.png';

const GoogleLogin = () => {
  // Placeholder function for the Google login process
  const handleGoogleLogin = () => {
    // Logic for Google login goes here
    console.log('Google login clicked');
  };

  return (
    <div className="google-login min-h-screen bg-gradient-to-b from-black to-gray-800 text-white font-sans overflow-x-hidden">
      <div className="w-full p-4 bg-black flex items-center justify-between shadow-md" style={{ boxShadow: '0 0px 12px rgba(255, 255, 255, 0.5)' }}>
        <img src={crypto_logo} style={{ width: '50px', height: '50px' }} alt="Crypto Logo" />

        <div className="flex space-x-4">
          <button 
            className="border border-white text-white bg-black px-4 py-2 hover:bg-white hover:text-black transition duration-300"
          >
            X
          </button>
        </div>
      </div>

      {/* Google Login Section */}
      <div className="flex flex-col items-center justify-center min-h-screen -mt-20">
        <button 
          onClick={handleGoogleLogin} 
          className="bg-white text-black font-semibold py-2 px-4 rounded shadow-lg hover:bg-gray-200 transition duration-300"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default GoogleLogin;
