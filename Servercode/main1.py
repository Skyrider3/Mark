# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import routers from other modules
from .routers import authentication, watchlist, stock_data, data_analysis, ai_advisor, dashboard, alerts

# Database setup (can be moved to a separate module)
import databases
import sqlalchemy

DATABASE_URL = "sqlite:///./test.db"
database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

# ... (Table definitions for users and watchlists)

engine = sqlalchemy.create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
metadata.create_all(engine)

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

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "https://4fa8-2601-19b-b00-26d0-9d27-c9a1-aed8-8905.ngrok-free.app ",
    ],  # Add your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(authentication.router)
app.include_router(watchlist.router)
app.include_router(stock_data.router)
app.include_router(data_analysis.router)
app.include_router(ai_advisor.router)
app.include_router(dashboard.router)
app.include_router(alerts.router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
