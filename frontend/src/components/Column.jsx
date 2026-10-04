import Card from "./Card";

export default function Column({ status, applications, onMove, onEdit, onDelete }) {
  const dragOver = (event) => {
    event.preventDefault();
  };

  const drop = (event) => {
    event.preventDefault();
    const rawId = event.dataTransfer.getData("applicationId");
    if (!rawId) {
      return;
    }

    onMove(Number(rawId), status);
  };

  return (
    <section className="column" onDragOver={dragOver} onDrop={drop}>
      <header className="column-header">
        <h3>{status}</h3>
        <span>{applications.length}</span>
      </header>
      <div className="column-cards">
        {applications.map((application) => (
          <Card
            key={application.id}
            application={application}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
