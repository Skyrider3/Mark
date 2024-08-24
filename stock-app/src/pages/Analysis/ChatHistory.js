import React, { useEffect, useRef } from 'react';
import { Paper, Box, Typography, List, ListItem, ListItemText, Divider, Avatar } from '@mui/material';
import { useAppContext } from '../../context/AppContext';

const ChatHistory = () => {
  const { chatHistory } = useAppContext();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2, height: 400, overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>Chat History</Typography>
        <List>
          {chatHistory.map((chat, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>U</Avatar>
                <ListItemText
                  primary="You"
                  secondary={chat.user}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                  secondaryTypographyProps={{ style: { whiteSpace: 'pre-wrap' } }}
                />
              </ListItem>
              <ListItem alignItems="flex-start">
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>A</Avatar>
                <ListItemText
                  primary="Assistant"
                  secondary={chat.bot}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                  secondaryTypographyProps={{ style: { whiteSpace: 'pre-wrap' } }}
                />
              </ListItem>
              {index < chatHistory.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
          <div ref={chatEndRef} />
        </List>
      </Box>
    </Paper>
  );
};

export default ChatHistory;