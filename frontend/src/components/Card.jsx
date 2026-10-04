export default function Card({ application, onEdit, onDelete }) {
  const dragStart = (event) => {
    event.dataTransfer.setData("applicationId", String(application.id));
  };

  return (
    <article className="card" draggable onDragStart={dragStart}>
      <header className="card-header">
        <h4>{application.company}</h4>
        <span className="chip">{application.track}</span>
      </header>
      <p className="role">{application.role}</p>
      <p className="date">Applied: {application.date_applied}</p>
      {application.notes ? <p className="notes">{application.notes}</p> : null}
      <div className="card-actions">
        <button type="button" onClick={() => onEdit(application)}>
          Edit
        </button>
        <button type="button" className="danger" onClick={() => onDelete(application.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
