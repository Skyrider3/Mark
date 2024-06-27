// // import React from 'react';
// // import { Paper, Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

// // const ChatHistory = () => {
// //   // We'll update this to use global state later
// //   const chatHistory = [];

// //   return (
// //     <Paper elevation={3}>
// //       <Box sx={{ p: 2 }}>
// //         <Typography variant="h6" gutterBottom>Chat History</Typography>
// //         <List sx={{ maxHeight: 300, overflow: 'auto' }}>
// //           {chatHistory.map((chat, index) => (
// //             <React.Fragment key={index}>
// //               <ListItem>
// //                 <ListItemText 
// //                   primary={<Typography variant="subtitle2">You</Typography>}
// //                   secondary={chat.user}
// //                 />
// //               </ListItem>
// //               <ListItem>
// //                 <ListItemText 
// //                   primary={<Typography variant="subtitle2">Assistant</Typography>}
// //                   secondary={chat.bot}
// //                 />
// //               </ListItem>
// //               {index < chatHistory.length - 1 && <Divider />}
// //             </React.Fragment>
// //           ))}
// //         </List>
// //       </Box>
// //     </Paper>
// //   );
// // };

// // export default ChatHistory;

// // src/components/ChatHistory.js
// import React, { useEffect, useRef } from 'react';
// import { Paper, Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
// import { useAppContext } from '../context/AppContext';

// const ChatHistory = () => {
//   const { chatHistory } = useAppContext();
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory]);

//   return (
//     <Paper elevation={3}>
//       <Box sx={{ p: 2, height: 300, overflowY: 'auto' }}>
//         <Typography variant="h6" gutterBottom>Chat History</Typography>
//         <List>
//           {chatHistory.map((chat, index) => (
//             <React.Fragment key={index}>
//               <ListItem alignItems="flex-start">
//                 <ListItemText
//                   primary="You"
//                   secondary={chat.user}
//                   primaryTypographyProps={{ fontWeight: 'bold' }}
//                 />
//               </ListItem>
//               <ListItem alignItems="flex-start">
//                 <ListItemText
//                   primary="Assistant"
//                   secondary={chat.bot}
//                   primaryTypographyProps={{ fontWeight: 'bold' }}
//                 />
//               </ListItem>
//               {index < chatHistory.length - 1 && <Divider variant="inset" component="li" />}
//             </React.Fragment>
//           ))}
//           <div ref={chatEndRef} />
//         </List>
//       </Box>
//     </Paper>
//   );
// };

// export default ChatHistory;
import React, { useEffect, useRef } from 'react';
import { Paper, Box, Typography, List, ListItem, ListItemText, Divider, Avatar } from '@mui/material';
import { useAppContext } from '../context/AppContext';

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