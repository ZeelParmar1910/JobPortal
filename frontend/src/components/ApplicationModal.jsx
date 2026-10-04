import { useMemo, useState } from "react";

import { STATUS_COLUMNS } from "../api";

function getTodayDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

export default function ApplicationModal({ initialData, onClose, onSubmit }) {
  const initial = useMemo(
    () => ({
      company: initialData?.company || "",
      role: initialData?.role || "",
      track: initialData?.track || "Frontend",
      status: initialData?.status || "Applied",
      notes: initialData?.notes || "",
      date_applied: initialData?.date_applied || getTodayDate(),
    }),
    [initialData]
  );

  const [form, setForm] = useState(initial);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <h3>{initialData ? "Edit Application" : "Add Application"}</h3>
        <form className="modal-form" onSubmit={submit}>
          <label>
            Company
            <input
              type="text"
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
              required
            />
          </label>
          <label>
            Role
            <input
              type="text"
              value={form.role}
              onChange={(event) => updateField("role", event.target.value)}
              required
            />
          </label>
          <label>
            Track
            <select value={form.track} onChange={(event) => updateField("track", event.target.value)}>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Research</option>
              <option>Full-Stack</option>
            </select>
          </label>
          <label>
            Status
            <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
              {STATUS_COLUMNS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date Applied
            <input
              type="date"
              value={form.date_applied}
              onChange={(event) => updateField("date_applied", event.target.value)}
              required
            />
          </label>
          <label>
            Notes
            <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} rows={3} />
          </label>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
