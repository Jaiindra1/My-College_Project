import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import api from "../../api/axiosInstance";


// Register chart components
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch Dashboard Stats
  useEffect(() => {
    fetch("https://my-college-project-server.onrender.com/api/dashboard/admin", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("❌ Error fetching dashboard:", err));
  }, [token]);

  // ✅ Fetch Attendance Summary
  useEffect(() => {
    fetch("https://my-college-project-server.onrender.com/api/reports/attendance/summary", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("📌 Attendance Summary API:", json);
        // Handle array or object
        if (Array.isArray(json)) {
          setAttendanceSummary(json);
        } else if (json.data && Array.isArray(json.data)) {
          setAttendanceSummary(json.data);
        } else {
          setAttendanceSummary([]);
          setError("Attendance data not found or invalid format.");
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching attendance summary:", err);
        setError("Failed to load attendance data.");
      });
  }, [token]);

  if (!data) return <div style={styles.loading}>Loading Dashboard...</div>;

  const safeAttendance = Array.isArray(attendanceSummary) ? attendanceSummary : [];

  const attendanceTrend = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Attendance %",
        data: [70, 75, 80, data.avg_attendance],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const examPerformance = {
    labels: ["Maths", "C Language", "English", "Physics"],
    datasets: [
      {
        label: "Pass %",
        data: [60, 75, 80, 90],
        backgroundColor: ["#93c5fd", "#60a5fa", "#3b82f6", "#2563eb"],
      },
    ],
  };

  const backlogData = [
    { subject: "Math", percent: 25 },
    { subject: "Science", percent: 15 },
    { subject: "English", percent: 10 },
  ];
  const navItems = [
  { id: 1, label: "Students", path: "/students" },
  { id: 2, label: "Exams", path: "/exams" },
  { id: 3, label: "Fees", path: "/admin/fees" },
  { id: 4, label: "Faculty", path: "/admin/faculty" },
  { id: 5, label: "Placements", path: "/placements" },
  { id: 6, label: "Reports", path: "/admin/reports" },
  { id: 7, label: "Notifications", path: "/notifications" },
];

  return (
    <div style={{ ...styles.app, background: dark ? "#111827" : "#f9fafb", color: dark ? "#fff" : "#000" }}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, background: dark ? "#1f2937" : "#fff" }}>
        <div style={styles.logoSection}>
          <div style={{ ...styles.logoIcon, background: "#2563eb", color: "#fff" }}>🎓</div>
          <h2 style={styles.logoText}>College Admin</h2>
        </div>
        {navItems.map((item) => (
      <a key={item.id} href={item.path} style={styles.navItem}>
        {item.label}
      </a>
    ))}
      </aside>
      {/* Main */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <button
            onClick={() => setDark(!dark)}
            style={{
              ...styles.toggleBtn,
              background: dark ? "#2563eb" : "#e5e7eb",
              color: dark ? "#fff" : "#000",
            }}
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </header>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <Stat label="Total Students" value={data.total_students} change="+10%" />
          <Stat label="Faculty" value={data.total_faculty} change="+5%" />
          <Stat label="Pending Fees" value={`$${data.pending_fees}`} change="-15%" negative />
          <Stat label="Students Placed" value={data.students_placed} change="+20%" />
          <Stat label="Avg Attendance" value={`${data.avg_attendance}%`} change="+2%" />
          <Stat label="Notifications" value={data.recent_notifications.length} change="+5%" />
        </div>

        {/* Charts */}
        <h2 style={styles.sectionTitle}>Analytics</h2>
        <div style={styles.analyticsGrid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Attendance Trends</h3>
            <Line data={attendanceTrend} options={{ responsive: true }} />
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Exam Performance</h3>
            <Bar data={examPerformance} options={{ responsive: true }} />
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Semester-wise Attendance</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {safeAttendance.length > 0 ? (
              <Bar
                data={{
                  labels: safeAttendance.map((r) => `Sem-${r.semester || r.sem}`),
                  datasets: [
                    {
                      label: "Avg Attendance %",
                      data: safeAttendance.map((r) => r.avg_attendance || r.average),
                      backgroundColor: "#2563eb",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: { y: { beginAtZero: true, max: 100 } },
                }}
              />
            ) : (
              <p>No attendance data available.</p>
            )}
          </div>
        </div>

        {/* Notifications */}
        <h2 style={styles.sectionTitle}>Recent Notifications</h2>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Audience</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_notifications.map((n, i) => (
                <tr key={i} style={styles.tr}>
                  <td style={styles.td}>{n.title}</td>
                  <td style={styles.td}>{n.audience}</td>
                  <td style={styles.td}>{new Date(n.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </main>
      </div>
        );
    }
        // ✅ Stat Card Component
        function Stat({ label, value, change, negative }) {
          return (
            <div style={styles.statCard}>
              <p style={styles.statLabel}>{label}</p>
              <p style={styles.statValue}>{value}</p>
              {change && (
                <span style={{ fontSize: 12, color: negative ? "#ef4444" : "#10b981", fontWeight: 500 }}>{change}</span>
              )}
            </div>
          );
        }
// ✅ Styles
const styles = {
  app: { display: "flex", height: "100vh", fontFamily: "Inter, Arial, sans-serif" },
  sidebar: { width: 230, padding: 20, borderRight: "1px solid #e5e7eb", boxShadow: "2px 0 5px rgba(0,0,0,0.05)" },
  logoSection: { display: "flex", alignItems: "center", gap: 10, marginBottom: 30 },
  logoIcon: { padding: 8, borderRadius: 8, fontSize: 20 },
  logoText: { fontSize: 20, fontWeight: "bold", color: "#2563eb" },
  navItem: {
    display: "block",
    padding: "10px 15px",
    marginBottom: 8,
    borderRadius: 6,
    textDecoration: "none",
    color: "#4b5563",
    fontWeight: 500,
    transition: "0.3s",
  },
  main: { flex: 1, padding: 30, overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  pageTitle: { fontSize: 28, fontWeight: "bold", color: "#1f2937" },
  toggleBtn: { padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 20, marginBottom: 30 },
  statCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  statLabel: { fontSize: 14, color: "#6b7280" },
  statValue: { fontSize: 26, fontWeight: "bold", color: "#111827" },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 20, marginTop: 10, color: "#374151" },
  analyticsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 20, marginBottom: 30 },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  cardTitle: { fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#374151" },
  tableWrapper: { overflowX: "auto", background: "#fff", borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.08)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: 12, background: "#f3f4f6", fontWeight: 600, fontSize: 14 },
  td: { padding: 12, borderTop: "1px solid #e5e7eb", fontSize: 14, color: "#374151" },
  tr: { background: "#fff" },
  loading: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 24 },
};
