from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from schemas import WatchlistItemResponse, WatchlistAddRequest
from models import User, Watchlist
from database import get_db
from auth import get_user_id_from_token

router = APIRouter(prefix="/api/watchlist", tags=["watchlist"])

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

@router.get("", response_model=List[WatchlistItemResponse])
def get_watchlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's watchlist"""
    watchlist = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).all()
    return watchlist

@router.post("", response_model=WatchlistItemResponse)
def add_to_watchlist(
    request: WatchlistAddRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add symbol to watchlist"""
    # Check if symbol already in watchlist
    existing = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.symbol == request.symbol
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Symbol already in watchlist"
        )
    
    watchlist_item = Watchlist(
        user_id=current_user.id,
        symbol=request.symbol
    )
    db.add(watchlist_item)
    db.commit()
    db.refresh(watchlist_item)
    
    return watchlist_item

@router.delete("/{symbol}")
def remove_from_watchlist(
    symbol: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove symbol from watchlist"""
    watchlist_item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.symbol == symbol
    ).first()
    
    if not watchlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symbol not found in watchlist"
        )
    
    db.delete(watchlist_item)
    db.commit()
    
    return {"detail": "Symbol removed from watchlist"}
