from fastapi import FastAPI, Depends, HTTPException, status, Request, File, UploadFile, Form, Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
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
import io
import re
from io import StringIO
import json
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
import numpy as np
from textblob import TextBlob
import logging
from openai import OpenAI
import base64
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from fastapi.params import Query as FastAPIQuery


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
    allow_origins=["http://localhost:3000","http://localhost:8000"],  # Add your frontend URL here
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
#logging.basicConfig(level=logging.DEBUG)
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


# # Middleware
# @app.middleware("http")
# async def log_requests(request: Request, call_next):
#     #logger.info(f"Received request: {request.method} {request.url}")
#     #logger.info(f"Headers: {request.headers}")
#     response = await call_next(request)
#     #logger.info(f"Response status: {response.status_code}")
#     return response

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


@app.post("/analyze")
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



# @app.post("/api/analyze")
# async def analyze(query: Query):
#     try:
#         # Step 1: Process Query
#         #logger.debug(f"Processing query: {query.query}")
#         processed_question = await process_query(query.query)
        
#         # Step 2: Generate Code
#         #logger.debug(f"Generating code for question: {processed_question}")
#         generated_code = await generate_code(processed_question)
        
#         # Step 3: Execute Analysis
#         #logger.debug("Executing analysis")
#         analysis_result = await execute_analysis(generated_code)
        
#         return {
#             "processed_question": processed_question,
#             "generated_code": generated_code,
#             "analysis_result": analysis_result
#         }
#     except Exception as e:
#         #logger.error(f"Error in analysis pipeline: {str(e)}")
#         #logger.error(traceback.format_exc())
#         return {
#             "error": str(e),
#             "processed_question": processed_question if 'processed_question' in locals() else None,
#             "generated_code": generated_code if 'generated_code' in locals() else None,
#             "analysis_result": None
#         }


@app.post("/api/analyze")
async def analyze(query: Query):
    try:
        decision_ = await query_decision(query.query)
        print(f" inside the function")
        decision = str("1") # for testing purpose
        print(f" the decision is {decision}" )
        if decision == "1":
            # Data science query
            print("inside the query")
            return await process_data_science_query(query)
        elif decision == "2":
            # Financial document retrieval
            return await process_financial_document_query(query)
        elif decision == "3":
            # Web information retrieval
            return await process_web_information_query(query)
        else:
            raise ValueError(f"Invalid decision: {decision}")
    
    except Exception as e:
        #logger.error(f"Error in analysis pipeline: {str(e)}")
        #logger.error(traceback.format_exc())
        return {
            "error": str(e),
            "processed_question": None,
            "generated_code": None,
            "analysis_result": None
        }

async def query_decision(query: str):
    prompt = f"""
        Given the following user query about stock market, Determine to which below category the input query belongs to
        1) If the query is a data science question then return  1 
        2) if the query is related to information that can be retrieved from financial documents then return 2
        3) if the query requires information from web to get the relevant information  then return 3
        User Query: {query}
        Return only the number corresponding to the correct category (1, 2, or 3).
        """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": "You are a query evaluator, with expert world knowledge and stock market expertise."},
                {"role": "user", "content": prompt}
            ]
        )
        #return response.choices[0].message.content.strip()
        query_decision_response = response.choices[0].message.content.strip()
        match = re.search(r"category (\d+)",query_decision_response)
        if match:
            decision = match.group(1)
            print(f"Extracted digit: {decision}")
        else:
            print("Digit not found in the string.")
        return decision
    except Exception as e:
        raise Exception(f"Error processing query: {str(e)}")

async def process_data_science_query(query: Query):
    # This is your existing data science query processing
    processed_question = await process_query(query.query)
    generated_code = await generate_code(processed_question)
    analysis_result = await execute_analysis(generated_code)
    print("******* processed_question is ********** \n\n")
    print(processed_question)
    print("******* generated_code is **********\n\n")
    print(generated_code)
    print("******* analysis_result is **********\n\n")
    print(analysis_result)
    return {
        "processed_question": processed_question,
        "generated_code": generated_code,
        "analysis_result": analysis_result
    }

async def process_financial_document_query(query: Query):
    # TODO: Implement financial document retrieval logic
    # This is where you'll implement the RAG (Retrieval-Augmented Generation) system
    return {"result": "Financial document retrieval not implemented yet"}

async def process_web_information_query(query: Query):
    # TODO: Implement web information retrieval logic
    return {"result": "Web information retrieval not implemented yet"}



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
                {"role": "system", "content": "You are a data science expert specializing in stock market analysis. Generate Python code to answer the given question using yfinance for data retrieval."},
                {"role": "user", "content": prompt}
            ]
        )
        generated_code = response.choices[0].message.content.strip()
        # Remove markdown code block delimiters if present
        generated_code = re.sub(r'^```python\n|```\n?$', '', generated_code, flags=re.MULTILINE)
        # print(generated_code )
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

        # Add a custom print function to capture output
        output = []
        def custom_print(*args, **kwargs):
            output.append(' '.join(map(str, args)))
        safe_globals['print'] = custom_print

        # Execute the code
        exec(code, safe_globals, safe_locals)

        # Join captured output
        text_output = '\n'.join(output)

        # Check if a plot was created
        if plt.get_fignums():
            buf = io.BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            plot_data = base64.b64encode(buf.getvalue()).decode()
            plt.close('all')  # Close all plots to free memory
            return {"result": text_output, "plot": plot_data}
        else:
            return {"result": text_output}
    except Exception as e:
        #logger.error(f"Error in execute_analysis: {str(e)}")
        #logger.error(f"Problematic code:\n{code}")
        raise Exception(f"Error executing analysis: {str(e)}")
    

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
        return {"reply": response.choices[0].message.content.strip()}
    except Exception as e:
        ##logger.error(f"Error in stock chat: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the chat query")


@app.post("/api/analyze")
def query_desicion(query: Query):
    prompt = f"""
        Given the following user query about stock market, Determine to which below category the input query belongs to
        1) If the query is a data science question then return 1 
        2) if the query is related to information that can be retrieved from financial documents then return 2
        3) if the query requires information from web to get the relevant information  then return 3
        User Query: {query}
        """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": "You are a query evaluator, with expert world knowledge and stock market expertise."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        #logger.error(f"Error in process_query: {str(e)}")
        raise Exception(f"Error processing query: {str(e)}")



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)