from fastapi.testclient import TestClient

from app.database import SessionLocal
from app.main import app
from app.models import Application

client = TestClient(app)


def clear_applications():
    db = SessionLocal()
    try:
        db.query(Application).delete()
        db.commit()
    finally:
        db.close()


def auth_headers():
    response = client.post(
        "/auth/login",
        data={"username": "admin", "password": "admin123"},
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_auth_rejects_bad_password():
    response = client.post(
        "/auth/login",
        data={"username": "admin", "password": "wrong-password"},
    )

    assert response.status_code == 401


def test_crud_and_analytics_flow():
    clear_applications()
    headers = auth_headers()

    create_payload = {
        "company": "Contoso",
        "role": "Backend Intern",
        "track": "Backend",
        "status": "Applied",
        "notes": "pytest smoke",
        "date_applied": "2026-08-03",
    }
    create_response = client.post("/applications", json=create_payload, headers=headers)
    assert create_response.status_code == 201
    created = create_response.json()

    list_response = client.get("/applications", headers=headers)
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    patch_response = client.patch(
        f"/applications/{created['id']}",
        json={"status": "Interview"},
        headers=headers,
    )
    assert patch_response.status_code == 200
    assert patch_response.json()["status"] == "Interview"

    summary_response = client.get("/analytics/summary", headers=headers)
    assert summary_response.status_code == 200
    summary = summary_response.json()
    assert summary["total_applications"] == 1
    assert summary["total_responses"] == 1
    assert summary["response_rate"] == 100.0

    delete_response = client.delete(f"/applications/{created['id']}", headers=headers)
    assert delete_response.status_code == 204

    final_list = client.get("/applications", headers=headers)
    assert final_list.status_code == 200
    assert final_list.json() == []

    clear_applications()
