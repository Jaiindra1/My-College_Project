import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import StudentSidebar from "../../components/StudentSidebar";

// ✅ Default fallback data
const initialData = {
  marksTrend: {
    percentage: 85,
    change: 5,
    history: [109, 21, 41, 93, 33, 101, 61, 45, 121, 149, 1, 81, 129, 25],
  },
  attendanceVsGrades: {
    averageGrade: 92,
    change: 2,
    subjects: [
      { name: "Math", grade: 90 },
      { name: "Science", grade: 88 },
      { name: "History", grade: 84 },
      { name: "English", grade: 95 },
      { name: "Art", grade: 93 },
    ],
  },
};

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const studentData =
    JSON.parse(localStorage.getItem("studentProfile")) ||
    JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentData?.student_id;

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentProfile");
    localStorage.removeItem("studentData");
    navigate("/");
  };

  // ✅ Fetch Analytics Data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!studentId) {
        console.warn("No student ID found, skipping analytics fetch.");
        setLoading(false);
        return;
      }

      try {
        const { data: apiData } = await api.get(`/analytics/${studentId}`);
        setData({
          marksTrend: apiData?.marksTrend || initialData.marksTrend,
          attendanceVsGrades:
            apiData?.attendanceVsGrades || initialData.attendanceVsGrades,
        });
      } catch (error) {
        console.error("❌ Failed to fetch analytics data:", error);
        setData(initialData);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [studentId]);

  // ✅ Prepare SVG chart safely with dynamic semesters and scaling
  // Prefer server-provided SGPA history, fall back to generic history
  const rawMarks = Array.isArray(data?.marksTrend?.sgpaHistory)
    ? data.marksTrend.sgpaHistory
    : Array.isArray(data?.marksTrend?.history)
    ? data.marksTrend.history
    : [];

  // Convert raw SGPA values to percentage (SGPA is on 0-10 scale)
  const marksHistory = rawMarks.map((v) => {
    const n = Number(v) || 0;
    if (n <= 10) return Math.min(100, n * 10); // SGPA -> percent
    if (n > 10 && n <= 100) return Math.min(100, n); // already percent
    return Math.min(100, n);
  });

  // Semester labels can come from server (marksTrend.sems) or be generated
  const semLabels = Array.isArray(data?.marksTrend?.sems)
    ? data.marksTrend.sems
    : marksHistory.map((_, i) => `Sem ${i + 1}`);

  // Compute a dynamic scale so chart fits regardless of max value
  const maxVal = Math.max(100, ...(marksHistory.length ? marksHistory : [100]));
  const svgWidth = 472;
  const svgHeight = 150;
  const topPadding = 10;
  const bottomPadding = 10;
  const plotHeight = svgHeight - topPadding - bottomPadding;

  // Tooltip state
  const chartRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "", index: -1 });

  // Prepare points (x,y) and keep SGPA/raw values for tooltip
  const points = marksHistory.map((point, index, arr) => {
    const x = (index / ((arr.length - 1) || 1)) * svgWidth;
    const scaled = (Number(point) / maxVal) * plotHeight;
    const y = topPadding + (plotHeight - scaled);
    const raw = Number(rawMarks[index]);
    const sgpa = raw && raw <= 10 ? raw : raw > 10 ? Number((raw / 10).toFixed(2)) : Number((point / 10).toFixed(2));
    return { x, y, percent: Number(point), sgpa };
  });

  const marksPath = marksHistory
    .map((point, index, arr) => {
      const x = (index / ((arr.length - 1) || 1)) * svgWidth;
      const scaled = (Number(point) / maxVal) * plotHeight;
      const y = topPadding + (plotHeight - scaled);
      return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .join(' ');

  const marksFillPath = marksHistory.length ? `${marksPath} V${svgHeight - bottomPadding} H0 Z` : '';

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading Analytics...
      </div>
    );

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
      {/* ✅ Desktop Header */}
      <header className="bg-card-light dark:bg-card-dark border-b sticky top-0 z-10 hidden md:block">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold">Academics Analytics</h1>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="/student" className="hover:text-primary">Dashboard</a>
            <a href="/student/attendance" className="hover:text-primary">Attendance</a>
            <a href="/student/notifications" className="hover:text-primary">Notifications</a>
            <a href="/student/placements" className="hover:text-primary">Placements</a>
            <a href="/student/exams" className="hover:text-primary">Exams</a>
            <a
              href="/student/analytics"
              className="text-primary font-bold border-b-2 border-primary pb-1"
            >
              Analytics
            </a>
            <a href="/student/helpdesk" className="hover:text-primary">HelpDesk</a>
            <a href="/student/fee" className="hover:text-primary">Fee</a>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-500 font-medium"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* ✅ Mobile Sidebar */}
      <div className="md:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="h-full w-3/4 bg-card-light dark:bg-card-dark shadow-lg transition-transform duration-300 ease-in-out">
              <StudentSidebar
                name={studentData?.name}
                rollNo={studentData?.roll_no}
                onLogout={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                onLinkClick={() => setSidebarOpen(false)}
              />
            </div>
            <div
              className="flex-1 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark border-b">
          <h1 className="text-lg font-bold text-primary">📊 Analytics</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-primary/10 transition-all"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6h16M4 12h16m-7 6h7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* ✅ Main Analytics Section */}
      <main className="flex flex-1 justify-center py-8 px-4">
        <div className="layout-content-container flex flex-col w-full max-w-6xl">
          <div className="flex flex-wrap justify-between gap-4 p-4">
            <h1 className="text-4xl font-bold tracking-tight">Analytics</h1>
          </div>

          {/* ANALYTICS CARDS */}
          <div className="grid grid-cols-1 gap-8 p-4 lg:max-w-4xl mx-auto w-full">
            {/* 📈 MARKS TREND */}
            <div className="flex flex-col gap-6 bg-background-light dark:bg-background-dark border border-primary/20 dark:border-primary/30 rounded-lg p-6">
              <div className="flex flex-col gap-1">
                <p className="text-base font-medium">Marks Trend</p>
                <p className="text-4xl font-bold">{typeof data.marksTrend.percentage === 'number' ? data.marksTrend.percentage : Math.round(marksHistory[marksHistory.length-1] || 0)}%</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Last {semLabels.length} Semesters
                  </p>
                  <p className="text-sm font-medium text-primary">
                    +{data.marksTrend.change}%
                  </p>
                </div>
              </div>

              <div className="flex-1 relative">
                <svg
                    ref={chartRef}
                    fill="none"
                    height="100%"
                    preserveAspectRatio="none"
                    viewBox="0 0 472 150"
                    width="100%"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={marksFillPath} fill="url(#paint0_linear_marks)" />
                    <path
                      className="text-primary"
                      d={marksPath}
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                    {/* interactive points for tooltip */}
                    {points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={6}
                        fill="transparent"
                        stroke="transparent"
                        onMouseEnter={(e) => {
                          const rect = chartRef.current?.getBoundingClientRect();
                          if (!rect) return;
                          setTooltip({
                            visible: true,
                            x: e.clientX - rect.left + 8,
                            y: e.clientY - rect.top - 30,
                            text: `${semLabels[i] || `Sem ${i + 1}`} — SGPA: ${p.sgpa}`,
                            index: i,
                          });
                        }}
                        onMouseMove={(e) => {
                          const rect = chartRef.current?.getBoundingClientRect();
                          if (!rect) return;
                          setTooltip((t) => ({ ...t, x: e.clientX - rect.left + 8, y: e.clientY - rect.top - 30 }));
                        }}
                        onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, text: "", index: -1 })}
                      />
                    ))}
                  <defs>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      id="paint0_linear_marks"
                      x1="236"
                      x2="236"
                      y1="1"
                      y2="149"
                    >
                      <stop className="text-primary/20" stopColor="currentColor" />
                      <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Tooltip overlay (absolute within svg container) */}
                {tooltip.visible && (
                  <div
                    className="pointer-events-none absolute z-50 bg-white dark:bg-[#0b1220] text-sm text-gray-900 dark:text-gray-100 px-3 py-2 rounded shadow-lg border border-black/5 dark:border-white/10"
                    style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
                  >
                    {tooltip.text}
                  </div>
                )}
              </div>

              <div className="flex justify-around border-t border-primary/20 dark:border-primary/30 pt-4 flex-wrap">
                {semLabels.map((sem, idx) => (
                  <p key={idx} className="text-xs font-bold tracking-wider mx-2">
                    {sem}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
