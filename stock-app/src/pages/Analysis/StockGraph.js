import React, { useState, useEffect } from "react";
import NavBar from "../NavBar";
import { axiosGet } from "../Axios/axiosMethods";
import { API_URL } from "../appconfig";

const StockGraph = () => {
    const [htmlContent, setHtmlContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const getStockGraph = async () => {
        try {
          setLoading(true);
          const response = await axiosGet(
            `${API_URL}/map`
          );
          if (response.data) {
            setHtmlContent(response.data);
          }
        } catch (e) {
          console.error("Error fetching stock graph data", e);
          setError("Failed to load stock graph data");
        } finally {
          setLoading(false);
        }
      };
      getStockGraph();
    }, []);
    if (loading) return <div>Loading data...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <>
      <NavBar/>
      {htmlContent && (
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className="border p-4 rounded"
        />
      )}
      </>
    );
  }

  export default StockGraph;