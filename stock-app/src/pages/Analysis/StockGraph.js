import React, { useState, useEffect } from "react";
import { axiosGet } from "../Axios/axiosMethods";
import { API_URL } from "../appconfig";
import NavBar from "../NavBar";
import { Button } from "@mui/material";

const StockGraph = () => {
  const [iframeKey, setIframeKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStockGraph = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosGet(`${API_URL}/map`);
      if (response.data) {
        // Force iframe refresh by updating its key
        setIframeKey(prevKey => prevKey + 1);
      }
    } catch (e) {
      console.error("Error fetching stock graph data", e);
      setError("Failed to load stock graph data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStockGraph();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex-grow p-4">
        <Button 
          onClick={loadStockGraph} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
        
        {error && <div className="text-red-500 mb-4">Error: {error}</div>}
        
        <iframe
          key={iframeKey}
          src={`${API_URL}/map`}
          className="w-full h-full border-0"
          title="Stock Graph"
        />
      </div>
    </div>
  );
};

export default StockGraph;