# # # main.py
# # from fastapi import FastAPI, HTTPException
# # from fastapi.middleware.cors import CORSMiddleware
# # from pydantic import BaseModel
# # from typing import List
# # import pandas as pd
# # import sqlite3

# # app = FastAPI()

# # # Enable CORS
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["http://localhost:3000"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # Load data and create database
# # df = pd.read_csv("tsla_2014_2023.csv")
# # conn = sqlite3.connect("tesla_stock.db")
# # df.to_sql("stock_data", conn, if_exists="replace", index=False)
# # conn.close()

# # class StockData(BaseModel):
# #     date: str
# #     open: float
# #     high: float
# #     low: float
# #     close: float
# #     volume: int

# # @app.get("/api/stock_data", response_model=List[StockData])
# # async def get_stock_data():
# #     conn = sqlite3.connect("tesla_stock.db")
# #     df = pd.read_sql("SELECT * FROM stock_data", conn)
# #     conn.close()
# #     return df.to_dict(orient="records")

# # @app.get("/api/chat")
# # async def chat(message: str):
# #     conn = sqlite3.connect("tesla_stock.db")
# #     df = pd.read_sql("SELECT * FROM stock_data", conn)
# #     conn.close()

# #     if "highest price" in message.lower():
# #         max_price = df["high"].max()
# #         max_date = df.loc[df["high"].idxmax(), "date"]
# #         return f"The highest price was ${max_price:.2f} on {max_date}."
# #     elif "lowest price" in message.lower():
# #         min_price = df["low"].min()
# #         min_date = df.loc[df["low"].idxmin(), "date"]
# #         return f"The lowest price was ${min_price:.2f} on {min_date}."
# #     else:
# #         return "I'm sorry, I don't understand that question. You can ask about the highest or lowest price."

# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run(app, host="0.0.0.0", port=8000)


# import os
# import sqlite3
# import pandas as pd
# import numpy as np
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import anthropic
# from typing import List, Dict, Any
# import ast

# app = FastAPI()

# ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
# if not ANTHROPIC_API_KEY:
#     raise ValueError("ANTHROPIC_API_KEY environment variable is not set")

# client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# class ChatRequest(BaseModel):
#     message: str

# def get_stock_data():
#     conn = sqlite3.connect("tesla_stock.db")
#     df = pd.read_sql("SELECT * FROM stock_data", conn)
#     conn.close()
#     return df

# # Existing functions
# def get_highest_price(df: pd.DataFrame) -> Dict[str, Any]:
#     max_price = df["high"].max()
#     max_date = df.loc[df["high"].idxmax(), "date"]
#     return {"price": float(max_price), "date": str(max_date)}

# def get_lowest_price(df: pd.DataFrame) -> Dict[str, Any]:
#     min_price = df["low"].min()
#     min_date = df.loc[df["low"].idxmin(), "date"]
#     return {"price": float(min_price), "date": str(min_date)}

# def get_average_price(df: pd.DataFrame) -> float:
#     return float(df["close"].mean())

# def get_price_range(df: pd.DataFrame) -> Dict[str, float]:
#     return {"min": float(df["low"].min()), "max": float(df["high"].max())}

# def get_volume_info(df: pd.DataFrame) -> Dict[str, Any]:
#     max_volume = df["volume"].max()
#     max_volume_date = df.loc[df["volume"].idxmax(), "date"]
#     return {"max_volume": int(max_volume), "date": str(max_volume_date)}

# def get_descriptive_stats(df: pd.DataFrame) -> Dict[str, Any]:
#     return {
#         "open": {
#             "mean": float(df["open"].mean()),
#             "median": float(df["open"].median()),
#             "std": float(df["open"].std()),
#             "min": float(df["open"].min()),
#             "max": float(df["open"].max()),
#         },
#         "close": {
#             "mean": float(df["close"].mean()),
#             "median": float(df["close"].median()),
#             "std": float(df["close"].std()),
#             "min": float(df["close"].min()),
#             "max": float(df["close"].max()),
#         },
#         "volume": {
#             "mean": float(df["volume"].mean()),
#             "median": float(df["volume"].median()),
#             "std": float(df["volume"].std()),
#             "min": float(df["volume"].min()),
#             "max": float(df["volume"].max()),
#         },
#         "date_range": {
#             "start": str(df["date"].min()),
#             "end": str(df["date"].max()),
#         },
#         "total_trading_days": len(df),
#     }

# # Define available functions
# available_functions = {
#     "get_highest_price": get_highest_price,
#     "get_lowest_price": get_lowest_price,
#     "get_average_price": get_average_price,
#     "get_price_range": get_price_range,
#     "get_volume_info": get_volume_info,
#     "get_descriptive_stats": get_descriptive_stats,
# }

# tools = [
#     {
#         "type": "function",
#         "function": {
#             "name": func_name,
#             "description": f"Get {func_name.replace('_', ' ')}",
#             "parameters": {
#                 "type": "object",
#                 "properties": {},
#                 "required": []
#             }
#         }
#     }
#     for func_name in available_functions.keys()
# ]

# def create_new_function(df: pd.DataFrame, function_description: str) -> Dict[str, Any]:
#     messages = [
#         {"role": "system", "content": "You are an AI assistant capable of creating Python functions for data analysis. Create a function based on the given description using pandas and numpy. The function should take a pandas DataFrame 'df' as an argument and return the result as a dictionary."},
#         {"role": "user", "content": f"Create a function for the following task: {function_description}"}
#     ]
    
#     response = client.messages.create(
#         model="claude-3-opus-20240229",
#         max_tokens=1000,
#         messages=messages
#     )
    
#     function_code = response.content[0].text
    
#     # Extract the function definition
#     function_ast = ast.parse(function_code)
#     function_def = function_ast.body[0]
    
#     # Create a new function object
#     new_function = lambda df: eval(compile(ast.Expression(function_def.body[-1].value), "<string>", "eval"))
    
#     # Execute the new function
#     result = new_function(df)
    
#     return result

# @app.post("/api/chat")
# async def chat(request: ChatRequest):
#     df = get_stock_data()
    
#     messages = [
#         {"role": "system", "content": "You are a helpful assistant that analyzes Tesla stock data. Use the provided functions to get information about the stock. If no existing function can answer the query, suggest creating a new function."},
#         {"role": "user", "content": request.message}
#     ]
    
#     response = client.messages.create(
#         model="claude-3-opus-20240229",
#         max_tokens=1000,
#         messages=messages,
#         tools=tools
#     )
    
#     if response.content[0].type == 'text':
#         # Claude suggests creating a new function
#         function_description = response.content[0].text
#         result = create_new_function(df, function_description)
        
#         # Send the result back to Claude for interpretation
#         messages.append({"role": "assistant", "content": f"New function created and executed. Result: {result}"})
#         final_response = client.messages.create(
#             model="claude-3-opus-20240229",
#             max_tokens=1000,
#             messages=messages
#         )
        
#         return final_response.content[0].text
#     elif response.content[0].type == 'tool_call':
#         tool_call = response.content[0].tool_call
#         function_name = tool_call.function.name
        
#         if function_name in available_functions:
#             result = available_functions[function_name](df)
#         else:
#             # This shouldn't happen, but just in case
#             return f"Error: Function {function_name} not found."
        
#         # Send the result back to Claude for interpretation
#         messages.append({"role": "assistant", "content": f"Function {function_name} returned: {result}"})
#         final_response = client.messages.create(
#             model="claude-3-opus-20240229",
#             max_tokens=1000,
#             messages=messages
#         )
        
#         return final_response.content[0].text
#     else:
#         raise HTTPException(status_code=500, detail="Unexpected response from Claude API")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)

# main.py

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
import yfinance as yf
from io import StringIO
import openai
from typing import Optional

app = FastAPI()

# Replace with your actual OpenAI API key
openai.api_key = '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'

class AnalysisRequest(BaseModel):
    request: str

@app.post("/analyze")
async def analyze(request: str = Form(...), file: Optional[UploadFile] = File(None)):
    try:
        if file:
            # Read the CSV file
            contents = await file.read()
            df = pd.read_csv(StringIO(contents.decode("UTF8")), encoding='utf-8')
        else:
            # If no file is uploaded, use a default stock (e.g., AAPL) for the last 6 months
            df = yf.download('AAPL', period='6mo')

        # Prepare the data for the OpenAI API
        data_description = df.describe().to_string()
        prompt = f"""
        Given the following stock data and user request, provide a Python code snippet to perform the requested analysis. 
        Also, include a brief explanation of the analysis and its results.

        Stock Data Summary:
        {data_description}

        User Request: {request}

        Python Code:
        """

        # Call OpenAI API
        response = openai.Completion.create(
            engine="text-davinci-002",
            prompt=prompt,
            max_tokens=500
        )

        # Extract the generated code and explanation
        analysis_result = response.choices[0].text.strip()

        return JSONResponse(content={'result': analysis_result})

    except Exception as e:
        return JSONResponse(status_code=400, content={'error': str(e)})

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)