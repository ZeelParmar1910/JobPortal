import os

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .auth import authenticate_user, create_access_token, get_current_user, hash_password
from .database import Base, SessionLocal, engine, get_db

load_dotenv()

app = FastAPI(title="Job Portal API", version="1.0.0")

frontend_origins_raw = os.getenv(
    "FRONTEND_ORIGINS",
    os.getenv("FRONTEND_ORIGIN", "http://localhost:5173,http://127.0.0.1:5173"),
)
frontend_origins = [origin.strip() for origin in frontend_origins_raw.split(",") if origin.strip()]

for local_origin in ("http://localhost:5173", "http://127.0.0.1:5173"):
    if local_origin not in frontend_origins:
        frontend_origins.append(local_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

    demo_username = os.getenv("DEMO_USERNAME", "admin")
    demo_password = os.getenv("DEMO_PASSWORD", "admin123")

    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(models.User.username == demo_username).first()
        if not existing:
            db_user = models.User(username=demo_username, hashed_password=hash_password(demo_password))
            db.add(db_user)
            db.commit()
    finally:
        db.close()


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(user.username)
    return {"access_token": token, "token_type": "bearer"}


@app.get("/applications", response_model=list[schemas.ApplicationOut])
def read_applications(
    _current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.list_applications(db)


@app.post("/applications", response_model=schemas.ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: schemas.ApplicationCreate,
    _current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.create_application(db, payload)


@app.patch("/applications/{application_id}", response_model=schemas.ApplicationOut)
def patch_application(
    application_id: int,
    payload: schemas.ApplicationUpdate,
    _current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    application = crud.get_application(db, application_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    return crud.update_application(db, application, payload)


@app.delete("/applications/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_application(
    application_id: int,
    _current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    application = crud.get_application(db, application_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    crud.delete_application(db, application)


@app.get("/analytics/summary", response_model=schemas.AnalyticsSummary)
def read_summary(
    _current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.analytics_summary(db)
