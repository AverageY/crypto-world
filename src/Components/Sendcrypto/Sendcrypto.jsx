import React, { useState, useEffect } from 'react';
import { BrowserProvider, parseEther, formatUnits } from 'ethers';

const CryptoSender = () => {
  const [account, setAccount] = useState(null); // Store the user's wallet address
  const [balance, setBalance] = useState(''); // Store the user's ETH balance
  const [amount, setAmount] = useState(''); // Amount to send
  const [recipient, setRecipient] = useState(''); // Recipient address
  const [transactionHash, setTransactionHash] = useState(''); // Transaction Hash
  const [status, setStatus] = useState(''); // Transaction status

  // Connect MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum); // Use BrowserProvider
        await provider.send('eth_requestAccounts', []); // Request account access
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);
        setStatus('Wallet connected');

        // Fetch balance after connecting
        fetchBalance(userAddress, provider);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setStatus('Failed to connect wallet');
      }
    } else {
      setStatus('MetaMask is not installed. Please install MetaMask to use this feature.');
    }
  };

  // Fetch the ETH balance
  const fetchBalance = async (userAddress, provider) => {
    try {
      const balance = await provider.getBalance(userAddress);
      setBalance(formatUnits(balance, 18)); // Convert balance from Wei to ETH
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Send ETH
  const sendCrypto = async () => {
    if (!recipient || !amount || !account) {
      setStatus('Please fill in all fields.');
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum); // Use BrowserProvider
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: recipient, // Recipient's address
        value: parseEther(amount), // Amount to send in ETH
      });

      setTransactionHash(tx.hash);
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait(); // Wait for the transaction to be confirmed
      setStatus('Transaction confirmed!');

      // Update balance after sending
      fetchBalance(account, provider);
    } catch (error) {
      console.error('Transaction error:', error);
      setStatus('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Send Cryptocurrency</h1>

      {/* Wallet connection */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={connectWallet}
      >
        {account ? `Connected: ${account}` : 'Connect Wallet'}
      </button>

      {/* Show balance if wallet is connected */}
      {account && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Balance: {balance} ETH</h2>
        </div>
      )}

      {/* Form to send crypto */}
      {account && (
        <div>
          <div className="mb-4">
            <label className="block mb-2">Recipient Address:</label>
            <input
              type="text"
              className="border rounded w-full py-2 px-3"
              placeholder="Enter recipient address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Amount (ETH):</label>
            <input
              type="text"
              className="border rounded w-full py-2 px-3"
              placeholder="Enter amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={sendCrypto}
          >
            Send Crypto
          </button>

          {transactionHash && (
            <div className="mt-4">
              <p>
                Transaction Hash: <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">{transactionHash}</a>
              </p>
            </div>
          )}

          {status && (
            <div className="mt-4">
              <p>{status}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CryptoSender;
