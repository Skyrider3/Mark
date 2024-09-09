# # FROM --platform=linux/amd64 python:3.9

# FROM --platform=linux/amd64 python:3.10
# # # Use an official Python runtime as the base image
# # FROM python:3.9

# # Set the working directory in the container
# WORKDIR /Servercode

# # Install system dependencies
# RUN apt-get update && apt-get install -y \
#     libhdf5-dev \
#     && rm -rf /var/lib/apt/lists/*

# # Copy the requirements file into the container
# COPY requirements.txt .

# # Install the required packages
# RUN pip install --no-cache-dir -r requirements.txt

# # Install uvicorn explicitly
# RUN pip install uvicorn

# # Copy the rest of the application code
# COPY . .

# # Expose the port the app runs on
# EXPOSE 8000

# # Define the command to run the app
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM --platform=linux/amd64 python:3.9

WORKDIR /Servercode


# Install ngrok
RUN curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
    tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
    tee /etc/apt/sources.list.d/ngrok.list && \
    apt update && apt install ngrok

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create a script to run both FastAPI and ngrok
RUN echo '#!/bin/bash\n\
ngrok http 8000 --log=stdout > ngrok.log &\n\
uvicorn main:app --host 0.0.0.0 --port 8000' > /Servercode/start.sh

RUN chmod +x /Servercode/start.sh

CMD ["/Servercode/start.sh"]