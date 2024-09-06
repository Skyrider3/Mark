# routers/stock_data.py

from fastapi import APIRouter, Query as FastAPIQuery, HTTPException
from datetime import datetime, timedelta
from typing import List
import pandas as pd
import yfinance as yf

from ..models import StockData

router = APIRouter(prefix="/stock_data", tags=["Stock Data"])

# ... (Stock data endpoints: get_stock_data, compare_stocks)
