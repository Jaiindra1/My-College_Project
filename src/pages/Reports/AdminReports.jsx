import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function AdminReports() {
  const token = localStorage.getItem("token");
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [backlogSummary, setBacklogSummary] = useState([]);
  const [examPerformance, setExamPerformance] = useState([]);
  const [subjectDetails, setSubjectDetails] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [attRes, backlogRes, examRes] = await api.Promise.all([
          fetch("/reports/attendance/summary", {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),
          fetch("/reports/backlogs/summary", {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),
          fetch("/reports/exam-performance", {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),
        ]);

        setAttendanceSummary(attRes.data || []);
        setBacklogSummary(backlogRes || []);
        setExamPerformance(examRes.data || []);

        // fetch subjects
        fetch("/subjects/", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => setSubjects(data.subjects || data))
          .catch((err) => console.error("❌ Error fetching subjects:", err));
      } catch (err) {
        console.error("❌ Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [token]);

  const fetchSubjectAttendance = (subjectId) => {
    fetch(
      `/reports/attendance/subject/${subjectId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => setSubjectDetails(data))
      .catch((err) =>
        console.error("❌ Error fetching subject-wise attendance:", err)
      );
  };

  if (loading) return <div className="text-center mt-12 text-xl">Loading Reports...</div>;

  // Chart Data
  const attendanceChartData = {
    labels: attendanceSummary.map((r) => `${new Date(r.month).toLocaleString("default", {month: "long",})}`),
    datasets: [
      {
        label: "Avg Attendance %",
        data: attendanceSummary.map((r) => r.average),
        backgroundColor: "#2563eb",
        borderRadius: 6,
        barPercentage: 0.4,
        categoryPercentage: 0.6,
      },
    ],
  };

  const backlogPieData = {
    labels: backlogSummary.map((r) => r.subject_name),
    datasets: [
      {
        data: backlogSummary.map((r) => r.backlog_count),
        backgroundColor: [
          "#f87171",
          "#fb923c",
          "#facc15",
          "#34d399",
          "#60a5fa",
        ],
      },
    ],
  };

  const examChartData = {
    labels: examPerformance.map((r) => `${r.semester}-${r.subject_name}`),
    datasets: [
      {
        label: "Pass %",
        data: examPerformance.map((r) => r.pass_percentage),
        backgroundColor: "#10b981",
        borderRadius: 6,
        barPercentage: 0.4,
        categoryPercentage: 0.6
      },
      {
        label: "Avg Marks",
        data: examPerformance.map((r) => r.avg_marks),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="flex min-h-screen font-display bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          📈 Admin Reports
        </h1>

        {/* Grid for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance */}
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              Semester-wise Attendance Summary
            </h2>
            {attendanceSummary.length > 0 ? (
              <Bar
                data={attendanceChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, position: "top" },
                  },
                  scales: { y: { beginAtZero: true, max: 100 } },
                }}
              />
            ) : (
              <p>No attendance data available.</p>
            )}
          </section>

          {/* Exam Performance */}
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              Exam Performance Trends
            </h2>
            <Bar data={examChartData} options={{ responsive: true }} />
          </section>

          {/* Backlogs */}
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              Backlog Analysis
            </h2>
            <div className="flex justify-center">
              <Pie
                data={backlogPieData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "right" },
                  },
                }}
              />
            </div>
          </section>

          {/* Subject-wise Attendance */}
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              Subject-wise Attendance
            </h2>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                fetchSubjectAttendance(e.target.value);
              }}
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((subj) => (
                <option key={subj.subject_id} value={subj.subject_id}>
                  {subj.name}
                </option>
              ))}
            </select>
            {selectedSubject && subjectDetails.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="p-2 text-left">Roll No</th>
                      <th className="p-2 text-left">Student</th>
                      <th className="p-2 text-left">Month</th>
                      <th className="p-2 text-left">Attended</th>
                      <th className="p-2 text-left">Total</th>
                      <th className="p-2 text-left">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectDetails.map((s, i) => (
                      <tr
                        key={i}
                        className={`border-b ${
                          i % 2 === 0 ? "bg-white" : "bg-blue-50"
                        }`}
                      >
                        <td className="p-2">{s.roll_no}</td>
                        <td className="p-2">{s.student_name}</td>
                        <td className="p-2">
                          {new Date(s.month).toLocaleString("default", {
                            month: "long",
                          })}
                        </td>
                        <td className="p-2">{s.attended_classes}</td>
                        <td className="p-2">{s.total_classes}</td>
                        <td className="p-2 font-semibold">{s.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
