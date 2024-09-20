import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoaderComp from '../Loader/LoaderComp';
import ErrorComponent from '../Error/ErrorComp';
const CryptoNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Your RapidAPI key
  const API_KEY = '6e0409d9b0mshcf1663cc029436cp10e578jsn79b832180a34'; // Replace with your RapidAPI key

  // Fetch top 10 crypto news using Bing News API via RapidAPI
  const fetchCryptoNews = async () => {
    try {
      const response = await axios.get('https://bing-news-search1.p.rapidapi.com/news/search', {
        params: {
          q: 'cryptocurrency',
          safeSearch: 'Off',
          textFormat: 'Raw',
          freshnesss: 'Day',
          count: '10',
        },
        headers: {
                'x-rapidapi-key': '6e0409d9b0mshcf1663cc029436cp10e578jsn79b832180a34',
                'x-rapidapi-host': 'bing-news-search1.p.rapidapi.com',
                'X-BingApis-SDK': 'true'
          },
      });
      setNews(response.data.value); // Assuming the API returns articles in response.data.value
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto news:', error);
      setError('Failed to load news articles. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoNews();
  }, []);

  if (loading) return <div><LoaderComp/></div>;
  if (error) return <div><ErrorComponent/></div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Top 10 Cryptocurrency News</h2>
      <div className="space-y-4">
        {news.map((article, index) => (
          <div key={index} className="border p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {article.name}
              </a>
            </h3>
            <p className="text-sm text-gray-600">{article.provider[0].name} - {new Date(article.datePublished).toLocaleDateString()}</p>
            <p className="mt-2">{article.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoNews;
