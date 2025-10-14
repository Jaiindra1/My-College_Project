import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function FacultyReports() {
  const safeGetUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const facultyId = safeGetUser()?.user_id;

  const [report, setReport] = useState({
    performance: [],
    attendance: 0,
    kpis: { topSubject: {}, lowAttendance: {} },
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get(`/faculty/${facultyId}/summary`);
        setReport(data);
      } catch (err) {
        console.error("❌ Failed to load report:", err);
      }
    };
    fetchReports();
  }, [facultyId]);

  return (
    <div className="flex flex-col min-h-screen font-display bg-background-light dark:bg-background-dark">
      {/* HEADER */}
      <header className="bg-background-light dark:bg-background-dark border-b border-primary/20 dark:border-primary/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-4 text-slate-800 dark:text-white">
              <div className="w-8 h-8 text-primary">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 3L2 12H5V20H19V12H22L12 3ZM17 18H7V13H17V18ZM10 10.5V8H14V10.5H10Z"></path>
                </svg>
              </div>
              <h1 className="text-xl font-bold">AcademicsPro</h1>
            </div>

            {/* NAVIGATION */}
            <nav className="hidden md:flex items-center gap-6">
              {["Dashboard", "Courses", "Students", "Reports", "Settings"].map(
                (nav) => (
                  <a
                    key={nav}
                    href="#"
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                  >
                    {nav}
                  </a>
                )
              )}
            </nav>

            {/* PROFILE */}
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuALbrMHe4JteNdPd15Ua9Bg8HAOqOWy4GHN3rOX3p6d9A2k1HWYU073BzGgV28LdXY9_ugI_g6T6JU6YckEgNkIaooO5diThREYIqYxsoqT3k6ulXiZHxl3-wC6uV72w-am2pD9zBxUnlSQSjq9GpxUB6bM4ST1mAhT1gK7TL61gWOYPWIlzCCYxwtupruPlOZi8eyBSOPvZ48TWiLAQUr3ukS123JUoZdGOWmYt1GZ0sRnFCVBX2FklABH6Mvy8uWQT9L6YRXCdqQ')",
                }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* HEADER SECTION */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Faculty Reports Dashboard
            </h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Analyze student performance and attendance across semesters and subjects.
            </p>
          </div>

          {/* FILTERS */}
          <div className="bg-white/50 dark:bg-black/10 p-6 rounded-xl border border-primary/20 dark:border-primary/30">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="w-full rounded-lg border-primary/20 dark:border-primary/30 bg-background-light dark:bg-background-dark text-slate-900 dark:text-white focus:ring-primary focus:border-primary form-select">
                <option>Select Semester</option>
                <option>Fall 2023</option>
                <option>Spring 2024</option>
              </select>
              <select className="w-full rounded-lg border-primary/20 dark:border-primary/30 bg-background-light dark:bg-background-dark text-slate-900 dark:text-white focus:ring-primary focus:border-primary form-select">
                <option>Select Subject</option>
                {report.performance.map((s, i) => (
                  <option key={i}>{s.subject_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* PERFORMANCE & ATTENDANCE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student Performance */}
            <div className="bg-white/50 dark:bg-black/10 p-6 rounded-xl border border-primary/20 dark:border-primary/30">
              <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                Student Performance by Subject
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Average:{" "}
                {report.performance.length
                  ? `${(
                      report.performance.reduce(
                        (a, b) => a + (b.avg_grade_point || 0),
                        0
                      ) / report.performance.length
                    ).toFixed(1)}`
                  : "N/A"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Last Semester
                </p>
                <p className="text-sm font-medium text-green-600 dark:text-green-500">
                  +5%
                </p>
              </div>

              {/* Performance Bars */}
              <div className="mt-6 grid grid-cols-4 gap-4 items-end h-40">
                {report.performance.map((p, i) => {
                  const heightPct = Math.min(
                    100,
                    ((p.avg_grade_point || 0) / 10) * 100
                  );
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-primary/20 dark:bg-primary/40 rounded-lg"
                        style={{ height: `${heightPct}%` }}
                      ></div>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {p.subject_name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-white/50 dark:bg-black/10 p-6 rounded-xl border border-primary/20 dark:border-primary/30">
              <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                Attendance Trends
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Average: {report.attendance || 0}%
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Last 12 Months
                </p>
                <p className="text-sm font-medium text-red-600 dark:text-red-500">
                  -2%
                </p>
              </div>

              {/* Attendance Graph */}
              <div className="mt-6 h-48">
                <svg
                  fill="none"
                  height="100%"
                  preserveAspectRatio="none"
                  viewBox="0 0 472 150"
                  width="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z"
                    fill="url(#paint0_linear)"
                  ></path>
                  <path
                    d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                    stroke="#1173d4"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></path>
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="236"
                      x2="236"
                      y1="1"
                      y2="149"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#1173d4" stopOpacity="0.2" />
                      <stop offset="1" stopColor="#1173d4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div>
            <h3 className="text-xl font-bold mb-4">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Performing Class */}
              <div className="bg-white/50 dark:bg-black/10 rounded-xl overflow-hidden border border-primary/20 dark:border-primary/30 flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <p className="font-bold">Top Performing Class</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {report.kpis.topSubject?.subject_name
                      ? `${report.kpis.topSubject.subject_name} — Avg ${report.kpis.topSubject.avg_score}`
                      : "Class A achieved the highest average score this semester."}
                  </p>
                </div>
                <div
                  className="flex-1 bg-cover bg-center min-h-[150px]"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2kOKPa3i-9U5uJ-IOOzvLBEj1N4vjOEt5ezR7u0WxRxDpGAJbZrz0Z0e9cDOMaDJL5nB4ByduNR7AgTyTLxUffIH_wGo82cQvC-T3l2AKMaULGRFUQQA7KA09rYZ7rliXir2E2rK8pJtJ9DNx1CqzKYYrQLS615bBGgw50g0jeizGdjoNDXWHoTQhCaDi9A8sxlLCO5r2LNlwNkbJYCsYzChqvkIGJAsYkXl-63hik4tYBaNqTqniDYLGgU8o6f8U5mzwJ7JWFAo')",
                  }}
                ></div>
              </div>

              {/* Lowest Attendance */}
              <div className="bg-white/50 dark:bg-black/10 rounded-xl overflow-hidden border border-primary/20 dark:border-primary/30 flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <p className="font-bold">Lowest Attendance</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {report.kpis.lowAttendance?.subject_name
                      ? `${report.kpis.lowAttendance.subject_name} — ${report.kpis.lowAttendance.rate}%`
                      : "Class C had the lowest attendance rate this semester."}
                  </p>
                </div>
                <div
                  className="flex-1 bg-cover bg-center min-h-[150px]"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAkrzmagvKsR2-zmdreM8Uk8StzsqV85EthY1Ke-M5PmDVcDPrRnfg-TMdCSIXCo3PuVpxhHp27YQIbashxGAjbL0ffZqBa1FTZ1qRN89QoIg0KWEYtF57eOPJ6Zr-yAz1DIbIeYR6u2UMiw0iNaaC8osmcJDWadpQhwQ9T5970zKL4tVMK8eun0QHjn2PimhIVnRUvCaTzEstbhmLl9cX1ZPjcTrEON-CSEYJqIfdFq5yEnxiGvULAQkoNXJHwbH4p1GmZ2Bh4kt4')",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* EXPORT OPTIONS */}
          <div>
            <h3 className="text-xl font-bold mb-4">Reports</h3>
            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined">picture_as_pdf</span>
                Export as PDF
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/20 dark:bg-primary/30 text-primary font-semibold hover:bg-primary/30 transition-colors">
                <span className="material-symbols-outlined">description</span>
                Export as Excel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
