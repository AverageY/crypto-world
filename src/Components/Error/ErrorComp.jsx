// ErrorComponent.js
import React from 'react';

const ErrorComponent = () => {
  return (
    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded relative">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">The Coin Geko Free API only allows 3 calls per minute, please try after some time to get the data</span>
    </div>
  );
};

export default ErrorComponent;
