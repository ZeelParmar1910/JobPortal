import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#f59e0b", "#0ea5e9", "#10b981", "#ef4444", "#8b5cf6"];

function mapObjectToChartRows(data = {}) {
  return Object.entries(data).map(([name, value]) => ({ name, value }));
}

export default function Dashboard({ summary }) {
  const byTrack = mapObjectToChartRows(summary.by_track);
  const byStatus = mapObjectToChartRows(summary.by_status);

  return (
    <section className="dashboard">
      <div className="stats-row">
        <article className="stat-card">
          <h4>Total Applications</h4>
          <p>{summary.total_applications}</p>
        </article>
        <article className="stat-card">
          <h4>Total Responses</h4>
          <p>{summary.total_responses}</p>
        </article>
        <article className="stat-card">
          <h4>Response Rate</h4>
          <p>{summary.response_rate}%</p>
        </article>
      </div>

      <div className="charts-grid">
        <article className="chart-card">
          <h4>Applications by Track</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byTrack}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="chart-card">
          <h4>Status Distribution</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={100} innerRadius={50}>
                {byStatus.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </article>
      </div>
    </section>
  );
}
