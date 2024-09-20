import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import LoaderComp from '../Loader/LoaderComp';
import ErrorComponent from '../Error/ErrorComp';

const CryptoCurrencyList = () => {
  const [cryptos, setCryptos] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user, getAccessTokenSilently } = useAuth0(); // Auth0 hook for user and token

  // Fetch cryptos from CoinGecko
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 50,
            page: 1,
          }
        });
        setCryptos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching crypto data", error);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  // Fetch the user's watchlist from the backend
 

  // Check if a crypto is in the user's watchlist
  const isInWatchlist = (crypto) => {
    return watchlist.includes(crypto.name);
  };

  // Toggle the crypto in the watchlist
  const toggleWatchlist = async (crypto) => {
    if (!user) return;

    if (isInWatchlist(crypto)) {
      try {
        const token = await getAccessTokenSilently();
        await axios.delete('https://crypto-world-backend.onrender.com/api/watchlist/remove', {
          data: { cryptoName: crypto.name, userId: user.sub },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWatchlist((prevWatchlist) => prevWatchlist.filter((name) => name !== crypto.name));
      } catch (error) {
        console.error('Error removing from watchlist:', error);
      }
    } else {
      try {
        const token = await getAccessTokenSilently();
        await axios.post('https://crypto-world-backend.onrender.com/api/watchlist/add', 
          { cryptoName: crypto.name, userId: user.sub }, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWatchlist((prevWatchlist) => [...prevWatchlist, crypto.name]);
      } catch (error) {
        console.error('Error adding to watchlist:', error);
      }
    }
  };

  if (loading) return <LoaderComp />;
  if (error) return <ErrorComponent />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Top Cryptocurrencies</h1>

      <div className="max-h-[700px] overflow-y-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Rank</th>
              <th className="py-2">Name</th>
              <th className="py-2">Symbol</th>
              <th className="py-2">Price</th>
              <th className="py-2">Market Cap</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto) => (
              <tr key={crypto.id} className="border-b">
                <td className="py-2 px-4">{crypto.market_cap_rank}</td>
                <td className="py-2 px-4">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="inline-block w-6 h-6 mr-2"
                  />
                  {crypto.name}
                </td>
                <td className="py-2 px-4">{crypto.symbol.toUpperCase()}</td>
                <td className="py-2 px-4">${crypto.current_price.toLocaleString()}</td>
                <td className="py-2 px-4">${crypto.market_cap.toLocaleString()}</td>
                <td className="py-2 px-4">
                  {isInWatchlist(crypto) ? (
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => toggleWatchlist(crypto)}
                    >
                      Remove from Watchlist
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded"
                      onClick={() => toggleWatchlist(crypto)}
                    >
                      Add to Watchlist
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoCurrencyList;
