import { STATUS_COLUMNS } from "../api";
import Column from "./Column";

export default function Board({ applications, onMove, onEdit, onDelete, onAdd }) {
  return (
    <section className="board-wrapper">
      <div className="board-header">
        <h2>Application Pipeline</h2>
        <button type="button" className="primary" onClick={onAdd}>
          Add Application
        </button>
      </div>
      <div className="board-grid">
        {STATUS_COLUMNS.map((status) => (
          <Column
            key={status}
            status={status}
            applications={applications.filter((application) => application.status === status)}
            onMove={onMove}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
