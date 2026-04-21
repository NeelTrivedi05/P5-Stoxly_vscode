from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from schemas import UserDetailResponse, ProfileUpdateRequest, UserResponse
from models import User, Profile
from database import get_db
from auth import get_user_id_from_token
from typing import Optional

router = APIRouter(prefix="/api/users", tags=["users"])

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Dependency to get current user from JWT token"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.get("/me", response_model=UserDetailResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@router.put("/me", response_model=UserDetailResponse)
def update_user_profile(
    request: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    
    if not profile:
        # Create profile if it doesn't exist
        profile = Profile(user_id=current_user.id)
        db.add(profile)
    
    if request.full_name is not None:
        profile.full_name = request.full_name
    if request.avatar_url is not None:
        profile.avatar_url = request.avatar_url
    if request.preferences is not None:
        profile.preferences = request.preferences
    
    db.commit()
    db.refresh(current_user)
    
    return current_user
