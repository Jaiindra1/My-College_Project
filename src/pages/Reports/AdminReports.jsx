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
  const [displayData, setDisplayData] = useState([]);

  // ✅ Fetch Reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        // Parallel API requests
        const [attRes, backlogRes, examRes] = await Promise.all([
          api.get("/reports/attendance/summary", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/reports/backlog-analysis", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/reports/exam-performance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAttendanceSummary(attRes.data?.data || []);
        setBacklogSummary(backlogRes.data?.data || backlogRes.data || []);
        setExamPerformance(examRes.data?.data || []);

        // Fetch Subjects
        const subjRes = await api.get("/subjects/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjects(subjRes.data?.subjects || subjRes.data || []);
      } catch (err) {
        console.error("❌ Error loading reports:", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  // ✅ Fetch Subject-wise Attendance
  const fetchSubjectAttendance = async (subjectId) => {
    try {
      const res = await api.get(`/reports/attendance/subject/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjectDetails(res.data || []);
      console.log(res.data);
    } catch (err) {
      console.error(
        "❌ Error fetching subject-wise attendance:",
        err.response || err.message
      );
    }
  };

  if (loading)
    return <div className="text-center mt-12 text-xl">Loading Reports...</div>;

  // ✅ Chart Data
  const attendanceChartData = {
    labels: attendanceSummary.map((r) =>
      new Date(r.month).toLocaleString("default", { month: "long" })
    ),
    datasets: [
      {
        label: "Avg Attendance %",
        data: attendanceSummary.map((r) => r.average),
        backgroundColor: "#2563eb",
        borderRadius: 6,
        barPercentage: 0.2,
        categoryPercentage: 0.4,
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
    labels: examPerformance.map((r) => `${r.semester} Sem`),
    datasets: [
      {
        label: "Pass %",
        data: examPerformance.map((r) => r.pass_percentage),
        backgroundColor: "#10b981",
        borderRadius: 6,
        barPercentage: 0.4,
        categoryPercentage: 0.6,
      },
      {
        label: "Avg Marks",
        data: examPerformance.map((r) => r.avg_marks),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.trim().toUpperCase(); 
    
    if (searchValue && subjectDetails.length > 0) {
        const filteredResults = subjectDetails.filter(s => 
            // Check if roll_no contains the search value (partial match)
            s.roll_no.toUpperCase().includes(searchValue) 
        );
        // Update the state for rendering
        setDisplayData(filteredResults);
        
    } else {
        // If search is empty or no original data, show the original list
        setDisplayData(subjectDetails);
    }
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Summary */}
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
            {examPerformance.length > 0 ? (
              <Bar data={examChartData} options={{ responsive: true }} />
            ) : (
              <p>No exam performance data available.</p>
            )}
          </section>

          {/* Backlog Analysis */}
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              Backlog Analysis
            </h2>
            {backlogSummary.length > 0 ? (
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
            ) : (
              <p>No backlog data available.</p>
            )}
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
                const v = e.target.value;
                setSelectedSubject(v);
                fetchSubjectAttendance(v);
              }}
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((subj) => (
                <option key={subj.subject_id} value={subj.subject_id}>
                  {subj.name}
                </option>
              ))}
            </select>

              <input 
                type="text" 
                placeholder='Enter Roll Number' 
                disabled={subjectDetails.length === 0}
                onChange={handleSearch} 
            />  

            {loading && <p className="text-sm text-gray-500">Loading...</p>}

            {selectedSubject && !loading && subjectDetails.length === 0 && (
              <p className="text-sm text-gray-500">
                No attendance records found for this subject.
              </p>
            )}

           {selectedSubject && (
                <div className="overflow-x-auto mt-4 border border-gray-200 rounded-lg">
                    {displayData.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 bg-gray-50 rounded-tl-lg">Roll No</th>
                                    <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 bg-gray-50">Student</th>
                                    <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 bg-gray-50">Month</th>
                                    <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 bg-gray-50">Attended</th>
                                    <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 bg-gray-50">Total</th>
                                    <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 bg-gray-50 rounded-tr-lg">Att. (%)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {displayData.map((s, i) => ( 
                                    <tr 
                                        key={`${s.roll_no}-${s.month}-${i}`}
                                        className={`hover:bg-blue-50 transition duration-150`}
                                    >
                                        <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900">{s.roll_no}</td>
                                        <td className="p-3 whitespace-nowrap text-sm text-gray-600">{s.student_name}</td>
                                        <td className="p-3 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(s.month).toLocaleString('default', {
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="p-3 whitespace-nowrap text-sm text-center">{s.attended_classes}</td>
                                        <td className="p-3 whitespace-nowrap text-sm text-center">{s.total_classes}</td>
                                        <td className="p-3 whitespace-nowrap text-sm font-bold text-center">
                                            <span className={Number(s.attendance_percentage) < 75 ? 'text-red-600' : 'text-green-600'}>
                                                {Number(s.attendance_percentage).toFixed(2)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-4 text-center text-gray-500">
                            {subjectDetails.length === 0 ? "No attendance records found for this subject." : "No matching records found for the roll number."}
                        </p>
                    )}
                </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
