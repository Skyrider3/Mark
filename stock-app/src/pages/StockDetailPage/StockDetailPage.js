import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CustomCandlestickChart from "./CustomCandlestickChart";
import NavBar from "../NavBar";

const StockDetailPage = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1year");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "Zf9t1UFh13YSJYeNqENgWOqEnOAF0fZg"; // Replace with your actual API key

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stock data
        const stockResponse = await fetch(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`
        );
        const stockResult = await stockResponse.json();

        if (!stockResponse.ok) {
          throw new Error("Failed to fetch stock data");
        }

        if (stockResult.length === 0) {
          throw new Error("No data available for this stock");
        }

        setStockData(stockResult[0]);

        // Fetch chart data
        const chartResponse = await fetch(
          `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=${getTimeframeDays(
            selectedTimeframe
          )}&apikey=${API_KEY}`
        );
        const chartResult = await chartResponse.json();

        if (!chartResponse.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const formattedChartData = chartResult.historical
          .map((item) => ({
            date: new Date(item.date).getTime(),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          }))
          .reverse();

        setChartData(formattedChartData);

        const newsResponse = await fetch(`https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=5&apikey=${API_KEY}`);
        const newsResult = await newsResponse.json();

        if (!newsResponse.ok) {
          throw new Error('Failed to fetch news data');
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data");
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, selectedTimeframe, API_KEY]);

  const getTimeframeDays = (timeframe) => {
    switch (timeframe) {
      case "1month":
        return 30;
      case "3months":
        return 90;
      case "6months":
        return 180;
      case "1year":
        return 365;
      case "2years":
        return 730;
      default:
        return 365;
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!stockData || chartData.length === 0)
    return (
      <div className="text-center mt-8">No data available for this stock.</div>
    );

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          {stockData.companyName} ({stockData.symbol})
        </h1>

        <div className="mb-4">
          <label htmlFor="timeframe" className="mr-2">
            Select Timeframe:
          </label>
          <select
            id="timeframe"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border rounded p-2"
          >
            <option value="1month">1 Month</option>
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
            <option value="1year">1 Year</option>
            <option value="2years">2 Years</option>
          </select>
        </div>

        <div className="mb-8" style={{ width: "100%", height: "400px" }}>
          <CustomCandlestickChart data={chartData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Stock Information</h2>
            <p>
              <strong>Current Price:</strong> ${stockData.price.toFixed(2)}
            </p>
            <p>
              <strong>Volume:</strong> {stockData.volAvg.toLocaleString()}
            </p>
            <p>
              <strong>Market Cap:</strong> $
              {(stockData.mktCap / 1000000000).toFixed(2)} B
            </p>
            <p>
              <strong>52 Week High:</strong> $
              {stockData.range.split("-")[1].trim()}
            </p>
            <p>
              <strong>52 Week Low:</strong> $
              {stockData.range.split("-")[0].trim()}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Company Information</h2>
            <p>
              <strong>Industry:</strong> {stockData.industry || "N/A"}
            </p>
            <p>
              <strong>Sector:</strong> {stockData.sector || "N/A"}
            </p>
            <p>
              <strong>Country:</strong> {stockData.country || "N/A"}
            </p>
            <p>
              <strong>Full Time Employees:</strong>{" "}
              {stockData.fullTimeEmployees?.toLocaleString() || "N/A"}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={stockData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {stockData.website}
              </a>
            </p>
            <p>
              <strong>CEO:</strong> {stockData.ceo || "N/A"}
            </p>
          </div>
        </div>
        <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Latest News</h2>
        {newsData.length > 0 ? (
          <ul className="space-y-4">
            {newsData.map((news, index) => (
              <li key={index} className="border-b pb-4">
                <h3 className="text-lg font-semibold">{news.title}</h3>
                <p className="text-sm text-gray-600">{new Date(news.publishedDate).toLocaleString()}</p>
                <p className="mt-2">{news.text}</p>
                <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">Read more</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent news available for this stock.</p>
        )}
      </div>
      </div>
    </>
  );
};

export default StockDetailPage;
