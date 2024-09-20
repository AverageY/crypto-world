import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0
import Cryptocurrency from '../Cryptocurrency/Cryptocurrency';
import Watchlist from '../WatchList/Watchlist';
import Sendcrypto from '../Sendcrypto/Sendcrypto';
import Cryptodetails from '../Details/Cryptodetails';
import CryptoNews from '../News/News';
import { useEffect } from 'react';
import axios from 'axios';





const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('Tab1');
  const [watchlist, setWatchlist] = useState([]);
  
  const { user, logout, isAuthenticated, getAccessTokenSilently } = useAuth0(); // Use Auth0 functions

  const addToWatchlist = async (crypto) => {
    try {
      // Post the crypto name to the backend
      await axios.post('http://localhost:5001/api/watchlist/add', { name: crypto.name });
      
      // Update the frontend watchlist
      setWatchlist((prevWatchlist) => {
        if (prevWatchlist.some((item) => item.id === crypto.id)) {
          alert(`${crypto.name} is already in your watchlist!`);
          return prevWatchlist;
        }
        return [...prevWatchlist, crypto];
      });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };
  


  useEffect(() => {
    const saveUserToDB = async () => {
      if (isAuthenticated && user) {
        try {
          // Get the token from Auth0
          const token = await getAccessTokenSilently({
            audience: 'https://mycryptoworld/api', // Ensure this matches the API identifier
            scope: 'read:crypto write:crypto', // Include required scopes if necessary
          });
          console.log('Access Token:', token);
  
          // Send the user data to the backend
          await axios.post('http://localhost:5001/auth/save-user', {
            user,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Error fetching access token or saving user to DB:', error);
  
          // Handle specific Auth0 errors
          if (error.error === 'login_required') {
            console.log('User needs to log in.');
          } else if (error.error === 'consent_required') {
            console.log('User needs to consent to scopes.');
          } else {
            console.log('An unknown error occurred:', error.message);
          }
        }
      }
    };
  
    saveUserToDB();
  }, [isAuthenticated, user, getAccessTokenSilently]);
  

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-black text-white flex flex-col justify-between p-4">
        <div>
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-100 mb-4">Crypto</h1>
          </div>
          {/* Tabs */}
          <ul className="flex flex-col space-y-4">
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeTab === 'Tab1' ? 'bg-gray-800' : ''
                }`}
                onClick={() => handleTabClick('Tab1')}
              >
                Crypto Currency
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeTab === 'Tab2' ? 'bg-gray-800' : ''
                }`}
                onClick={() => handleTabClick('Tab2')}
              >
                Watch List
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeTab === 'Tab3' ? 'bg-gray-800' : ''
                }`}
                onClick={() => handleTabClick('Tab3')}
              >
                Send Crypto
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeTab === 'Tab4' ? 'bg-gray-800' : ''
                }`}
                onClick={() => handleTabClick('Tab4')}
              >
                News
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeTab === 'Tab5' ? 'bg-gray-800' : ''
                }`}
                onClick={() => handleTabClick('Tab5')}
              >
                Details
              </button>
            </li>
          </ul>
        </div>

        {/* User Profile and Logout */}
        {isAuthenticated && (
          <div className="mt-auto">
            {/* User Profile */}
            <div className="flex items-center space-x-2 mb-4">
              {user.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <span>{user.name}</span>
            </div>
            {/* Logout Button */}
            <button
              onClick={() => logout({ returnTo: window.location.origin + '/' })} // Redirect to landing page after logout
              className="w-full p-2 bg-red-600 hover:bg-red-700 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        {activeTab === 'Tab1' && <div><Cryptocurrency addToWatchlist={addToWatchlist} watchlist={watchlist}/></div>}
        {activeTab === 'Tab2' && <div><Watchlist watchlist={watchlist}/></div>}
        {activeTab === 'Tab3' && <div><Sendcrypto/></div>}
        {activeTab === 'Tab4' && <div><CryptoNews/></div>}
        {activeTab === 'Tab5' && <div><Cryptodetails/></div>}
      </div>
    </div>
  );
};

export default Sidebar;
