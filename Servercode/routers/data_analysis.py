# routers/data_analysis.py

from fastapi import APIRouter, Form, File, UploadFile, HTTPException
from datetime import datetime, timedelta
from io import StringIO
import pandas as pd
import yfinance as yf

from ..utils.analysis_utils import analyze_stock_data

router = APIRouter(prefix="/analysis", tags=["Data Analysis"])

# ... (Data analysis endpoints: analyze)
