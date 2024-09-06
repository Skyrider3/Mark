# routers/alerts.py

from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from typing import List
import aiohttp

from ..models import AlertBase, AlertCreate, Alert
from ..config import POLYGON_API_KEY

router = APIRouter(prefix="/alerts", tags=["Alerts"])

# ... (Alerts endpoints: fetch_stock_price, create_alert, read_alerts, update_alert, delete_alert, check_alerts, background_alert_checker)
