from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
from enum import Enum
import jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-this-in-production')

# Create the main app without a prefix
app = FastAPI(title="Value Number API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class UserRole(str, Enum):
    GUEST = "guest"
    USER = "user"
    EXECUTIVE = "executive"
    ADMIN = "admin"

class CalculationType(str, Enum):
    S_FORMULA = "s_formula"
    W_FORMULA = "w_formula"

class RecommendationLevel(str, Enum):
    STRONG_GO = "strong_go"
    GO = "go"
    CAUTION = "caution"
    NO_GO = "no_go"

# Models
class TimeInput(BaseModel):
    hours: int = Field(ge=0, le=9999)
    minutes: int = Field(ge=0, le=59)
    
    @validator('hours', 'minutes')
    def validate_time_input(cls, v):
        if v < 0:
            raise ValueError('Time values must be non-negative')
        return v
    
    def to_decimal_hours(self) -> float:
        return round(self.hours + (self.minutes / 60), 2)

class SFormulaInput(BaseModel):
    old_time: TimeInput
    old_effort: float = Field(ge=1, le=10)
    training_time: TimeInput
    new_effort: float = Field(ge=1, le=10)

class WFormulaInput(BaseModel):
    old_time: TimeInput
    old_effort: float = Field(ge=1, le=10)
    training_time: TimeInput
    new_effort: float = Field(ge=1, le=10)
    old_cost: float = Field(ge=0)
    new_cost: float = Field(ge=0)

class CalculationResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    calculation_type: CalculationType
    inputs: Dict[str, Any]
    value_number: float
    recommendation: RecommendationLevel
    explanation: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        use_enum_values = True

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    role: UserRole = UserRole.GUEST
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class UserCreate(BaseModel):
    email: str
    password: str
    invitation_code: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class InvitationRequest(BaseModel):
    name: str
    email: str
    organization: Optional[str] = None
    reason: str

# Helper Functions
def get_recommendation(value_number: float, calculation_type: CalculationType) -> tuple[RecommendationLevel, str]:
    """Determine recommendation level and explanation based on Value Number"""
    if calculation_type == CalculationType.S_FORMULA:
        if value_number >= 2.0:
            return RecommendationLevel.STRONG_GO, f"Excellent efficiency gain! VN of {value_number:.2f} indicates this change will significantly improve your productivity."
        elif value_number >= 1.5:
            return RecommendationLevel.GO, f"Good efficiency improvement. VN of {value_number:.2f} suggests this change is worthwhile."
        elif value_number >= 1.0:
            return RecommendationLevel.CAUTION, f"Marginal improvement. VN of {value_number:.2f} means the change may be worth considering, but benefits are limited."
        else:
            return RecommendationLevel.NO_GO, f"Not recommended. VN of {value_number:.2f} indicates the current method is more efficient."
    
    else:  # W_FORMULA
        if value_number >= 1.8:
            return RecommendationLevel.STRONG_GO, f"Excellent ROI! VN of {value_number:.2f} indicates strong financial and efficiency benefits."
        elif value_number >= 1.3:
            return RecommendationLevel.GO, f"Good investment. VN of {value_number:.2f} suggests solid returns on this change."
        elif value_number >= 0.9:
            return RecommendationLevel.CAUTION, f"Consider carefully. VN of {value_number:.2f} indicates modest benefits - evaluate other factors."
        else:
            return RecommendationLevel.NO_GO, f"Not financially viable. VN of {value_number:.2f} suggests the investment doesn't justify the returns."

def calculate_s_formula(inputs: SFormulaInput) -> float:
    """Calculate S Formula: S = Z / (Y + V)"""
    Z = inputs.old_time.to_decimal_hours()  # Old time
    Y = inputs.training_time.to_decimal_hours()  # Training time
    V = inputs.new_effort  # New effort
    
    if Y + V == 0:
        raise ValueError("Training time plus new effort cannot be zero")
    
    return round(Z / (Y + V), 3)

def calculate_w_formula(inputs: WFormulaInput) -> float:
    """Calculate W Formula: W = (Z×M) / (Y×T + V)"""
    Z = inputs.old_time.to_decimal_hours()  # Old time
    M = inputs.old_cost  # Old cost
    Y = inputs.training_time.to_decimal_hours()  # Training time
    T = inputs.new_cost  # New cost
    V = inputs.new_effort  # New effort
    
    numerator = Z * M
    denominator = (Y * T) + V
    
    if denominator == 0:
        raise ValueError("Denominator cannot be zero")
    
    return round(numerator / denominator, 3)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = await db.users.find_one({"id": user_id})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

async def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))):
    """Get current user if token is provided, otherwise return None"""
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        user = await db.users.find_one({"id": user_id})
        if user is None:
            return None
        return User(**user)
    except jwt.PyJWTError:
        return None



# Authentication Routes
@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Verify invitation code if provided
    role = UserRole.GUEST
    if user_data.invitation_code:
        if user_data.invitation_code == "VN-2025-GO":
            role = UserRole.USER
        elif user_data.invitation_code == "VN-EXEC-2025":
            role = UserRole.EXECUTIVE
        elif user_data.invitation_code == "VN-ADMIN-2025":
            role = UserRole.ADMIN
        else:
            raise HTTPException(status_code=400, detail="Invalid invitation code")
    
    # Hash password
    hashed_password = pwd_context.hash(user_data.password)
    
    # Create user
    user = User(
        email=user_data.email,
        role=role,
        created_at=datetime.utcnow()
    )
    
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token_expires = timedelta(days=30)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@api_router.post("/auth/login")
async def login(user_credentials: UserLogin):
    """Authenticate user and return token"""
    user_data = await db.users.find_one({"email": user_credentials.email})
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not pwd_context.verify(user_credentials.password, user_data["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user_data.get("is_active", True):
        raise HTTPException(status_code=401, detail="Account is disabled")
    
    # Update last login
    await db.users.update_one(
        {"id": user_data["id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Create access token
    access_token_expires = timedelta(days=30)
    access_token = create_access_token(
        data={"sub": user_data["id"]}, expires_delta=access_token_expires
    )
    
    user = User(**user_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@api_router.get("/auth/me", response_model=User)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

# Routes
@api_router.get("/")
async def root():
    return {"message": "Value Number API v1.0.0", "status": "active"}

@api_router.post("/calculate/s-formula", response_model=CalculationResult)
async def calculate_s_formula_endpoint(
    inputs: SFormulaInput,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Calculate S Formula (efficiency without cost bias)"""
    try:
        value_number = calculate_s_formula(inputs)
        recommendation, explanation = get_recommendation(value_number, CalculationType.S_FORMULA)
        
        result = CalculationResult(
            user_id=current_user.id if current_user else None,
            calculation_type=CalculationType.S_FORMULA,
            inputs=inputs.dict(),
            value_number=value_number,
            recommendation=recommendation,
            explanation=explanation
        )
        
        # Save to database
        await db.calculations.insert_one(result.dict())
        
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error occurred")

@api_router.post("/calculate/w-formula", response_model=CalculationResult)
async def calculate_w_formula_endpoint(
    inputs: WFormulaInput,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Calculate W Formula (includes financial factors)"""
    try:
        value_number = calculate_w_formula(inputs)
        recommendation, explanation = get_recommendation(value_number, CalculationType.W_FORMULA)
        
        result = CalculationResult(
            user_id=current_user.id if current_user else None,
            calculation_type=CalculationType.W_FORMULA,
            inputs=inputs.dict(),
            value_number=value_number,
            recommendation=recommendation,
            explanation=explanation
        )
        
        # Save to database
        await db.calculations.insert_one(result.dict())
        
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error occurred")

@api_router.get("/calculations/history")
async def get_calculation_history(current_user: User = Depends(get_current_user)):
    """Get user's calculation history"""
    calculations = await db.calculations.find(
        {"user_id": current_user.id}
    ).sort("timestamp", -1).limit(50).to_list(50)
    
    return [CalculationResult(**calc) for calc in calculations]

@api_router.post("/request-invitation")
async def request_invitation(request: InvitationRequest):
    """Request access invitation"""
    invitation = {
        "id": str(uuid.uuid4()),
        "name": request.name,
        "email": request.email,
        "organization": request.organization,
        "reason": request.reason,
        "requested_at": datetime.utcnow(),
        "status": "pending"
    }
    
    await db.invitation_requests.insert_one(invitation)
    
    return {"message": "Invitation request submitted successfully. You will be contacted soon."}

@api_router.post("/verify-passcode")
async def verify_passcode(passcode: str):
    """Verify invitation passcode"""
    valid_codes = ["VN-2025-GO"]  # Can be expanded or stored in database
    
    if passcode in valid_codes:
        return {"valid": True, "message": "Access granted"}
    else:
        return {"valid": False, "message": "Invalid passcode"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()