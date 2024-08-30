import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';

const FavoriteStocksPage = () => {
    const navigate = useNavigate();
  // Static data for favorite stocks
  const stocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      currentPrice: 150.25,
      volume: 82345670,
      priceChange: 1.25
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      currentPrice: 2750.80,
      volume: 1234567,
      priceChange: -0.5
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      currentPrice: 305.15,
      volume: 23456789,
      priceChange: 0.75
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      currentPrice: 3380.50,
      volume: 3456789,
      priceChange: -1.2
    },
    {
      symbol: 'FB',
      name: 'Meta Platforms Inc.',
      currentPrice: 330.75,
      volume: 15678901,
      priceChange: 2.1
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      currentPrice: 750.40,
      volume: 28901234,
      priceChange: 3.5
    }
  ];

  const handleStockClick = (symbol) => {
    navigate(`/stock/${symbol}`);
  };

  return (
    <>
    <NavBar/>
    <div className="container mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">Favorite Stocks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((stock) => (
          <div 
            key={stock.symbol}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => handleStockClick(stock.symbol)}
          >
            <h2 className="text-xl font-semibold">{stock.name} ({stock.symbol})</h2>
            <p className="text-gray-600">Current Price: ${stock.currentPrice.toFixed(2)}</p>
            <p className="text-gray-600">Volume: {stock.volume.toLocaleString()}</p>
            <p className={`text-${stock.priceChange >= 0 ? 'green' : 'red'}-600`}>
              Change: {stock.priceChange >= 0 ? '+' : ''}{stock.priceChange.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default FavoriteStocksPage;