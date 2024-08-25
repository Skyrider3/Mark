import requests 
import json
import yfinance as yf

url = "http://localhost:11434/api/chat"

# @app.post("/api/AI-assistant")
def llama3(company, agentName) :

    # Fetch historical data (e.g., 5 years)
    stock_data = yf.download(company, period="5y")

    prompt = f"""
        Here is the historical stock data for {company}: {stock_data.to_string()}
        Give a comprehensive and complete analysis with principles and fundamental analysis usin {agentName} methods
        """
    # print ("for this {company} do the {agentName} analysis and give me a report in this format" + prompt)
    data = {
        "model": "llama3",
        "messages": [
            {
                "role": "user",
                "content": f"for this {company} do the {agentName} analysis and give me a report in this format" + prompt
            }
        ],
        "stream": False
    }
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.post(url, headers=headers, json=data)

    # print(response)

    return(response.json() ['message'] ['content'])

                                     

response = llama3("AAPL","warren buffet")
print(response)

