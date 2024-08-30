import React, { useState } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search,
  Delete,
  Edit,
  Add,
  Alarm,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../NavBar';

const AnimatedTableRow = motion(TableRow);

const StyledTableRow = styled(AnimatedTableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const initialReminders = [
  { id: 1, name: 'NY Open', description: 'New York market opening', time: '9:30 AM', pattern: 'Daily' },
  { id: 2, name: 'London Open', description: 'London market opening', time: '3:00 AM', pattern: 'Daily' },
  { id: 3, name: '10 PM Trend Reversal', description: 'Check for potential trend reversals', time: '10:00 PM', pattern: 'Daily' },
  { id: 4, name: 'ICT Silver Bullet', description: 'Look for ICT silver bullet setup', time: '10:30 AM', pattern: 'Daily' },
  { id: 5, name: 'FOMC Meeting', description: 'Federal Open Market Committee meeting', time: '2:00 PM', pattern: 'Custom' },
];

const TradingReminders = () => {
  const [reminders, setReminders] = useState(initialReminders);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredReminders = reminders.filter((reminder) =>
    reminder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reminder.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  const handleEdit = (reminder) => {
    setSelectedReminder(reminder);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReminder(null);
    setEditMode(false);
  };

  const handleSaveReminder = () => {
    if (editMode) {
      setReminders(reminders.map((reminder) => 
        reminder.id === selectedReminder.id ? selectedReminder : reminder
      ));
    } else {
      setReminders([...reminders, { ...selectedReminder, id: reminders.length + 1 }]);
    }
    handleCloseDialog();
  };

  return (
    <>
    <NavBar />
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Trading Reminders
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search reminders..."
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
          setSelectedReminder({ name: '', description: '', time: '', pattern: 'Daily' });
          setOpenDialog(true);
        }}
        sx={{ mb: 2 }}
      >
        Add New Reminder
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="trading reminders table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Pattern</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {filteredReminders.map((reminder) => (
                <StyledTableRow
                  key={reminder.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell component="th" scope="row">
                    {reminder.name}
                  </TableCell>
                  <TableCell>{reminder.description}</TableCell>
                  <TableCell>{reminder.time}</TableCell>
                  <TableCell>{reminder.pattern}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(reminder)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(reminder.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Edit Reminder' : 'Add New Reminder'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editMode ? 'Modify the reminder details:' : 'Enter the details for the new reminder:'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reminder Name"
            fullWidth
            variant="standard"
            value={selectedReminder?.name || ''}
            onChange={(e) => setSelectedReminder({ ...selectedReminder, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="standard"
            value={selectedReminder?.description || ''}
            onChange={(e) => setSelectedReminder({ ...selectedReminder, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            variant="standard"
            value={selectedReminder?.time || ''}
            onChange={(e) => setSelectedReminder({ ...selectedReminder, time: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
          <FormControl fullWidth margin="dense" variant="standard">
            <InputLabel id="reminder-pattern-label">Pattern</InputLabel>
            <Select
              labelId="reminder-pattern-label"
              value={selectedReminder?.pattern || 'Daily'}
              onChange={(e) => setSelectedReminder({ ...selectedReminder, pattern: e.target.value })}
            >
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveReminder} startIcon={<Alarm />}>
            {editMode ? 'Update Reminder' : 'Set Reminder'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </>
  );
};

export default TradingReminders;