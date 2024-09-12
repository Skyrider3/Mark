import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import AnalysisHome from "./pages/Analysis/AnalysisHome";
import './index.css';
import LandingPage from "./pages/Landing/LandingPage";
import NewsPage from "./pages/News/NewsPage";
import DashboardPage from "./pages/DashBoard/DashBoardPage";
import FavoriteStocksPage from "./pages/Favourite Stocks/FavouriteStocksPage";
import StockDetailPage from "./pages/StockDetailPage/StockDetailPage";
import TradeJournal from "./pages/Journal/TradeJournal";
import OrderHistory from "./pages/Order History/OrderHistory";
import StockAlerts from "./pages/Manage Alerts/StockAlerts";
import StockNotes from "./pages/Notes/StockNotes";
import TradingReminders from "./pages/Reminders/TradingReminders";
import Login from "./pages/Authentication/Login";
import SavedPatterns from "./pages/Saved Patterns/SavedPatterns";
import SettingsPrivacy from "./pages/Account/SettingsPrivacy";
import GiveFeedback from "./pages/Account/GiveFeedback";
import HelpSupport from "./pages/Account/HelpSupport";
import NotificationsPage from "./pages/Account/Notifications";
import StockGraph from "./pages/Analysis/StockGraph";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/analysis" element={<AnalysisHome />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/dashBoard" element={<DashboardPage />} />
            <Route path="/favorite-stocks" element={<FavoriteStocksPage />} />
            <Route path="/stock/:symbol" element={<StockDetailPage />} />
            <Route path="/journal" element={<TradeJournal />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/manage-alerts" element={<StockAlerts />} />
            <Route path="/notes" element={<StockNotes />} />
            <Route path="/reminders" element={<TradingReminders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/saved-patterns" element={<SavedPatterns />} />  
            <Route path="/account-profile" element={<SettingsPrivacy />} />
            <Route path="/feedback" element={<GiveFeedback />} />
            <Route path="/help" element={<HelpSupport />} />    
            <Route path="/notifications" element={<NotificationsPage />} />  
            <Route path="/stockgraph" element={<StockGraph/>}/>  
          </Routes>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;