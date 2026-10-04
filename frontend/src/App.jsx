import { useEffect, useMemo, useState } from "react";

import {
  createApplication,
  deleteApplication,
  fetchApplications,
  fetchSummary,
  login,
  updateApplication,
} from "./api";
import ApplicationModal from "./components/ApplicationModal";
import Board from "./components/Board";
import Dashboard from "./components/Dashboard";

const EMPTY_SUMMARY = {
  total_applications: 0,
  total_responses: 0,
  response_rate: 0,
  by_track: {},
  by_status: {},
};

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const token = await login(username, password);
      onLogin(token.access_token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Job Portal Tracker</h1>
        <p>Track applications in a Kanban board and watch your response trends.</p>
        <form onSubmit={submit} className="auth-form">
          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" className="primary">
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("jobportal_token") || "");
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [view, setView] = useState("board");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({ open: false, editing: null });

  const isAuthed = useMemo(() => Boolean(token), [token]);

  const loadData = async (activeToken) => {
    setLoading(true);
    setError("");
    try {
      const [appsData, summaryData] = await Promise.all([
        fetchApplications(activeToken),
        fetchSummary(activeToken),
      ]);
      setApplications(appsData);
      setSummary(summaryData);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    localStorage.setItem("jobportal_token", token);
    loadData(token);
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("jobportal_token");
    setToken("");
    setApplications([]);
    setSummary(EMPTY_SUMMARY);
  };

  const handleAdd = () => {
    setModalState({ open: true, editing: null });
  };

  const handleEdit = (application) => {
    setModalState({ open: true, editing: application });
  };

  const closeModal = () => {
    setModalState({ open: false, editing: null });
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalState.editing) {
        await updateApplication(token, modalState.editing.id, formData);
      } else {
        await createApplication(token, formData);
      }
      closeModal();
      loadData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this application?");
    if (!ok) {
      return;
    }

    try {
      await deleteApplication(token, id);
      loadData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleMove = async (id, nextStatus) => {
    const previous = [...applications];
    setApplications((current) =>
      current.map((application) =>
        application.id === id ? { ...application, status: nextStatus } : application
      )
    );

    try {
      await updateApplication(token, id, { status: nextStatus });
      loadData(token);
    } catch (requestError) {
      setApplications(previous);
      setError(requestError.message);
    }
  };

  if (!isAuthed) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>Job Application Command Center</h1>
          <p>Full-stack application pipeline management and analytics dashboard.</p>
        </div>
        <div className="header-actions">
          <button type="button" onClick={() => setView("board")} className={view === "board" ? "active" : ""}>
            Board
          </button>
          <button type="button" onClick={() => setView("dashboard")} className={view === "dashboard" ? "active" : ""}>
            Dashboard
          </button>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {error ? <p className="error banner">{error}</p> : null}
      {loading ? <p className="loading">Loading latest data...</p> : null}

      {view === "board" ? (
        <Board
          applications={applications}
          onMove={handleMove}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      ) : (
        <Dashboard summary={summary} />
      )}

      {modalState.open ? (
        <ApplicationModal
          initialData={modalState.editing}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      ) : null}
    </main>
  );
}
