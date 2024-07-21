import requests

def check_ollama_endpoints():
    base_url = "http://localhost:11434/api"
    endpoints = ["", "/tags", "/generate", "/chat", "/embeddings"]
    
    print("Checking Ollama API endpoints:")
    for endpoint in endpoints:
        url = base_url + endpoint
        try:
            response = requests.get(url)
            status = "Available" if response.status_code == 200 else f"Not Available (Status: {response.status_code})"
            print(f"{url}: {status}")
        except requests.exceptions.RequestException as e:
            print(f"{url}: Error - {str(e)}")

if __name__ == "__main__":
    check_ollama_endpoints()