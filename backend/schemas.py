from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Auth schemas
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword",
                "full_name": "John Doe"
            }
        }

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# User schemas
class UserResponse(BaseModel):
    id: str
    email: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ProfileResponse(BaseModel):
    full_name: Optional[str]
    avatar_url: Optional[str]
    preferences: Optional[str]
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserDetailResponse(BaseModel):
    id: str
    email: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    profile: Optional[ProfileResponse]
    
    class Config:
        from_attributes = True

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    preferences: Optional[str] = None

# Watchlist schemas
class WatchlistItemResponse(BaseModel):
    id: str
    symbol: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class WatchlistAddRequest(BaseModel):
    symbol: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "AAPL"
            }
        }

class ErrorResponse(BaseModel):
    detail: str
