import React, { useState, useEffect, useRef } from "react";
import NavBar from "../NavBar";
import { axiosGet } from "../Axios/axiosMethods";
import { API_URL } from "../appconfig";

const StockGraph = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  const loadStockGraph = async () => {
    try {
      setLoading(true);
      const response = await axiosGet(`${API_URL}/map`);
      if (response.data && iframeRef.current) {
        const iframe = iframeRef.current;
        iframe.srcdoc = response.data;
        iframe.onload = () => setLoading(false);
      }
    } catch (e) {
      console.error("Error fetching stock graph data", e);
      setError("Failed to load stock graph data");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStockGraph();
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <NavBar />
      <iframe
        ref={iframeRef}
        title="Stock Graph"
        className="w-full h-screen border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </>
  );
};

export default StockGraph;