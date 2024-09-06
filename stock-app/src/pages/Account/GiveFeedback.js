import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Rating,
  Box,
  Snackbar,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import NavBar from "../NavBar";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const GiveFeedback = () => {
  const [formData, setFormData] = useState({
    rating: 0,
    newFeatures: "",
    bugFixes: "",
    enhanceFeatures: "",
    generalFeedback: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleRatingChange = useCallback((event, newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      rating: newValue,
    }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setSubmitting(true);
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Submitted feedback:", formData);
    setSubmitting(false);
    setSubmitted(true);
  }, [formData]);

  useEffect(() => {
    const currentForm = formRef.current;
    const resizeObserver = new ResizeObserver(() => {
      // This is intentionally left empty to avoid triggering unnecessary actions
    });

    if (currentForm) {
      resizeObserver.observe(currentForm);
    }

    return () => {
      if (currentForm) {
        resizeObserver.unobserve(currentForm);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <NavBar />
      <Container maxWidth="md">
        <Typography variant="h5" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
          User Feedback
        </Typography>

        <StyledPaper component="form" onSubmit={handleSubmit} ref={formRef}>
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              How would you rate our application?
            </Typography>
            <Rating
              name="rating"
              value={formData.rating}
              onChange={handleRatingChange}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            label="What new features would you like to see?"
            name="newFeatures"
            value={formData.newFeatures}
            onChange={handleChange}
            multiline
            rows={3}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Are there any bugs that need fixing?"
            name="bugFixes"
            value={formData.bugFixes}
            onChange={handleChange}
            multiline
            rows={3}
            margin="normal"
          />

          <TextField
            fullWidth
            label="How can we enhance existing features?"
            name="enhanceFeatures"
            value={formData.enhanceFeatures}
            onChange={handleChange}
            multiline
            rows={3}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Any other feedback?"
            name="generalFeedback"
            value={formData.generalFeedback}
            onChange={handleChange}
            multiline
            rows={4}
            margin="normal"
          />

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
            >
              Submit Feedback
            </Button>
          </Box>

          {submitting && (
            <Box mt={2}>
              <LinearProgress />
            </Box>
          )}
        </StyledPaper>

        <Snackbar
          open={submitted}
          autoHideDuration={6000}
          onClose={() => setSubmitted(false)}
          message="Thank you for your feedback!"
        />
      </Container>
    </>
  );
};

export default GiveFeedback;