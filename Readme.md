# Stock Market Analysis Assistant

## Overview

Stock Market Analysis Assistant is an AI-powered web application designed to help investors make informed decisions by providing advanced stock market analysis tools and insights. This platform combines real-time data visualization, AI-driven analytics, and an intuitive user interface to make complex financial analysis accessible to both novice and experienced investors.

## Features

- **Interactive Stock Charts**: Visualize stock data with customizable date ranges and technical indicators.
- **AI-Powered Data Science Queries**: Perform complex analyses using natural language queries.
- **Multi-Stock Comparison**: Compare performance metrics across multiple stocks.
- **Intelligent Chat Interface**: Engage in financial discussions with an AI assistant.
- **Personalized Watchlists**: Create and manage lists of stocks to monitor.
- **Secure User Authentication**: Protect your data with robust login functionality.
- **Comprehensive Analysis Reports**: Generate detailed reports with charts and AI-driven insights.

## Technologies Used

- Frontend: React.js, Material-UI
- Backend: FastAPI (Python)
- Database: SQLite
- AI/ML: OpenAI API, scikit-learn
- Data Visualization: Recharts, Matplotlib

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/stock-market-analysis-assistant.git
   cd stock-market-analysis-assistant
   ```

2. Set up the backend:
   ```
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   uvicorn main:app --reload
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Register for an account or log in if you already have one.
2. Use the stock chart to visualize stock performance.
3. Compare multiple stocks using the comparison tool.
4. Ask questions or perform analyses using the AI chat interface.
5. Create a watchlist to keep track of your favorite stocks.
6. Generate comprehensive reports for deeper insights.

## Contributing

We welcome contributions to the Stock Market Analysis Assistant! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [OpenAI](https://openai.com/) for providing the AI capabilities
- [Yahoo Finance](https://finance.yahoo.com/) for real-time stock data
- All open-source libraries and tools used in this project

## Disclaimer

This application is for informational purposes only. Always consult with a qualified financial advisor before making investment decisions.

## Contact

For any queries or support, please open an issue in the GitHub repository or contact us at support@stockmarketassistant.com.

---

Happy investing with Stock Market Analysis Assistant!