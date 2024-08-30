import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CandlestickChart from './CandlestickChart';

const StockDetailPage = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1month');
  const [showVolume, setShowVolume] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = 'Zf9t1UFh13YSJYeNqENgWOqEnOAF0fZg'; // Replace with your Financial Modeling Prep API key

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stock data
        const stockResponse = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`);
        const stockResult = await stockResponse.json();
        
        if (!stockResponse.ok) {
          throw new Error('Failed to fetch stock data');
        }

        if (stockResult.length === 0) {
          throw new Error('No data available for this stock');
        }

        setStockData(stockResult[0]);

        // Fetch chart data
        const chartResponse = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=${getTimeframeDays(selectedTimeframe)}&apikey=${API_KEY}`);
        const chartResult = await chartResponse.json();

        if (!chartResponse.ok) {
          throw new Error('Failed to fetch chart data');
        }

        const formattedChartData = chartResult.historical.map(item => ({
          date: item.date,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume
        })).reverse();

        setChartData(formattedChartData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, selectedTimeframe]);

  const getTimeframeDays = (timeframe) => {
    switch(timeframe) {
      case '1month': return 30;
      case '3months': return 90;
      case '6months': return 180;
      case '1year': return 365;
      default: return 30;
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!stockData || chartData.length === 0) return <div className="text-center mt-8">No data available for this stock.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{stockData.companyName} ({stockData.symbol})</h1>
      
      <div className="mb-4 flex items-center">
        <label htmlFor="timeframe" className="mr-2">Select Timeframe:</label>
        <select 
          id="timeframe" 
          value={selectedTimeframe} 
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="border rounded p-2 mr-4"
        >
          <option value="1month">1 Month</option>
          <option value="3months">3 Months</option>
          <option value="6months">6 Months</option>
          <option value="1year">1 Year</option>
        </select>
        
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={showVolume}
            onChange={(e) => setShowVolume(e.target.checked)}
          />
          <span className="ml-2 text-gray-700">Show Volume</span>
        </label>
      </div>

      <div className="h-96 mb-8">
        <CandlestickChart data={chartData} showVolume={showVolume} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Stock Information</h2>
          <p><strong>Current Price:</strong> ${stockData.price.toFixed(2)}</p>
          <p><strong>Volume:</strong> {stockData.volAvg.toLocaleString()}</p>
          <p><strong>Market Cap:</strong> ${(stockData.mktCap / 1000000000).toFixed(2)} B</p>
          <p><strong>52 Week High:</strong> ${stockData.range.split('-')[1].trim()}</p>
          <p><strong>52 Week Low:</strong> ${stockData.range.split('-')[0].trim()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Company Information</h2>
          <p><strong>Industry:</strong> {stockData.industry || 'N/A'}</p>
          <p><strong>Sector:</strong> {stockData.sector || 'N/A'}</p>
          <p><strong>Country:</strong> {stockData.country || 'N/A'}</p>
          <p><strong>Full Time Employees:</strong> {stockData.fullTimeEmployees?.toLocaleString() || 'N/A'}</p>
          <p><strong>Website:</strong> <a href={stockData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{stockData.website}</a></p>
          <p><strong>CEO:</strong> {stockData.ceo || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default StockDetailPage;