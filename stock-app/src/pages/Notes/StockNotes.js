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
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Collapse,
  Box,
} from "@mui/material";
import {
  Search,
  Delete,
  Edit,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Add,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../NavBar";

const AnimatedTableRow = motion(TableRow);

const StyledTableRow = styled(AnimatedTableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const initialNotes = [
  {
    id: 1,
    name: "AAPL Analysis",
    content:
      "Apple's recent product launch seems promising. The new iPhone series shows significant improvements in camera technology and processing power. This could potentially drive sales in the coming quarter. Keep an eye on supply chain news as it might affect production capabilities. The company's venture into AR/VR with the Vision Pro could open up new market opportunities. However, increasing competition in the wearables segment and potential regulatory scrutiny are factors to watch.",
    date: "2024-08-30",
  },
  {
    id: 2,
    name: "TSLA Swing Trading",
    content:
      "For a 1-month Tesla trading strategy, focus on these key points: 1) Monitor production and delivery numbers closely, as they often impact short-term price movements. 2) Keep an eye on Elon Musk's Twitter activity, as his statements can cause significant volatility. 3) Watch for any updates on Full Self-Driving (FSD) technology progress. 4) Be aware of broader EV market trends and competitor actions. 5) Consider the impact of macroeconomic factors like interest rates on high-growth stocks. Use a combination of technical analysis and these fundamental factors for entry and exit points.",
    date: "2024-08-25",
  },
  {
    id: 3,
    name: "Trendline Breakout Strategy Rules",
    content:
      "1) Identify a clear trend using higher time frames (daily or weekly charts). 2) Draw trendlines connecting at least two major highs or lows. 3) Wait for the price to approach the trendline. 4) Look for a candlestick pattern or price action indicating a potential breakout. 5) Enter the trade when the price closes beyond the trendline with increased volume. 6) Set a stop loss just below the breakout point for uptrends, or above for downtrends. 7) Target the next significant support/resistance level or use a risk-reward ratio of at least 1:2. 8) Trail your stop loss as the trade moves in your favor. 9) Be cautious of false breakouts, especially in ranging markets.",
    date: "2024-08-20",
  },
  {
    id: 4,
    name: "Trading Mistakes",
    content:
      "1) Overtrading: Don't feel compelled to be in the market constantly. Wait for high-probability setups. 2) Ignoring risk management: Always use stop losses and proper position sizing. 3) Emotional trading: Stick to your trading plan and avoid revenge trading after losses. 4) Lack of patience: Don't exit profitable trades too early out of fear. 5) Not adapting to market conditions: Be flexible and adjust your strategy as market dynamics change. 6) Neglecting to keep a trading journal: Track your trades to learn from mistakes and successes. 7) Over-leveraging: Using excessive leverage can lead to account-breaking losses. 8) Chasing news: Avoid making impulsive trades based on breaking news without proper analysis.",
    date: "2024-08-15",
  },
  {
    id: 5,
    name: "Psychology Rules",
    content:
      "1) Maintain emotional discipline: Don't let fear or greed drive your decisions. 2) Accept losses as part of trading: No strategy wins 100% of the time. 3) Stay confident but humble: Trust your analysis but be open to being wrong. 4) Avoid the gambler's fallacy: Each trade is independent; past results don't influence future outcomes. 5) Practice patience: Wait for your strategy to signal a trade; don't force entries. 6) Manage stress: Take breaks, exercise, and maintain a healthy work-life balance. 7) Cultivate a growth mindset: View losses as learning opportunities. 8) Avoid confirmation bias: Consider contradictory information to your trade thesis. 9) Control your risk: Never risk more than you're comfortable losing on a single trade.",
    date: "2024-08-10",
  },
];

const StockNotes = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNote(null);
    setEditMode(false);
  };

  const handleSaveNote = () => {
    if (editMode) {
      setNotes(
        notes.map((note) =>
          note.id === selectedNote.id
            ? { ...selectedNote, date: new Date().toISOString().split("T")[0] }
            : note
        )
      );
    } else {
      setNotes([
        ...notes,
        {
          ...selectedNote,
          id: notes.length + 1,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    handleCloseDialog();
  };

  const handleRowClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

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
          Stock Notes
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {
            setSelectedNote({ name: "", content: "" });
            setOpenDialog(true);
          }}
          sx={{ mb: 2 }}
        >
          Add New Note
        </Button>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="stock notes table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Note Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredNotes.map((note) => (
                  <React.Fragment key={note.id}>
                    <StyledTableRow
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleRowClick(note.id)}
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      <TableCell>
                        <IconButton size="small">
                          {expandedRow === note.id ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {note.name}
                      </TableCell>
                      <TableCell>{note.date}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(note);
                          }}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(note.id);
                          }}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={expandedRow === note.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Note Content
                            </Typography>
                            <Typography>{note.content}</Typography>
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

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{editMode ? "Edit Note" : "Add New Note"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {editMode
                ? "Modify the note details:"
                : "Enter the details for the new note:"}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Note Name"
              fullWidth
              variant="standard"
              value={selectedNote?.name || ""}
              onChange={(e) =>
                setSelectedNote({ ...selectedNote, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Note Content"
              fullWidth
              multiline
              rows={4}
              variant="standard"
              value={selectedNote?.content || ""}
              onChange={(e) =>
                setSelectedNote({ ...selectedNote, content: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveNote}>
              {editMode ? "Save Changes" : "Add Note"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default StockNotes;
