import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CandlestickChart from './CandlestickChart';

const StockDetailPage = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1month');
  const [showVolume, setShowVolume] = useState(true);

  const API_KEY = 'L3A8WESORA0JPFCL'; // Replace with your actual API key

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();
        setStockData(data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();
        const timeSeriesData = data['Time Series (Daily)'];
        const formattedData = Object.entries(timeSeriesData).map(([date, values]) => ({
          date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume'])
        })).reverse();
        setChartData(formattedData.slice(0, getTimeframeDays(selectedTimeframe)));
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    const fetchNewsData = async () => {
      try {
        const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();
        setNewsData(data.feed.slice(0, 5)); // Get the latest 5 news items
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    };

    fetchStockData();
    fetchChartData();
    fetchNewsData();
  }, [symbol, selectedTimeframe]);

  const getTimeframeDays = (timeframe) => {
    switch(timeframe) {
      case '1week': return 5;
      case '1month': return 22;
      case '3months': return 66;
      case '1year': return 252;
      default: return 22;
    }
  };

  if (!stockData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{stockData.Name} ({stockData.Symbol})</h1>
      
      <div className="mb-4 flex items-center">
        <label htmlFor="timeframe" className="mr-2">Select Timeframe:</label>
        <select 
          id="timeframe" 
          value={selectedTimeframe} 
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="border rounded p-2 mr-4"
        >
          <option value="1week">1 Week</option>
          <option value="1month">1 Month</option>
          <option value="3months">3 Months</option>
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

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Stock Information</h2>
          <p><strong>Current Price:</strong> ${parseFloat(stockData.Price).toFixed(2)}</p>
          <p><strong>Volume:</strong> {parseInt(stockData.Volume).toLocaleString()}</p>
          <p><strong>Market Cap:</strong> ${parseFloat(stockData.MarketCapitalization).toLocaleString()}</p>
          <p><strong>52 Week High:</strong> ${stockData['52WeekHigh']}</p>
          <p><strong>52 Week Low:</strong> ${stockData['52WeekLow']}</p>
          <p><strong>P/E Ratio:</strong> {stockData.PERatio}</p>
          <p><strong>Dividend Yield:</strong> {stockData.DividendYield}%</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Company Information</h2>
          <p><strong>Industry:</strong> {stockData.Industry}</p>
          <p><strong>Sector:</strong> {stockData.Sector}</p>
          <p><strong>Country:</strong> {stockData.Country}</p>
          <p><strong>Employees:</strong> {parseInt(stockData.FullTimeEmployees).toLocaleString()}</p>
          <p><strong>CEO:</strong> {stockData.CEO}</p>
          <p><strong>Website:</strong> <a href={stockData.Website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{stockData.Website}</a></p>
          <p><strong>Description:</strong> {stockData.Description.slice(0, 200)}...</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Latest News</h2>
        {newsData.map((news, index) => (
          <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
            <h3 className="font-semibold">{news.title}</h3>
            <p className="text-sm text-gray-600">{new Date(news.time_published).toLocaleString()}</p>
            <p>{news.summary.slice(0, 150)}...</p>
            <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockDetailPage;