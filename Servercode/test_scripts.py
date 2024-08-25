import requests 
import json
import yfinance as yf
# url = "http://localhost:11434/api/chat"

# def llama3(prompt) :
#     data = {
#         "model": "llama3",
#         "messages": [
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ],
#         "stream": False
#     }
#     headers = {
#         'Content-Type': 'application/json'
#     }

#     response = requests.post(url, headers=headers, json=data)
#     # print(response)

#     return(response.json() ['message'] ['content'])

                                     

# response = llama3("who wrote the book autobiography of a Yogi?")
# print(response)


url = "http://localhost:11434/api/chat"

# @app.post("/api/AI-assistant")
def llama3(company, agentName) :

    # Fetch historical data (e.g., 5 years)
    stock_data = yf.download(company, period="5y")

    prompt = f"""
        Here is the historical stock data for {company}: {stock_data.to_string()}
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
        **Additionally, analyze the historical volatility of the company's stock price to assess its risk profile.**

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

