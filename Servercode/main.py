from fastapi import FastAPI, Depends, HTTPException, status, Request, File, UploadFile, Form, Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import databases
import sqlalchemy 
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import yfinance as yf
import io
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

# # Set up logging
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)

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
#     logger.info(f"Received request: {request.method} {request.url}")
#     logger.info(f"Headers: {request.headers}")
#     response = await call_next(request)
#     logger.info(f"Response status: {response.status_code}")
#     return response

# Authentication endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # logger.info(f"Login attempt for user: {form_data.username}")
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
    #logger.info(f"Registration attempt for user: {user.username}")
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
        #logger.error(f"Error during registration: {str(e)}")
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

# # Data Science Query execution
# def execute_query(query: str, datasets: List[str]):
#     dfs = [pd.read_csv(io.StringIO(base64.b64decode(dataset).decode())) for dataset in datasets]
    
#     if "describe" in query.lower():
#         results = [df.describe().to_html() for df in dfs]
#         return {"type": "text", "data": results}
    
#     elif "histogram" in query.lower():
#         plt.figure(figsize=(10, 5))
#         for i, df in enumerate(dfs):
#             plt.hist(df.select_dtypes(include=[np.number]).values.flatten(), bins=30, alpha=0.5, label=f'Dataset {i+1}')

#         plt.legend()
#         plt.title("Histogram of Numerical Values")
#         buf = io.BytesIO()
#         plt.savefig(buf, format='png')
#         buf.seek(0)
#         return {"type": "image", "data": base64.b64encode(buf.getvalue()).decode()}
    
#     elif "regression" in query.lower():
#         if len(dfs) < 1:
#             return {"type": "text", "data": ["Not enough datasets for regression"]}
#         df = dfs[0]
#         X = df.select_dtypes(include=[np.number]).iloc[:, :-1]
#         y = df.select_dtypes(include=[np.number]).iloc[:, -1]
#         X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
#         model = LinearRegression()
#         model.fit(X_train, y_train)
#         y_pred = model.predict(X_test)
#         mse = mean_squared_error(y_test, y_pred)
#         r2 = r2_score(y_test, y_pred)
#         return {"type": "text", "data": [f"MSE: {mse}", f"R2 Score: {r2}"]}
    
#     else:
#         return {"type": "text", "data": ["Query not recognized"]}

# class Token(BaseModel):
#     access_token: str
#     token_type: str

# class User(BaseModel):
#     username: str

# class UserInDB(User):
#     hashed_password: str

# class UserCreate(BaseModel):
#     username: str
#     password: str

# class Query(BaseModel):
#     query: str

# class DataScienceQuestion(BaseModel):
#     question: str

# class CodeExecution(BaseModel):
#     code: str


# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def get_password_hash(password):
#     return pwd_context.hash(password)

# async def get_user(username: str):
#     query = users.select().where(users.c.username == username)
#     return await database.fetch_one(query)

# async def authenticate_user(username: str, password: str):
#     user = await get_user(username)
#     if not user:
#         return False
#     if not verify_password(password, user["hashed_password"]):
#         return False
#     return user

# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#     except JWTError:
#         raise credentials_exception
#     user = await get_user(username)
#     if user is None:
#         raise credentials_exception
#     return user

# @app.on_event("startup")
# async def startup():
#     await database.connect()

# @app.on_event("shutdown")
# async def shutdown():
#     await database.disconnect()

#     # Middleware for logging
# @app.middleware("http")
# async def log_requests(request: Request, call_next):
#     logger.info(f"Received request: {request.method} {request.url}")
#     logger.info(f"Headers: {request.headers}")
#     response = await call_next(request)
#     logger.info(f"Response status: {response.status_code}")
#     return response

# @app.post("/token", response_model=Token)
# async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
#     #print("Login")
#     logger.info(f"Login attempt for user: {form_data.username}")
#     user = await authenticate_user(form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         data={"sub": user["username"]}, expires_delta=access_token_expires
#     )
#     # print( {"access_token": access_token, "token_type": "bearer"})
#     return {"access_token": access_token, "token_type": "bearer"}

# class UserCreate(BaseModel):
#     username: str
#     password: str

# @app.post("/register")
# async def register(user: UserCreate):
#     print(f"Received registration request for username: {user.username}")
#     logger.info(f"Registration attempt for user: {user.username}")
#     # Check if username already exists
#     query = users.select().where(users.c.username == user.username)
#     existing_user = await database.fetch_one(query)
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Username already registered")
    
#     hashed_password = get_password_hash(user.password)
#     query = users.insert().values(username=user.username, hashed_password=hashed_password)
#     try:
#         await database.execute(query)
#         return {"message": "User created successfully"}
#     except Exception as e:
#         print(f"Error during registration: {str(e)}")  # Log the error
#         raise HTTPException(status_code=500, detail="An error occurred while registering the user")


# @app.get("/users/me", response_model=User)
# async def read_users_me(current_user: User = Depends(get_current_user)):
#     return current_user

# @app.post("/watchlist/add")
# async def add_to_watchlist(symbol: str, current_user: User = Depends(get_current_user)):
#     query = watchlists.insert().values(user_id=current_user["id"], symbol=symbol)
#     await database.execute(query)
#     return {"message": f"Added {symbol} to watchlist"}

# @app.get("/watchlist")
# async def get_watchlist(current_user: User = Depends(get_current_user)):
#     query = watchlists.select().where(watchlists.c.user_id == current_user["id"])
#     result = await database.fetch_all(query)
#     return [item["symbol"] for item in result]



# def calculate_sma(data, window):
#     return data['Close'].rolling(window=window).mean()

# def calculate_rsi(data, window):
#     delta = data['Close'].diff()
#     gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
#     loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
#     rs = gain / loss
#     return 100 - (100 / (1 + rs))

# def perform_sentiment_analysis(text):
#     blob = TextBlob(text)
#     return blob.sentiment.polarity

# def analyze_stock_data(data: pd.DataFrame, request: str) -> str:
#     # Calculate technical indicators
#     data['SMA_20'] = calculate_sma(data, 20)
#     data['SMA_50'] = calculate_sma(data, 50)
#     data['RSI'] = calculate_rsi(data, 14)

#     # Perform basic analysis
#     latest_close = data['Close'].iloc[-1]
#     sma_20 = data['SMA_20'].iloc[-1]
#     sma_50 = data['SMA_50'].iloc[-1]
#     rsi = data['RSI'].iloc[-1]

#     # Sentiment analysis on the request
#     sentiment = perform_sentiment_analysis(request)

#     analysis = f"Analysis of your request: '{request}'\n\n"
#     analysis += f"Latest closing price: ${latest_close:.2f}\n"
#     analysis += f"20-day SMA: ${sma_20:.2f}\n"
#     analysis += f"50-day SMA: ${sma_50:.2f}\n"
#     analysis += f"14-day RSI: {rsi:.2f}\n\n"

#     if sma_20 > sma_50:
#         analysis += "The 20-day SMA is above the 50-day SMA, indicating a potential upward trend.\n"
#     else:
#         analysis += "The 20-day SMA is below the 50-day SMA, indicating a potential downward trend.\n"

#     if rsi > 70:
#         analysis += "The RSI is above 70, suggesting the stock might be overbought.\n"
#     elif rsi < 30:
#         analysis += "The RSI is below 30, suggesting the stock might be oversold.\n"
#     else:
#         analysis += "The RSI is between 30 and 70, indicating neutral momentum.\n"

#     if sentiment > 0:
#         analysis += "The sentiment of your request is positive.\n"
#     elif sentiment < 0:
#         analysis += "The sentiment of your request is negative.\n"
#     else:
#         analysis += "The sentiment of your request is neutral.\n"

#     return analysis



# @app.get("/api/stock_data", response_model=List[StockData])
# async def get_stock_data(symbol: str = Query("AAPL"), range: str = Query("1M", regex="^(1W|1M|3M|1Y)$")):
#     end_date = datetime.now()
    
#     if range == "1W":
#         start_date = end_date - timedelta(days=7)
#     elif range == "1M":
#         start_date = end_date - timedelta(days=30)
#     elif range == "3M":
#         start_date = end_date - timedelta(days=90)
#     elif range == "1Y":
#         start_date = end_date - timedelta(days=365)
#     else:
#         raise HTTPException(status_code=400, detail="Invalid date range")
    
#     data = yf.download(symbol, start=start_date, end=end_date)
    
#     # Calculate SMAs
#     data['SMA_20'] = data['Close'].rolling(window=20).mean()
#     data['SMA_50'] = data['Close'].rolling(window=50).mean()
    
#     return [
#         StockData(
#             date=date.strftime("%Y-%m-%d"),
#             open=float(row['Open']),
#             high=float(row['High']),
#             low=float(row['Low']),
#             close=float(row['Close']),
#             sma_20=float(row['SMA_20']) if not pd.isna(row['SMA_20']) else None,
#             sma_50=float(row['SMA_50']) if not pd.isna(row['SMA_50']) else None
#         )
#         for date, row in data.iterrows()
#     ]


# @app.get("/api/stock_comparison")
# async def compare_stocks(symbols: str = Query(...), range: str = Query("1M", regex="^(1W|1M|3M|1Y)$")):
#     end_date = datetime.now()
    
#     if range == "1W":
#         start_date = end_date - timedelta(days=7)
#     elif range == "1M":
#         start_date = end_date - timedelta(days=30)
#     elif range == "3M":
#         start_date = end_date - timedelta(days=90)
#     elif range == "1Y":
#         start_date = end_date - timedelta(days=365)
#     else:
#         raise HTTPException(status_code=400, detail="Invalid date range")
    
#     symbol_list = symbols.split(',')
#     comparison_data = {}

#     for symbol in symbol_list:
#         data = yf.download(symbol, start=start_date, end=end_date)
#         if not data.empty:
#             start_price = data['Close'].iloc[0]
#             end_price = data['Close'].iloc[-1]
#             percent_change = ((end_price - start_price) / start_price) * 100
#             comparison_data[symbol] = {
#                 "start_price": start_price,
#                 "end_price": end_price,
#                 "percent_change": percent_change
#             }
#         else:
#             comparison_data[symbol] = {"error": "No data available"}

#     return comparison_data


# @app.post("/analyze")
# async def analyze(request: str = Form(...), file: Optional[UploadFile] = File(None)):
#     try:
#         if file:
#             contents = await file.read()
#             data = pd.read_csv(StringIO(contents.decode("utf-8")))
#         else:
#             # If no file is uploaded, use Tesla stock data for the last 30 days
#             end_date = datetime.now()
#             start_date = end_date - timedelta(days=30)
#             data = yf.download("TSLA", start=start_date, end=end_date)

#         analysis_result = analyze_stock_data(data, request)
#         return {"result": analysis_result}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
    

# class DataScienceQuery(BaseModel):
#     query: str
#     datasets: List[str]  # List of base64 encoded CSV data

# def execute_query(query: str, datasets: List[str]):
#     # This is a simplified example. In a real-world scenario, you'd want to use
#     # a more sophisticated method to interpret the query and generate code.
    
#     # Load datasets
#     dfs = [pd.read_csv(io.StringIO(base64.b64decode(dataset).decode())) for dataset in datasets]
    
#     # Simple query interpreter
#     if "describe" in query.lower():
#         results = [df.describe().to_html() for df in dfs]
#         return {"type": "text", "data": results}
    
#     elif "histogram" in query.lower():
#         plt.figure(figsize=(10, 5))
#         for i, df in enumerate(dfs):
#             plt.hist(df.select_dtypes(include=[np.number]).values.flatten(), bins=30, alpha=0.5, label=f'Dataset {i+1}')
#         plt.legend()
#         plt.title("Histogram of Numerical Values")
#         buf = io.BytesIO()
#         plt.savefig(buf, format='png')
#         buf.seek(0)
#         return {"type": "image", "data": base64.b64encode(buf.getvalue()).decode()}
    
#     elif "regression" in query.lower():
#         if len(dfs) < 1:
#             return {"type": "text", "data": ["Not enough datasets for regression"]}
#         df = dfs[0]
#         X = df.select_dtypes(include=[np.number]).iloc[:, :-1]
#         y = df.select_dtypes(include=[np.number]).iloc[:, -1]
#         X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
#         model = LinearRegression()
#         model.fit(X_train, y_train)
#         y_pred = model.predict(X_test)
#         mse = mean_squared_error(y_test, y_pred)
#         r2 = r2_score(y_test, y_pred)
#         return {"type": "text", "data": [f"MSE: {mse}", f"R2 Score: {r2}"]}
    
#     else:
#         return {"type": "text", "data": ["Query not recognized"]}

# @app.post("/execute_query")
# async def run_query(query: DataScienceQuery):
#     try:
#         result = execute_query(query.query, query.datasets)
#         return result
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
    

# @app.post("/api/process-query")
# async def process_query(query: Query):
#     prompt = f"""
#     Given the following user query about stock market analysis, formulate a specific data science question:
#     User Query: {query}
#     Data Science Question:
#     """

#     response = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "Given the following user query about stock market analysis, formulate a specific data science question:"},
#                 {"role": "user", "content": f"{prompt}"}
#             ]
#         )
#     return response.choices[0].message.content


# # # Example usage
# # user_query = "use statistics and all types of analysis to figure out best way to make profit"
# # data_science_question = process_query(user_query)
# # print(f"Data Science Question: {data_science_question}")

# @app.post("/api/generate-code")
# async def generate_code(question: DataScienceQuestion):
#     prompt = f"""
#     Generate Python code to answer the following data science question using all tools needed for the task:
#     Question: {question}
#     Python Code:
#     ```python
#     """
    
#     response = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "you are a datascience Expert in the world:"},
#                 {"role": "user", "content": f"{prompt}"}
#             ]
#         )
#     return response.choices[0].message.content

# # Example usage
# #data_science_question = "What are the key statistical indicators and patterns in the file that can be used to maximize profit?"
# generated_code = generate_code(data_science_question)
# print(f"Generated Code:\n{generated_code}")


# @app.post("/execute_query")
# async def run_query(query: DataScienceQuery):
#     try:
#         result = execute_query(query.query, query.datasets)
#         return result
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/process-query")
async def process_query(query: Query):
    prompt = f"""
    Given the following user query about stock market analysis, formulate a specific data science question:
    User Query: {query.query}
    Data Science Question:
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a data science expert specializing in stock market analysis."},
                {"role": "user", "content": prompt}
            ]
        )
        return {"question": response.choices[0].message['content'].strip()}
    except Exception as e:
        #logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the query")

@app.post("/api/generate-code")
async def generate_code(question: DataScienceQuestion):
    prompt = f"""
    Generate Python code to answer the following data science question about stock market analysis. Use pandas, numpy, matplotlib, and any other relevant libraries:
    Question: {question.question}
    Python Code:
    ```python
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a data science expert specializing in stock market analysis. Generate Python code to answer the given question."},
                {"role": "user", "content": prompt}
            ]
        )
        return {"code": response.choices[0].message['content'].strip()}
    except Exception as e:
        #logger.error(f"Error generating code: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the code")

@app.post("/api/execute-analysis")
async def execute_analysis(code_execution: CodeExecution):
    try:
        # Create a safe environment for code execution
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

        # Execute the code
        exec(code_execution.code, safe_globals, safe_locals)

        # Capture the output
        output = safe_locals.get('output', 'No output generated')

        # If there's a plot, save it as an image
        if 'plt' in safe_locals:
            buf = io.BytesIO()
            safe_locals['plt'].savefig(buf, format='png')
            buf.seek(0)
            plot_data = base64.b64encode(buf.getvalue()).decode()
            return {"result": output, "plot": plot_data}
        else:
            return {"result": output}
    except Exception as e:
        #logger.error(f"Error executing analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred while executing the analysis: {str(e)}")

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
        #logger.error(f"Error in stock chat: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the chat query")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)