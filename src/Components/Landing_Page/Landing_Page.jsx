// src/Components/Landing_Page/LandingPage.js
import React from 'react';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './LandingPage.css';
import crypto_logo from '../../assets/crypto-logo.png';
import CryptoCanvas from '../bitcoin_canvas/crypto_canvas';

const LandingPage = () => {
  // Correct usage of useNavigate
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
  const navigate = useNavigate();
  useEffect(() => {
    // Redirect to the dashboard if authenticated
    if (isAuthenticated) {
      navigate('/dashboard'); // Adjust the path to your desired component
    }
  }, [isAuthenticated, navigate]);


  return (
    <ParallaxProvider>
      <div className="landing-page">
        {/* Hero Section */}
        <div className="w-full p-4 bg-black flex items-center justify-between" style={{ boxShadow: '0 0px 12px rgba(255, 255, 255, 0.5)' }}>
          <img src={crypto_logo} style={{ width: '50px', height: '50px' }} alt="Crypto Logo" />

          <div className="flex space-x-4">
            {/* Corrected onClick handler */}
            <button 
              onClick={() => loginWithRedirect({ connection: 'google-oauth2' })}
              className="border border-white text-white bg-black px-4 py-2 hover:bg-white hover:text-black transition duration-300"
            >
              Login With Google
            </button>
          </div>
        </div>
        
        <section className="hero">
          <CryptoCanvas/>
        </section>
      </div>
    </ParallaxProvider>
  );
};

export default LandingPage;
