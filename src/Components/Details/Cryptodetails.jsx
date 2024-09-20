import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import LoaderComp from '../Loader/LoaderComp';
import ErrorComponent from '../Error/ErrorComp';
// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoHistoricalData = () => {
  const [cryptoId, setCryptoId] = useState('bitcoin'); // Default cryptoId
  const [selectedCrypto, setSelectedCrypto] = useState(null); // Store selected crypto before searching
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cryptoList, setCryptoList] = useState([]); // List of available cryptocurrencies
  const [searchTerm, setSearchTerm] = useState(''); // Search term for the search bar
  const [isSearchListVisible, setIsSearchListVisible] = useState(false); // Controls visibility of search list
  const [timeRange, setTimeRange] = useState('30'); // Default time range (30 days)

  // Fetch list of cryptocurrencies with their icons for search functionality
  const fetchCryptoList = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 250, // Number of coins to fetch, you can adjust this number
          page: 1,
          sparkline: false
        }
      });
      setCryptoList(response.data);
    } catch (error) {
      console.error('Error fetching cryptocurrency list:', error);
      setError('Failed to load cryptocurrency list');
    }
  };

  // Fetch historical data for the selected cryptocurrency and time range
  const fetchHistoricalData = async () => {
    if (!cryptoId) return;

    setLoading(true); // Set loading state before fetching
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: timeRange, // Fetch data for the selected time range
          interval: timeRange <= 7 ? 'hourly' : 'daily' // Use 'hourly' for short ranges and 'daily' for longer
        }
      });
      setHistoricalData(response.data.prices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setError('Failed to load historical data. Please check the cryptocurrency ID.');
      setLoading(false);
    }
  };

  // Fetch crypto list once on component mount
  useEffect(() => {
    fetchCryptoList();
  }, []);

  // Fetch historical data whenever cryptoId or timeRange changes
  useEffect(() => {
    fetchHistoricalData();
  }, [cryptoId, timeRange]);

  // Handle search and selection of cryptocurrency
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setIsSearchListVisible(true); // Show the list when typing
  };

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto); // Store the selected cryptocurrency temporarily
    setSearchTerm(crypto.name); // Set the search bar value to the selected crypto name
    setIsSearchListVisible(false); // Hide the search list
    setError(null); // Clear any previous errors
  };

  // Handle search bar focus to show the list
  const handleSearchFocus = () => {
    setIsSearchListVisible(true);
  };

  // Handle time range change
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (selectedCrypto) {
      setCryptoId(selectedCrypto.id); // Set the cryptoId for the graph update
    }
  };

  // Prepare data for Chart.js
  const chartData = {
    labels: historicalData.map((data) => {
      const date = new Date(data[0]);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: `${cryptoId} Price (USD)`,
        data: historicalData.map((data) => data[1]),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${cryptoId} Price Chart (${timeRange} Days)`,
      },
    },
  };

  if (loading) return <div><LoaderComp/></div>;
  if (error) return <div><ErrorComponent/></div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historical Data for Cryptocurrencies</h2>

      {/* Search bar for selecting a cryptocurrency */}
      <div className="mb-4 relative">
        <input
          type="text"
          className="border rounded w-full py-2 px-3"
          placeholder="Search cryptocurrency..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
        />
        {isSearchListVisible && (
          <div className="absolute z-10 w-full bg-white max-h-48 overflow-y-auto border rounded mt-1">
            {cryptoList
              .filter((crypto) => crypto.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .slice(0, 10) // Limit the number of suggestions shown for performance
              .map((crypto) => (
                <div
                  key={crypto.id}
                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center"
                  onClick={() => handleCryptoSelect(crypto)}
                >
                  <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-2" />
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Time range selector and Search button */}
      <div className="mb-4 flex items-center space-x-4">
        <div>
          <label className="block mb-2">Select Time Range:</label>
          <select
            className="border rounded py-2 px-3"
            value={timeRange}
            onChange={handleTimeRangeChange}
          >
            <option value="7">1 Week</option>
            <option value="30">1 Month</option>
            <option value="90">3 Months</option>
            <option value="365">1 Year</option>
            <option value="1825">5 Years</option>
          </select>
        </div>
        <button
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>

      {/* Line chart for historical data */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CryptoHistoricalData;
