import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoaderComp from '../Loader/LoaderComp';
import ErrorComponent from '../Error/ErrorComp';
import { useAuth0 } from '@auth0/auth0-react';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cryptoData, setCryptoData] = useState([]);

  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;
      console.log(user.email);
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`http://localhost:5001/api/watchlist/${user.email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWatchlist(response.data);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    };

    fetchWatchlist();
  }, [user]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      if (watchlist.length > 0) {
        try {
          // Format watchlist items correctly: lowercase, hyphenate, and join with commas
          const formattedIds = watchlist.map(id => id.toLowerCase().replace(/\s+/g, '-')).join(',');
          console.log('Formatted IDs for CoinGecko API:', formattedIds); // Debugging log
  
          const coinGeckoUrl = `https://api.coingecko.com/api/v3/coins/markets`;
          const response = await axios.get(coinGeckoUrl, {
            params: {
              vs_currency: 'usd',
              ids: formattedIds, // Use the formatted watchlist IDs
              order: 'market_cap_desc',
            },
          });
  
          console.log('CoinGecko Response:', response.data); // Log the full response
  
          setCryptoData(response.data); // Set the fetched CoinGecko data to cryptoData
          setLoading(false);
        } catch (error) {
          console.error('Error fetching CoinGecko data:', error);
          setError('Failed to load cryptocurrency data');
          setLoading(false);
        }
      }
    };
  
    if (watchlist.length > 0) {
      fetchCryptoData();
    }
  }, [watchlist]);
  
  

  if (loading) return <div><LoaderComp /></div>;
  if (error) return <div><ErrorComponent /></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Watchlist</h1>
      <div className="max-h-[700px] overflow-y-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Symbol</th>
              <th className="py-2">Price</th>
              <th className="py-2">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto) => (
              <tr key={crypto.id} className="border-b">
                <td className="py-2 px-4">{crypto.name}</td>
                <td className="py-2 px-4">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="inline-block w-6 h-6 mr-2"
                  />
                </td>
                <td className="py-2 px-4">{crypto.symbol.toUpperCase()}</td>
                <td className="py-2 px-4">${crypto.current_price.toLocaleString()}</td>
                <td className="py-2 px-4">${crypto.market_cap.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Watchlist;
