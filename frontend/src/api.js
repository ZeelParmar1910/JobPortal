const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const STATUS_COLUMNS = ["Applied", "Interview", "Offer", "Accepted", "Rejected"];

function withAuthHeaders(token, headers = {}) {
  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
}

async function parseResponse(response) {
  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      message = `${message} (${response.status})`;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function login(username, password) {
  const body = new URLSearchParams({ username, password });
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  return parseResponse(response);
}

export async function fetchApplications(token) {
  const response = await fetch(`${API_BASE}/applications`, {
    headers: withAuthHeaders(token),
  });
  return parseResponse(response);
}

export async function createApplication(token, payload) {
  const response = await fetch(`${API_BASE}/applications`, {
    method: "POST",
    headers: withAuthHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function updateApplication(token, id, payload) {
  const response = await fetch(`${API_BASE}/applications/${id}`, {
    method: "PATCH",
    headers: withAuthHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function deleteApplication(token, id) {
  const response = await fetch(`${API_BASE}/applications/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(token),
  });
  return parseResponse(response);
}

export async function fetchSummary(token) {
  const response = await fetch(`${API_BASE}/analytics/summary`, {
    headers: withAuthHeaders(token),
  });
  return parseResponse(response);
}
