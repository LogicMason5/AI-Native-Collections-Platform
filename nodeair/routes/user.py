from typing import Union

from core.db import get_db
from core.schemas import User
from core.models import RegisterUser
from core.ratelimit import RateLimit
from utils import random_username
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()