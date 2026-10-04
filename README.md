# JobPortal

[![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=flat&logo=python)](https://python.org)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat&logo=sqlite)](https://sqlite.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern full-stack application tracking system and analytics pipeline designed to manage, organize, and evaluate job search workflows. Built with a **FastAPI** backend and a responsive **React (Vite)** frontend featuring an interactive Kanban board and real-time conversion metrics.

---

## 🌟 Key Features

- **Interactive Kanban Pipeline**: Drag-and-drop job application cards across hiring stages (*Applied*, *Interview*, *Offer*, *Accepted*, *Rejected*) with optimistic UI updates and server rollback protection.
- **Real-Time Analytics Dashboard**: Visual breakdown of applications by target engineering track, status distribution, and response rate calculations powered by **Recharts**.
- **Secure Authentication**: JWT (JSON Web Token) authentication with bcrypt password hashing and token expiration guards.
- **RESTful Architecture**: Clean CRUD endpoints backed by SQLAlchemy ORM and validated through Pydantic schemas.
- **Automated Test Coverage**: Comprehensive backend unit & integration tests using **Pytest**, paired with end-to-end browser smoke testing via **Playwright**.

---

## 🏗️ Architecture & Project Structure

```text
JobPortal/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py         # JWT authentication, password hashing, user context
│   │   ├── crud.py         # Database query logic & metrics calculations
│   │   ├── database.py     # SQLAlchemy engine, session maker, base models
│   │   ├── main.py         # FastAPI routes, CORS configuration, startup hooks
│   │   ├── models.py       # SQLAlchemy ORM table definitions
│   │   └── schemas.py      # Pydantic validation & response schemas
│   ├── tests/
│   │   └── test_api.py     # Backend test suite (auth, CRUD, analytics)
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variable template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApplicationModal.jsx  # Creation and edit modal
│   │   │   ├── Board.jsx             # Kanban board container
│   │   │   ├── Card.jsx              # Draggable application card
│   │   │   ├── Column.jsx            # Stage drop target column
│   │   │   └── Dashboard.jsx         # Metric charts (Recharts)
│   │   ├── api.js          # Fetch client wrapper with auth injection
│   │   ├── App.jsx         # Root state & view orchestration
│   │   ├── main.jsx        # React entrypoint
│   │   └── styles.css      # Design system & responsive layout
│   ├── tests/
│   │   └── e2e/            # Playwright browser end-to-end tests
│   ├── package.json        # Frontend dependencies & scripts
│   └── vite.config.js      # Vite build configuration
│
├── start-dev.bat           # Convenience launcher for Windows (cmd)
├── start-dev.ps1           # Convenience launcher for PowerShell
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Recharts, HTML5 Drag-and-Drop API, Vanilla CSS Design System |
| **Backend** | FastAPI, Python 3.10+, SQLAlchemy 2.0, Pydantic, Uvicorn (ASGI) |
| **Security** | Python-Jose (JWT), Passlib / Bcrypt password hashing |
| **Database** | SQLite (Embedded relational database) |
| **Testing** | Pytest, HTTPX / TestClient, Playwright |

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+** installed
- **Node.js 18+** and `npm` installed

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Run FastAPI server with auto-reload
uvicorn app.main:app --reload
```
API server runs at `http://127.0.0.1:8000`. Interactive OpenAPI documentation is available at `http://127.0.0.1:8000/docs`.

Default credentials:
- **Username**: `admin`
- **Password**: `admin123`

### 2. Frontend Setup

In a separate terminal:
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend client runs at `http://localhost:5173`.

---

## ⚡ Quick Launch (Windows)

To launch both FastAPI and Vite servers with a single command from the project root:

```cmd
start-dev.bat
```
*(Or run `./start-dev.ps1` in PowerShell).*

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/auth/login` | Authenticate user and receive JWT access token | No |
| `GET` | `/health` | Health check endpoint | No |
| `GET` | `/applications` | List all applications sorted by application date | Yes |
| `POST` | `/applications` | Create a new application entry | Yes |
| `PATCH` | `/applications/{id}` | Update application details or pipeline status | Yes |
| `DELETE` | `/applications/{id}` | Remove an application entry | Yes |
| `GET` | `/analytics/summary` | Aggregate metrics (totals, response rate, by track, by status) | Yes |

---

## 🧪 Testing

### Backend Unit & Integration Tests
```bash
cd backend
pytest -v
```

### Frontend End-to-End Tests
```bash
cd frontend
npx playwright install chromium
npm run test:e2e
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
