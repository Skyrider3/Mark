from fastapi import FastAPI, Depends, HTTPException, status, Request, File, UploadFile, Form, Query, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import requests 
import aiohttp
import json
import yfinance as yf
import io
import re
import base64
import logging
import matplotlib.pyplot as plt
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import databases
import sqlalchemy 
import traceback
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import yfinance as yf
from io import StringIO
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
import numpy as np
from textblob import TextBlob
from openai import OpenAI
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from fastapi.params import Query as FastAPIQuery

import contextlib
from functools import partial
import asyncio
import matplotlib
matplotlib.use('Agg')



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up...")
    await database.connect()
    yield
    # Shutdown
    print("Shutting down...")
    await database.disconnect()

app = FastAPI(lifespan=lifespan)


client = OpenAI(api_key="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")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:8000","*"],  # Add your frontend URL here "http://localhost:3000","http://localhost:8000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StockData(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    sma_20: float
    sma_50: float

class AnalysisRequest(BaseModel):
    request: str


# Set up logging
logging.basicConfig(level=logging.DEBUG)
#logger = logging.get#logger(__name__)


# Database setup
DATABASE_URL = "sqlite:///./test.db"
database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()


users = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("username", sqlalchemy.String, unique=True, index=True),
    sqlalchemy.Column("hashed_password", sqlalchemy.String),
)

watchlists = sqlalchemy.Table(
    "watchlists",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("user_id", sqlalchemy.ForeignKey("users.id")),
    sqlalchemy.Column("symbol", sqlalchemy.String),
)

engine = sqlalchemy.create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
metadata.create_all(engine)

# Authentication
SECRET_KEY = "mahesh111111111212222222222222222333"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str

class UserInDB(User):
    hashed_password: str

class UserCreate(BaseModel):
    username: str
    password: str

class Query(BaseModel):
    query: str

class DataScienceQuestion(BaseModel):
    question: str

class CodeExecution(BaseModel):
    code: str

class StockData(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    sma_20: Optional[float]
    sma_50: Optional[float]

class AnalysisRequest(BaseModel):
    request: str

class DataScienceQuery(BaseModel):
    query: str
    datasets: List[str]  # List of base64 encoded CSV data

class AlertBase(BaseModel):
    symbol: str
    price: float
    condition: str

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# Authentication functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def get_user(username: str):
    query = users.select().where(users.c.username == username)
    return await database.fetch_one(query)


async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await get_user(username)
    if user is None:
        raise credentials_exception
    return user


# Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    #logger.info(f"Received request: {request.method} {request.url}")
    #logger.info(f"Headers: {request.headers}")
    response = await call_next(request)
    #logger.info(f"Response status: {response.status_code}")
    return response


# Authentication endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # #logger.info(f"Login attempt for user: {form_data.username}")
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/register")
async def register(user: UserCreate):
    ##logger.info(f"Registration attempt for user: {user.username}")
    query = users.select().where(users.c.username == user.username)
    existing_user = await database.fetch_one(query)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    query = users.insert().values(username=user.username, hashed_password=hashed_password)
    try:
        await database.execute(query)
        return {"message": "User created successfully"}
    except Exception as e:
        ##logger.error(f"Error during registration: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while registering the user")


@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


# Watchlist endpoints
@app.post("/watchlist/add")
async def add_to_watchlist(symbol: str, current_user: User = Depends(get_current_user)):
    query = watchlists.insert().values(user_id=current_user["id"], symbol=symbol)
    await database.execute(query)
    return {"message": f"Added {symbol} to watchlist"}


@app.get("/watchlist")
async def get_watchlist(current_user: User = Depends(get_current_user)):
    query = watchlists.select().where(watchlists.c.user_id == current_user["id"])
    result = await database.fetch_all(query)
    return [item["symbol"] for item in result]


# Stock data and analysis functions
def calculate_sma(data, window):
    return data['Close'].rolling(window=window).mean()


def calculate_rsi(data, window):
    delta = data['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))


def perform_sentiment_analysis(text):
    blob = TextBlob(text)
    return blob.sentiment.polarity



def analyze_stock_data(data: pd.DataFrame, request: str) -> str:
    data['SMA_20'] = calculate_sma(data, 20)
    data['SMA_50'] = calculate_sma(data, 50)
    data['RSI'] = calculate_rsi(data, 14)

    latest_close = data['Close'].iloc[-1]
    sma_20 = data['SMA_20'].iloc[-1]
    sma_50 = data['SMA_50'].iloc[-1]
    rsi = data['RSI'].iloc[-1]

    sentiment = perform_sentiment_analysis(request)

    analysis = f"Analysis of your request: '{request}'\n\n"
    analysis += f"Latest closing price: ${latest_close:.2f}\n"
    analysis += f"20-day SMA: ${sma_20:.2f}\n"
    analysis += f"50-day SMA: ${sma_50:.2f}\n"
    analysis += f"14-day RSI: {rsi:.2f}\n\n"

    if sma_20 > sma_50:
        analysis += "The 20-day SMA is above the 50-day SMA, indicating a potential upward trend.\n"
    else:
        analysis += "The 20-day SMA is below the 50-day SMA, indicating a potential downward trend.\n"

    if rsi > 70:
        analysis += "The RSI is above 70, suggesting the stock might be overbought.\n"
    elif rsi < 30:
        analysis += "The RSI is below 30, suggesting the stock might be oversold.\n"
    else:
        analysis += "The RSI is between 30 and 70, indicating neutral momentum.\n"

    if sentiment > 0:
        analysis += "The sentiment of your request is positive.\n"
    elif sentiment < 0:
        analysis += "The sentiment of your request is negative.\n"
    else:
        analysis += "The sentiment of your request is neutral.\n"

    return analysis



# Stock data endpoints
@app.get("/api/stock_data", response_model=List[StockData])
async def get_stock_data(
    symbol: str = FastAPIQuery("AAPL", description="Stock symbol"),
    range: str = FastAPIQuery("1M", regex="^(1W|1M|3M|1Y)$", description="Date range")
):
    end_date = datetime.now()
    
    if range == "1W":
        start_date = end_date - timedelta(days=7)
    elif range == "1M":
        start_date = end_date - timedelta(days=30)
    elif range == "3M":
        start_date = end_date - timedelta(days=90)
    elif range == "1Y":
        start_date = end_date - timedelta(days=365)
    else:
        raise HTTPException(status_code=400, detail="Invalid date range")
    
    data = yf.download(symbol, start=start_date, end=end_date)
    
    data['SMA_20'] = data['Close'].rolling(window=20).mean()
    data['SMA_50'] = data['Close'].rolling(window=50).mean()
    
    return [
        StockData(
            date=date.strftime("%Y-%m-%d"),
            open=float(row['Open']),
            high=float(row['High']),
            low=float(row['Low']),
            close=float(row['Close']),
            sma_20=float(row['SMA_20']) if not pd.isna(row['SMA_20']) else None,
            sma_50=float(row['SMA_50']) if not pd.isna(row['SMA_50']) else None
        )
        for date, row in data.iterrows()
    ]




@app.get("/api/stock_comparison")
async def compare_stocks(
    symbols: str = FastAPIQuery(..., description="Comma-separated stock symbols"),
    range: str = FastAPIQuery("1M", regex="^(1W|1M|3M|1Y)$", description="Date range")
):
    end_date = datetime.now()
    
    if range == "1W":
        start_date = end_date - timedelta(days=7)
    elif range == "1M":
        start_date = end_date - timedelta(days=30)
    elif range == "3M":
        start_date = end_date - timedelta(days=90)
    elif range == "1Y":
        start_date = end_date - timedelta(days=365)
    else:
        raise HTTPException(status_code=400, detail="Invalid date range")
    
    symbol_list = symbols.split(',')
    comparison_data = {}

    for symbol in symbol_list:
        data = yf.download(symbol, start=start_date, end=end_date)
        if not data.empty:
            start_price = data['Close'].iloc[0]
            end_price = data['Close'].iloc[-1]
            percent_change = ((end_price - start_price) / start_price) * 100
            comparison_data[symbol] = {
                "start_price": start_price,
                "end_price": end_price,
                "percent_change": percent_change
            }
        else:
            comparison_data[symbol] = {"error": "No data available"}

    return comparison_data




@app.post("/api/analyze")
async def analyze(request: str = Form(...), file: Optional[UploadFile] = File(None)):
    try:
        if file:
            contents = await file.read()
            data = pd.read_csv(StringIO(contents.decode("utf-8")))
        else:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=30)
            data = yf.download("TSLA", start=start_date, end=end_date)

        analysis_result = analyze_stock_data(data, request)
        return {"result": analysis_result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))




@app.post("/api/dataanalyzer")
async def analyzer(query: Query):
    try:
        # Step 1: Process Query
        #logger.debug(f"Processing query: {query.query}")
        processed_question = await process_query(query.query)
        
        # Step 2: Generate Code
        #logger.debug(f"Generating code for question: {processed_question}")
        generated_code = await generate_code(processed_question)
        
        # Step 3: Execute Analysis
        #logger.debug("Executing analysis")
        analysis_result = await execute_analysis(generated_code)
        
        return {
            "processed_question": processed_question,
            "generated_code": generated_code,
            "analysis_result": analysis_result
        }
    except Exception as e:
        #logger.error(f"Error in analysis pipeline: {str(e)}")
        #logger.error(traceback.format_exc())
        return {
            "error": str(e),
            "processed_question": processed_question if 'processed_question' in locals() else None,
            "generated_code": generated_code if 'generated_code' in locals() else None,
            "analysis_result": None
        }




async def process_query(query: str):
    prompt = f"""
    Given the following user query about stock market analysis, formulate a specific data science question:
    User Query: {query}
    Data Science Question:
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": "You are a data science expert specializing in stock market analysis."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        #logger.error(f"Error in process_query: {str(e)}")
        raise Exception(f"Error processing query: {str(e)}")




async def generate_code(question: str):
    prompt = f"""
    Generate Python code to answer the following data science question about stock market analysis. Use yfinance to fetch real-time stock data, and pandas, numpy, matplotlib for analysis and visualization. Do not use any local CSV files. Always fetch data using yfinance.
    Question: {question}
    Python Code:
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": "You are a data science expert specializing in stock market analysis. Generate Python code to answer the given question using yfinance for data retrieval. give me only the code "},
                {"role": "user", "content": prompt}
            ]
        )
        generated_code = response.choices[0].message.content.strip()
        # Remove markdown code block delimiters if present
        generated_code = re.sub(r'^```python\n|```\n?$', '', generated_code, flags=re.MULTILINE)
        return generated_code
    except Exception as e:
        #logger.error(f"Error in generate_code: {str(e)}")
        raise Exception(f"Error generating code: {str(e)}")



    
async def execute_analysis(code: str):
    try:
        safe_globals = {
            "pd": pd,
            "np": np,
            "plt": plt,
            "yf": yf,
            "LinearRegression": LinearRegression,
            "train_test_split": train_test_split,
            "mean_squared_error": mean_squared_error,
            "r2_score": r2_score
        }
        safe_locals = {}
        
        # Capture stdout and custom print output
        output = io.StringIO()
        def custom_print(*args, **kwargs):
            print(*args, file=output, **kwargs)
        safe_globals['print'] = custom_print
        
        # Execute the code asynchronously
        with contextlib.redirect_stdout(output):
            await asyncio.to_thread(partial(exec, code, safe_globals, safe_locals))
        
        # Get captured output
        text_output = output.getvalue()
        
        # Check if a plot was created
        if plt.get_fignums():
            print("Plot detected. Encoding...")
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=300, bbox_inches='tight')
            buf.seek(0)
            # plot_data = f"data:image/png;base64,{base64.b64encode(buf.getvalue()).decode()}"
            plot_data = base64.b64encode(buf.getvalue()).decode()
            plt.close('all')  # Close all plots to free memory
            # print(f"Plot encoded. Length: {len(plot_data)}")
            return {"result": text_output, "plot": plot_data}
        else:
            print("No plot detected.")
            return {"result": text_output}
    except Exception as e:
        error_msg = f"Error executing analysis: {str(e)}"
        print(error_msg)
        return {"result": error_msg, "error": True}



@app.post("/api/stock-chat")
async def stock_chat(query: Query):
    prompt = f"""
    You are an AI assistant specializing in stock market analysis. Answer the following question about stocks:
    User Query: {query.query}
    Response:
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI assistant specializing in stock market analysis."},
                {"role": "user", "content": prompt}
            ]
        )
        return {"reply": response.choices[0].message['content'].strip()}
    except Exception as e:
        ##logger.error(f"Error in stock chat: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the chat query")




## functionality for AI Assistant 
@app.get("/api/financialgurus")
async def get_financial_gurus():
    """
    Returns a list of financial gurus.
    """

    gurus = [
        {"name": "Warren Buffett", "expertise": "Value Investing"},
        {"name": "Charlie Munger", "expertise": "Value Investing, Psychology"},
        {"name": "Benjamin Graham", "expertise": "Value Investing, Security Analysis"},
        {"name": "Peter Lynch", "expertise": "Growth Investing"},
        {"name": "Ray Dalio", "expertise": "Macroeconomic Investing"},

    ]

    return {"gurus": gurus}




def get_guru_prompt_template(guru_name: str, stockname: str, stock_data: str) -> str:
    if guru_name == "Warren Buffett":
        return f"""
        Here is the historical stock data for {stockname}: {stock_data}
        
        **Warren Buffett's Value Investing Analysis**

        **Industry Overview:**
        Please provide an overview of the {stockname} industry, focusing on long-term trends and economic moats.

        **Intrinsic Value Estimation:**
        Calculate the intrinsic value of {stockname} based on discounted cash flow analysis and compare it to the current market price.

        **Management Evaluation:**
        Analyze the quality and integrity of {stockname}'s management team, focusing on their track record and alignment with shareholders.

        **Risk and Margin of Safety:**
        Identify potential risks and assess the margin of safety in the current stock price.
        """

    elif guru_name == "Charlie Munger":
        return f"""
        Here is the historical stock data for {stockname}: {stock_data}
        
        **Charlie Munger's Multi-Disciplinary Approach**

        **Industry and Competitive Analysis:**
        Analyze the {stockname} industry using mental models, focusing on competitive dynamics and behavioral factors.

        **Management and Corporate Culture:**
        Evaluate {stockname}'s management team and corporate culture, considering psychological biases and incentives.

        **Investment Risks:**
        Discuss potential risks, including behavioral and psychological factors that might affect the stock's performance.
        """

    elif guru_name == "Benjamin Graham":
        return f"""
        Here is the historical stock data for {stockname}: {stock_data}
        
        **Benjamin Graham's Security Analysis**

        **Financial Stability and Ratios:**
        Assess the financial stability of {stockname} using key ratios like current ratio, debt-to-equity, and earnings stability.

        **Valuation and Margin of Safety:**
        Evaluate the stock's valuation based on earnings, book value, and provide a margin of safety analysis.

        **Investment Criteria:**
        Determine whether {stockname} meets Graham's criteria for a defensive or enterprising investment.
        """

    elif guru_name == "Peter Lynch":
        return f"""
        Here is the historical stock data for {stockname}: {stock_data}
        
        **Peter Lynch's Growth Investing Analysis**

        **Growth Potential:**
        Analyze {stockname}'s growth potential, focusing on earnings growth, product pipeline, and market expansion opportunities.

        **Company Fundamentals:**
        Evaluate the fundamentals of {stockname}, including P/E ratio, PEG ratio, and revenue growth.

        **Risk Factors:**
        Identify key risk factors that could impact the company's growth trajectory.
        """

    elif guru_name == "Ray Dalio":
        return f"""
        Here is the historical stock data for {stockname}: {stock_data}
        
        **Ray Dalio's Macroeconomic Analysis**

        **Economic Indicators:**
        Analyze {stockname} in the context of macroeconomic trends, including interest rates, inflation, and GDP growth.

        **Global Risks:**
        Identify global risks and geopolitical factors that could affect {stockname}.

        **Diversification and Hedging:**
        Discuss how {stockname} fits into a diversified portfolio and potential hedging strategies.
        """

    else:
        return f"Sorry, no analysis template available for {guru_name}."
    

@app.post("/api/AIAdvisor")
async def llama3(stock: str = Form(...), type: str = Form(...), request: str = Form(...)):
    url = "http://localhost:11434/api/chat"
    
    stockname = stock
    Advisorname = type
    
    # Fetch historical data (e.g., 5 years)
    stock_data = yf.download(stockname, period="5y").to_string()

    # Get the appropriate prompt template based on the guru
    prompt = get_guru_prompt_template(Advisorname, stockname, stock_data)

    data = {
        "model": "llama3",
        "messages": [
            {
                "role": "user",
                "content": f"Perform an analysis based on {Advisorname}'s investing style: {prompt}"
            }
        ],
        "stream": False
    }
    
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, json=data)
    
    # Parse the AI-generated report (optional, depending on your needs)
    report_text = response.json()['message']['content']

    # You can return the report directly or further process it
    return {"result": report_text}





@app.post("/api/AIAnalysis")
def parse_analysis_report(stock : str = Form(...)):
    url = "http://localhost:11434/api/chat"
    # Fetch historical data (e.g., 5 years)
    stock_data = yf.download(stock, period="5y")

    prompt = f"""
        Here is the historical stock data for stock ticker {stock}: {stock_data.to_string()}
        **Fundamental Analysis Report**

        **Industry Overview:**
        Please provide a brief overview of the [industry/sector] industry, including its current trends, challenges, and outlook.

        **Market Position:**
        What is the company's current market position within the [industry/sector], and how does it compare to its competitors?

        **Competitive Advantages:**
        What are the company's unique competitive advantages, and how do they differentiate themselves from their competitors?

        **Economic Moat Analysis:**
        What are the company's sustainable competitive advantages that protect its market share and profitability?

        **Company Financials:**
        Please provide a detailed analysis of the company's financial performance, including:

        * Revenue and profit trends: What are the company's revenue and profit growth rates over the past 5 years, and what are the main drivers of this growth? **Also, calculate the average revenue growth rate over this period.** 
        * Balance sheet health: What is the company's current financial health, including its debt-to-equity ratio, cash reserves, and other key metrics?
        * Cash flow analysis: How does the company generate cash, and what are its cash flow trends over the past 5 years?
        * Key financial ratios: What are the company's key financial ratios, such as P/E, P/B, and Debt-to-Equity, and how do they compare to industry averages?

        **Company Analysis:**
        Please provide an analysis of the company's management quality and track record, corporate governance, business model sustainability, and product/service pipeline.

        **Risk Analysis:**
        What are the company's main risks, including market risks, operational risks, financial risks, and regulatory risks?
        **Additionally, analyze the historical xvolatility of the company's stock price to assess its risk profile.**

        **Future Growth Analysis:**
        What are the company's opportunities for future growth, including market expansion opportunities, potential for innovation, strategic partnerships or acquisitions, and long-term industry trends?

        **Quarterly/Seasonal Monitoring Checklist:**
        Please provide a quarterly/seasonal monitoring checklist that includes key metrics to track, such as:

        * Revenue growth rate
        * Profit margins
        * Customer acquisition costs
        * Inventory turnover
        * Debt levels
        * Cash reserves
        * R&D spending
        * Market share changes

        """
    # print ("for this {company} do the {agentName} analysis and give me a report in this format" + prompt)
    data = {
        "model": "llama3",
        "messages": [
            {
                "role": "user",
                "content": f"for this {stock} do the analysis and give me a report in this format" + prompt
            }
        ],
        "stream": False
    }
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.post(url, headers=headers, json=data)

    report_text = response.json() ['message'] ['content']

    analysis_result = {}
    sections = re.split(r'\*\*(.+?)\*\*\n', report_text)  # Split by double asterisks (**)

    # The first element will be empty or contain the historical data, so we skip it
    for i in range(1, len(sections), 2):
        heading = sections[i].strip()
        heading = heading.replace("*", "")
        content = sections[i + 1].strip()
        analysis_result[heading] = content

    return analysis_result





POLYGON_API_KEY = "nDUQqv3zEBdeZwmJUyHxiKg2lXpx_g0E"

# for dashboard watch list
@app.get("/api/watchlist_data")
async def get_watchlist_data(symbols: str): # = Query(..., description="Comma-separated stock symbols")):
    symbols_list = symbols.split(',')
    watchlist_data = {}

    async with aiohttp.ClientSession() as session:
        for symbol in symbols_list:
            url = f"https://api.polygon.io/v2/last/nbbo/{symbol}?apiKey={POLYGON_API_KEY}"
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    if data['status'] == 'success':
                        last_quote = data['results']
                        watchlist_data[symbol] = {
                            'price': last_quote['P'],
                            'change_percent': ((last_quote['P'] - last_quote['p']) / last_quote['p']) * 100
                        }
                else:
                    watchlist_data[symbol] = {'error': 'Failed to fetch data'}

    return watchlist_data


# for high volume stocks
@app.get("/api/high_volume_stocks")
async def get_high_volume_stocks():
    url = f"https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey={POLYGON_API_KEY}"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                if data['status'] == 'OK':
                    # Sort tickers by volume and get top 5
                    sorted_tickers = sorted(data['tickers'], key=lambda x: x['day']['v'], reverse=True)[:5]
                    
                    high_volume_stocks = []
                    for ticker in sorted_tickers:
                        stock_data = {
                            'symbol': ticker['ticker'],
                            'ask': ticker['lastQuote']['P'],
                            'bid': ticker['lastQuote']['p'],
                            'volume': ticker['day']['v']
                        }
                        high_volume_stocks.append(stock_data)
                    
                    return high_volume_stocks
            
            raise HTTPException(status_code=400, detail="Failed to fetch high volume stocks data")




async def fetch_stock_data(symbols: List[str]):
    url = f"https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers={','.join(symbols)}&apiKey={POLYGON_API_KEY}"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                if data['status'] == 'OK':
                    return {ticker['ticker']: {
                        'price': ticker['lastTrade']['p'],
                        'change_percent': ticker['todaysChangePerc'],
                        'volume': ticker['day']['v']
                    } for ticker in data['tickers']}
    return {}



# for top tech stocks
@app.get("/api/top_tech_stocks")
async def get_top_tech_stocks():
    tech_symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB', 'TSLA', 'NVDA', 'ADBE', 'INTC', 'CSCO']
    return await fetch_stock_data(tech_symbols)



# for top trending stocks
@app.get("/api/top_trending_stocks")
async def get_top_trending_stocks():
    url = f"https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey={POLYGON_API_KEY}"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                if data['status'] == 'OK':
                    # Sort by percent change and get top 10
                    sorted_tickers = sorted(data['tickers'], key=lambda x: abs(x['todaysChangePerc']), reverse=True)[:10]
                    return {ticker['ticker']: {
                        'price': ticker['lastTrade']['p'],
                        'change_percent': ticker['todaysChangePerc'],
                        'volume': ticker['day']['v']
                    } for ticker in sorted_tickers}
    return {}



# for best buy stocks
@app.get("/api/best_buy_stocks")
async def get_best_buy_stocks():
    url = f"https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey={POLYGON_API_KEY}"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                if data['status'] == 'OK':
                    # Filter for stocks with positive change and sort by volume
                    positive_change_tickers = [t for t in data['tickers'] if t['todaysChangePerc'] > 0]
                    sorted_tickers = sorted(positive_change_tickers, key=lambda x: x['day']['v'], reverse=True)[:10]
                    return {ticker['ticker']: {
                        'price': ticker['lastTrade']['p'],
                        'change_percent': ticker['todaysChangePerc'],
                        'volume': ticker['day']['v']
                    } for ticker in sorted_tickers}
    return {}



alerts = []
alert_id_counter = 1

async def fetch_stock_price(symbol: str):
    url = f"https://api.polygon.io/v2/last/trade/{symbol}?apiKey={POLYGON_API_KEY}"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return data['results']['p']
    return None

@app.post("/api/alerts", response_model=Alert)
async def create_alert(alert: AlertCreate):
    global alert_id_counter
    new_alert = Alert(
        id=alert_id_counter,
        **alert.dict(),
        created_at=datetime.now()
    )
    alerts.append(new_alert)
    alert_id_counter += 1
    return new_alert

@app.get("/api/alerts", response_model=List[Alert])
async def read_alerts():
    return alerts

@app.put("/api/alerts/{alert_id}", response_model=Alert)
async def update_alert(alert_id: int, alert: AlertCreate):
    for existing_alert in alerts:
        if existing_alert.id == alert_id:
            existing_alert.symbol = alert.symbol
            existing_alert.price = alert.price
            existing_alert.condition = alert.condition
            return existing_alert
    raise HTTPException(status_code=404, detail="Alert not found")

@app.delete("/api/alerts/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_alert(alert_id: int):
    global alerts
    alerts = [alert for alert in alerts if alert.id != alert_id]
    return None

@app.get("/api/check_alerts")
async def check_alerts():
    triggered_alerts = []
    for alert in alerts:
        current_price = await fetch_stock_price(alert.symbol)
        if current_price is not None:
            if (alert.condition == 'above' and current_price > alert.price) or \
               (alert.condition == 'below' and current_price < alert.price):
                triggered_alerts.append({
                    'alert': alert,
                    'current_price': current_price
                })
    return triggered_alerts

# Background task to periodically check alerts
async def background_alert_checker():
    while True:
        await check_alerts()
        await asyncio.sleep(60)  # Check every minute

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(background_alert_checker())




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)