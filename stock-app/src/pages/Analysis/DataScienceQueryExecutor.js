import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { API_URL } from "../appconfig";

const DataScienceQueryExecutor = ({selectedStock}) => {
  const [query, setQuery] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [processedQuestion, setProcessedQuestion] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [analysisResult, setAnalysisResult] = useState("null");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Process Query", "Generate Code", "Execute Analysis"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a query.");
      return;
    }
    setLoading(true);
    setError("");
    setProcessedQuestion("");
    setGeneratedCode("");
    setAnalysisResult(null);
    setActiveStep(0);

    try {
      const response = await axios.post(
        `${API_URL}/api/dataanalyzer`,
        { query, stock: selectedStock },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProcessedQuestion(response.data.processed_question);
      setActiveStep(1);

      setGeneratedCode(response.data.generated_code);
      setActiveStep(2);

      setAnalysisResult(response.data.analysis_result);
      setActiveStep(3);
    } catch (error) {
      console.error("Error in analysis pipeline:", error);
      setError("An error occurred during the analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCodeDisplay = () => {
    setShowCode(!showCode);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, flexGrow: 1, overflow: "auto" }}>
        <Card sx={{ flex: 1, overflow: "auto" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Interactive Pattern Analysis
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your query about stock market analysis here"
                margin="normal"
              />
              <p style={{ color: "grey" }}>
                Example: Give me which day in week was most traded?
              </p>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </form>
            {loading && <CircularProgress sx={{ mt: 2 }} />}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {processedQuestion && (
              <Box mt={2}>
                <Typography variant="h6">Processed Question:</Typography>
                <Typography variant="body1">{processedQuestion}</Typography>
              </Box>
            )}

            {generatedCode && (
              <Box mt={2}>
                <Button
                  variant="outlined"
                  onClick={toggleCodeDisplay}
                  sx={{ mb: 2 }}
                >
                  {showCode ? "Hide Code" : "Display Code"}
                </Button>
                {showCode && (
                  <Box>
                    <Typography variant="h6">Generated Code:</Typography>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        backgroundColor: "#f5f5f5",
                        padding: "10px",
                      }}
                    >
                      {generatedCode}
                    </pre>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {analysisResult && (
          <Card sx={{ flex: 1, overflow: "auto" }}>
            <CardContent>
              <Typography variant="h6">Analysis Result:</Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {analysisResult.result}
              </Typography>
              
              {analysisResult.plot && (
                <>
                  <p>Visual Plot:</p>
                  <img
                    src={`data:image/png;base64,${analysisResult.plot}`}
                    alt="Analysis plot"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginTop: "10px",
                    }}
                  />
                </>
              )}
              {analysisResult.result || analysisResult.plot && (<Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                Save Pattern
              </Button>)}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default DataScienceQueryExecutor;
