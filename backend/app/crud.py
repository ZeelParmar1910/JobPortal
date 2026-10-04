from collections import Counter

from sqlalchemy.orm import Session

from .models import Application
from .schemas import ApplicationCreate, ApplicationUpdate


def list_applications(db: Session) -> list[Application]:
    return db.query(Application).order_by(Application.date_applied.desc()).all()


def create_application(db: Session, payload: ApplicationCreate) -> Application:
    application = Application(**payload.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def get_application(db: Session, application_id: int) -> Application | None:
    return db.query(Application).filter(Application.id == application_id).first()


def update_application(db: Session, application: Application, payload: ApplicationUpdate) -> Application:
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(application, key, value)

    db.commit()
    db.refresh(application)
    return application


def delete_application(db: Session, application: Application) -> None:
    db.delete(application)
    db.commit()


def analytics_summary(db: Session) -> dict:
    apps = db.query(Application).all()
    total = len(apps)
    by_track = Counter(app.track for app in apps)
    by_status = Counter(app.status for app in apps)

    responded_statuses = {"Interview", "Offer", "Rejected", "Accepted"}
    total_responses = sum(1 for app in apps if app.status in responded_statuses)
    response_rate = round((total_responses / total) * 100, 2) if total else 0.0

    return {
        "total_applications": total,
        "total_responses": total_responses,
        "response_rate": response_rate,
        "by_track": dict(by_track),
        "by_status": dict(by_status),
    }
