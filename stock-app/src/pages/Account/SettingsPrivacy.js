import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Avatar,
  Box,
} from "@mui/material";
import {
  Edit,
  Save,
  CloudDownload,
} from "@mui/icons-material";
import ptlogo from "../../image/ptlogo.png";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import NavBar from "../NavBar";

const AnimatedPaper = motion(Paper);

const StyledPaper = styled(AnimatedPaper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const SettingsPrivacy = () => {
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "iaditya91",
    age: 29,
    country: "United States",
    mobile: "+1 (555) 123-4567",
    allowDataUsage: true,
  });

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    setEditMode(false);
    // Here you would typically send the updated info to a backend
    console.log("Saved user info:", userInfo);
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: name === "allowDataUsage" ? checked : value,
    }));
  };

  const Section = ({ title, children }) => (
    <StyledPaper
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box mt={2}>{children}</Box>
    </StyledPaper>
  );

  return (
    <>
      <NavBar />
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
          Settings & Privacy
        </Typography>

        <Section title="User Profile">
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                alt="Profile Picture"
                src={ptlogo}
                sx={{ width: 100, height: 100 }}
              />
            </Grid>
            <Grid item xs>
              <Button variant="contained" component="label">
                Upload New Picture
                <input type="file" hidden />
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={userInfo.username}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={userInfo.age}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country of Residence"
                name="country"
                value={userInfo.country}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                value={userInfo.mobile}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Grid>
          </Grid>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              startIcon={editMode ? <Save /> : <Edit />}
              variant="contained"
              color={editMode ? "primary" : "secondary"}
              onClick={editMode ? handleSave : handleEdit}
            >
              {editMode ? "Save" : "Edit"}
            </Button>
          </Box>
        </Section>

        <Section title="Privacy Settings">
          <FormControlLabel
            control={
              <Switch
                checked={userInfo.allowDataUsage}
                onChange={handleChange}
                name="allowDataUsage"
                color="primary"
              />
            }
            label="Allow user data for training AI"
          />
          <Typography variant="body2" color="textSecondary" mt={1}>
            By enabling this, you agree to let us use your trading data to improve our AI algorithms.
          </Typography>
        </Section>

        <Section title="Tax Documents">
          <Typography variant="body1" gutterBottom>
            Download your tax documents for the trading activities performed through this app.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CloudDownload />}
            onClick={() => console.log("Downloading tax document...")}
          >
            Download 2024 Tax Document
          </Button>
        </Section>
      </Container>
    </>
  );
};

export default SettingsPrivacy;