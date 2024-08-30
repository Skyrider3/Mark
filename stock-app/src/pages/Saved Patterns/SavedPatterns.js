import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Search,
  Edit,
  Delete,
  Code,
  Image as ImageIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../NavBar";

const AnimatedTableRow = motion(TableRow);

const StyledTableRow = styled(AnimatedTableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Extended sample data
const patternData = [
  {
    id: 1,
    name: "High Volume Tesla Day's",
    image: "/api/placeholder/100/100",
    code: "if (close > open && volume > avgVolume) {\n  // Bull Flag pattern detected\n  alert('Bull Flag pattern detected');\n}",
    notes: "Frequent high volume for Tesla stock",
    timeframe: "Daily",
    reliability: "High",
    lastModified: "2024-08-30 10:15:30",
  },
  {
    id: 2,
    name: "SNAP Reversal Pattern for Options",
    image: "/api/placeholder/100/100",
    code: "if (peak1 < peak2 && peak3 < peak2 && trough1 === trough2) {\n  // Head and Shoulders pattern detected\n  alert('Head and Shoulders pattern detected');\n}",
    notes: "Best time for snapchart options strangle pattern",
    timeframe: "Weekly",
    reliability: "Medium",
    lastModified: "2024-08-29 14:30:45",
  },
  {
    id: 3,
    name: "Recurrent pattern repeated in Snap",
    image: "/api/placeholder/100/100",
    code: "if (bottom1 === bottom2 && peak > bottom1) {\n  // Double Bottom pattern detected\n  alert('Double Bottom pattern detected');\n}",
    notes: "Huge sell repeated on 3rd week of every month",
    timeframe: "Daily",
    reliability: "High",
    lastModified: "2024-08-28 09:45:00",
  },
  {
    id: 4,
    name: "SNAP Earning day pattern",
    image: "/api/placeholder/100/100",
    code: "if (cupDepth < maxDepth && handleDepth < cupDepth / 2) {\n  // Cup and Handle pattern detected\n  alert('Cup and Handle pattern detected');\n}",
    notes: "Snap chart earnings are correlated with insider trades",
    timeframe: "Weekly",
    reliability: "Medium",
    lastModified: "2024-08-27 16:20:15",
  },
  {
    id: 5,
    name: "AAPL Event short sell pattern",
    image: "/api/placeholder/100/100",
    code: "if (lowerTrendline.isAscending() && upperTrendline.isHorizontal()) {\n  // Ascending Triangle pattern detected\n  alert('Ascending Triangle pattern detected');\n}",
    notes: "After Google/Samsung launch event there is a short sell repeating in appl",
    timeframe: "Daily",
    reliability: "High",
    lastModified: "2024-08-26 11:10:30",
  },
  {
    id: 6,
    name: "Recession Pattern",
    image: "/api/placeholder/100/100",
    code: "if (currentOpen > prevClose && currentClose < prevOpen) {\n  // Bearish Engulfing pattern detected\n  alert('Bearish Engulfing pattern detected');\n}",
    notes: "Big stocks recursion pattern",
    timeframe: "Daily",
    reliability: "Medium",
    lastModified: "2024-08-25 13:55:45",
  },
  {
    id: 7,
    name: "Trade Correction Pattern",
    image: "/api/placeholder/100/100",
    code: "if (Math.abs(open - close) <= (high - low) * 0.1) {\n  // Doji pattern detected\n  alert('Doji pattern detected');\n}",
    notes: "Tech Stocks trade correction pattern",
    timeframe: "Daily",
    reliability: "Low",
    lastModified: "2024-08-24 10:30:00",
  },
  {
    id: 8,
    name: "Dip Pattern",
    image: "/api/placeholder/100/100",
    code: "if (isHorizontalResistance() && isHorizontalSupport()) {\n  // Rectangle pattern detected\n  alert('Rectangle pattern detected');\n}",
    notes: "MSFT dip repeated at end of every quatar",
    timeframe: "Weekly",
    reliability: "Medium",
    lastModified: "2024-08-23 15:40:15",
  },
];

const SavedPatterns = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCode, setShowCode] = useState({});
  const [showImage, setShowImage] = useState({});

  const handleRowClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleCode = (id) => {
    setShowCode(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleImage = (id) => {
    setShowImage(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPatterns = patternData.filter(
    (pattern) =>
      pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pattern.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ mt: 4, mb: 4 }}
        >
          Saved Patterns
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search patterns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="saved patterns table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Pattern Name</TableCell>
                <TableCell>Pattern Image</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Timeframe</TableCell>
                <TableCell>Reliability</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredPatterns.map((row) => (
                  <React.Fragment key={row.id}>
                    <StyledTableRow
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleRowClick(row.id)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <TableCell>
                        <IconButton size="small">
                          {expandedRow === row.id ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>
                        <img src={row.image} alt={row.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                      </TableCell>
                      <TableCell>{row.notes}</TableCell>
                      <TableCell>{row.timeframe}</TableCell>
                      <TableCell>{row.reliability}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={expandedRow === row.id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Pattern Details
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Button
                                variant="outlined"
                                startIcon={<Code />}
                                onClick={() => toggleCode(row.id)}
                                sx={{ mr: 1 }}
                              >
                                {showCode[row.id] ? 'Hide Code' : 'Show Code'}
                              </Button>
                              <Button
                                variant="outlined"
                                startIcon={<ImageIcon />}
                                onClick={() => toggleImage(row.id)}
                              >
                                {showImage[row.id] ? 'Hide Image' : 'Show Image'}
                              </Button>
                            </Box>
                            {showCode[row.id] && (
                              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                  <code>{row.code}</code>
                                </pre>
                              </Paper>
                            )}
                            {showImage[row.id] && (
                              <Paper sx={{ p: 2, mb: 2 }}>
                                <img src={row.image} alt={row.name} style={{ maxWidth: '100%', height: 'auto' }} />
                              </Paper>
                            )}
                            <Typography variant="body2" gutterBottom>
                              Last Modified: {row.lastModified}
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default SavedPatterns;