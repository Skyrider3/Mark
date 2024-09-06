import React, { useState } from 'react';
import AnalyticsDisplay from './AnalyticsDisplay';
import StockChatInterface from './StockChatInterface';
import { axiosPost } from "../Axios/axiosMethods";

const StockAnalysisApp = () => {
  const [query, setQuery] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [insights, setInsights] = useState([]);

  const handleQuerySubmit = async () => {
    try {
      // Step 1: Process the query
      const response1 = await axiosPost('/api/process-query', { query });
      const dataScienceQuestion = response1.data.question;

      // Step 2: Generate code
      const response2 = await axiosPost('/api/generate-code', { question: dataScienceQuestion });
      const generatedCode = response2.data.code;

      // Step 3: Execute code and get results
      const response3 = await axiosPost('/api/execute-analysis', { code: generatedCode });
      setAnalyticsData(response3.data.analyticsData);
      setInsights(response3.data.insights);
    } catch (error) {
      console.error('Error processing query:', error);
    }
  };

  return (
    <div className="stock-analysis-app">
      <h1>Stock Market Analysis Assistant</h1>
      <div className="query-section">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your analysis query..."
        />
        <button onClick={handleQuerySubmit}>Analyze</button>
      </div>
      {analyticsData && <AnalyticsDisplay data={analyticsData} insights={insights} />}
      <StockChatInterface />
    </div>
  );
};

export default StockAnalysisApp;