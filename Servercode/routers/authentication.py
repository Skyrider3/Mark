# routers/authentication.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

# Import database and models
from ..main import database, users
from ..models import Token, User, UserInDB, UserCreate

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ... (Authentication functions: verify_password, get_password_hash, get_user, authenticate_user, create_access_token)

async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # #logger.info(f"Login attempt for user: {form_data.username}")
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/register")
async def register(user: UserCreate):
    ##logger.info(f"Registration attempt for user: {user.username}")
    query = users.select().where(users.c.username == user.username)
    existing_user = await database.fetch_one(query)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    query = users.insert().values(username=user.username, hashed_password=hashed_password)
    try:
        await database.execute(query)
        return {"message": "User created successfully"}
    except Exception as e:
        ##logger.error(f"Error during registration: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while registering the user")


@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user