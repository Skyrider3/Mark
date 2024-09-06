import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Box,
  Fab,
  Drawer,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExpandMore as ExpandMoreIcon,
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import NavBar from "../NavBar";

const AnimatedPaper = motion(Paper);

const StyledPaper = styled(AnimatedPaper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: theme.shape.borderRadius,
}));

const AnimatedAccordion = motion(Accordion);

const StyledAccordion = styled(AnimatedAccordion)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
  },
}));

const FloatingChatButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: 300,
  backgroundColor: theme.palette.background.default,
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1, 2),
  borderRadius: 20,
  marginBottom: theme.spacing(1),
  backgroundColor: isUser ? alpha(theme.palette.primary.main, 0.8) : alpha(theme.palette.secondary.main, 0.2),
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isUser ? 'flex-end' : 'flex-start',
}));

const ChatInput = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const faqData = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details and follow the prompts to complete the registration process."
    },
    {
      question: "What trading options are available?",
      answer: "Profitable Trader offers various trading options including stocks, ETFs, options, and cryptocurrencies. Each type of trade has its own set of rules and risk factors."
    },
    {
      question: "How do I deposit funds into my account?",
      answer: "You can deposit funds by going to the 'Account' section and selecting 'Deposit'. We accept various payment methods including bank transfers, credit/debit cards, and some e-wallets."
    },
    {
      question: "What are the fees for trading?",
      answer: "Our fee structure varies depending on the type of trade and the volume. Please refer to our 'Fees & Charges' page for detailed information."
    },
    {
      question: "How can I withdraw my funds?",
      answer: "To withdraw funds, go to the 'Account' section and select 'Withdraw'. Follow the prompts to complete the withdrawal process. Please note that there may be processing times depending on your chosen withdrawal method."
    }
  ];

const HelpSupport = () => {
  const theme = useTheme();
  const [chatOpen, setChatOpen] = useState(false);
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSupportFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setSupportForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSupportFormSubmit = useCallback((event) => {
    event.preventDefault();
    console.log("Support form submitted:", supportForm);
    setSupportForm({ name: "", email: "", message: "" });
  }, [supportForm]);

  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim() !== "") {
      setMessages(prev => [...prev, { text: inputMessage, isUser: true }]);
      setInputMessage("");
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Thank you for your message. Our team will get back to you soon.", 
          isUser: false 
        }]);
      }, 1000);
    }
  }, [inputMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <NavBar />
      <Container maxWidth="md">
        <Typography variant="h5" component="h1" gutterBottom sx={{ mt: 4, mb: 4, color: theme.palette.primary.main }}>
          Help & Support
        </Typography>

        <StyledPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" gutterBottom>
            Frequently Asked Questions
          </Typography>
          {faqData.map((faq, index) => (
            <StyledAccordion
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">{faq.answer}</Typography>
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </StyledPaper>

        <StyledPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Typography variant="body1">
            Email: support@profitabletrader.com
          </Typography>
          <Typography variant="body1">
            Customer Service: +1 (800) 123-4567
          </Typography>
        </StyledPaper>

        <StyledPaper
          component="form"
          onSubmit={handleSupportFormSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Typography variant="h6" gutterBottom>
            Submit a Support Request
          </Typography>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={supportForm.name}
            onChange={handleSupportFormChange}
            margin="normal"
            required
            sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.8) }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={supportForm.email}
            onChange={handleSupportFormChange}
            margin="normal"
            required
            sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.8) }}
          />
          <TextField
            fullWidth
            label="Message"
            name="message"
            value={supportForm.message}
            onChange={handleSupportFormChange}
            margin="normal"
            multiline
            rows={4}
            required
            sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.8) }}
          />
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              startIcon={<SendIcon />}
            >
              Submit Request
            </Button>
          </Box>
        </StyledPaper>
      </Container>

      <FloatingChatButton
        onClick={() => setChatOpen(true)}
        component={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChatIcon />
      </FloatingChatButton>

      <Drawer
        anchor="right"
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      >
        <ChatContainer>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
            <Typography variant="h6">
              Live Chat with AI Agent
              <IconButton 
                onClick={() => setChatOpen(false)}
                sx={{ float: 'right', color: theme.palette.primary.contrastText }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Typography>
          </Box>
          <ChatMessages>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', justifyContent: message.isUser ? 'flex-end' : 'flex-start' }}
                >
                  <MessageBubble isUser={message.isUser}>
                    <Typography variant="body2">{message.text}</Typography>
                  </MessageBubble>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </ChatMessages>
          <ChatInput>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSendMessage} edge="end">
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ChatInput>
        </ChatContainer>
      </Drawer>
    </>
  );
};

export default React.memo(HelpSupport);