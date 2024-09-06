# routers/ai_advisor.py

from fastapi import APIRouter, Form
import yfinance as yf
import requests

router = APIRouter(prefix="/ai_advisor", tags=["AI Advisor"])

# ... (AI advisor functions: get_financial_gurus, get_guru_prompt_template, llama3, parse_analysis_report)
