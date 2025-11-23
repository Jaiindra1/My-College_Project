import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import StudentSidebar from "../../components/StudentSidebar";

export default function Results() {
  const navigate = useNavigate();
  const studentData =
    JSON.parse(localStorage.getItem("studentProfile")) ||
    JSON.parse(localStorage.getItem("studentData")) ||
    {};
  const studentId = studentData?.student_id || null;

  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentProfile");
    localStorage.removeItem("studentData");
    navigate("/");
  };

  // ✅ Fetch Results
  useEffect(() => {
    const fetchResults = async () => {
      if (!studentId) {
        console.warn("No student id available - skipping results fetch");
        setResultData({ results: [] });
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/exams/results/${studentId}`);
        setResultData(data);
      } catch (err) {
        if (err.response?.status === 404) {
          console.info("No results found for student:", studentId);
          setResultData({ results: [] });
        } else {
          console.error("❌ Failed to load results:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [studentId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading Results...
      </div>
    );

  const results = resultData?.results || [];

  // Group results by year, then by semester (e.g., { '1': { '1-1': [...], '1-2': [...] } })
  const yearResults = results.reduce((acc, result) => {
    const sem = result.sem || "Unknown";
    // Assuming sem is like "1-1", "1-2", etc. The year is the first part.
    const year = String(sem).split("-")[0];

    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][sem]) {
      acc[year][sem] = [];
    }
    acc[year][sem].push(result);
    return acc;
  }, {});


  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
      {/* ✅ Header (Desktop) */}
      <header className="bg-card-light dark:bg-card-dark border-b sticky top-0 z-10 hidden md:block">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <svg
                className="h-8 w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3L4 9v12h16V9L12 3zm0 2.83L17.17 11H6.83L12 5.83zM6 13h12v6H6v-6z"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold">AcademicsPro</h1>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="/student" className="hover:text-primary">
              Dashboard
            </a>
            <a href="/student/attendance" className="hover:text-primary">
              Attendance
            </a>
            <a href="/student/notifications" className="hover:text-primary">
              Notifications
            </a>
            <a href="/student/placements" className="hover:text-primary">
              Placements
            </a>
            <a
              href="/student/exams"
              className="text-primary font-bold border-b-2 border-primary pb-1"
            >
              Exams
            </a>
            <a href="/student/analytics" className="hover:text-primary">
              Analytics
            </a>
            <a href="/student/helpdesk" className="hover:text-primary">
              HelpDesk
            </a>
            <a href="/student/fee" className="hover:text-primary">
              Fee
            </a>
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

        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark border-b">
          <h1 className="text-lg font-bold text-primary">📊 Results</h1>
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
      {/* ✅ Main Content */}
      <main className="p-8 max-w-7xl mx-auto flex-1 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Exams & Results</h2>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <span className="text-base font-medium text-gray-500 dark:text-gray-400">CGPA</span>
              <p className="text-4xl font-bold text-primary">
                {resultData?.summary?.CGPA
                  ? Number(resultData.summary.CGPA).toFixed(2)
                  : "N/A"}
              </p>
            </div>
            {resultData?.summary?.CGPA > 0 && (
              <div className="text-right">
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                  Equivalent Percentage
                </span>
                <p className="text-4xl font-bold text-primary">
                  {((resultData.summary.CGPA - 0.75) * 10).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8 -mb-px">
            <a
              href="/student/exams"
              className="text-sm font-medium text-gray-500 hover:text-primary"
            >
              Upcoming Exams
            </a>
            <a className="border-b-2 border-primary text-primary text-sm font-medium px-1 py-4">
              Results
            </a>
          </nav>
        </div>
        
      
         {/* ✅ Results Table */}
        {Object.keys(yearResults).length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            No results available 📘
          </div>
        ) : (
          Object.entries(yearResults)
            .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB)) // Sort years numerically
            .map(([year, semesterResults]) => (
              <div key={year} className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {Object.entries(semesterResults)
                    .sort(([semA], [semB]) => semA.localeCompare(semB)) // Sort semesters like "1-1", "1-2"
                    .map(([semester, semResults]) => {
                      // Find the SGPA for the current semester
                      const semesterSummary = resultData?.summary?.SGPA.find(
                        (s) => s.sem === semester
                      );
                      const sgpa = semesterSummary?.sgpa;

                      return (
                        <div
                        key={semester}
                        className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                      >
                        <div className="p-6 flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Semester {semester}
                          </h3>
                          {sgpa !== undefined && (
                            <span className="text-lg font-bold text-primary">
                              SGPA: {Number(sgpa).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                {["Subject", "Credits", "Grade", "Grade Point", "Status"].map(
                                  (col) => (
                                    <th
                                      key={col}
                                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                                    >
                                      {col}
                                    </th>
                                  )
                                )}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {semResults.map((res, i) => (
                                <tr
                                  key={i}
                                  className="hover:bg-primary/5 dark:hover:bg-primary/10 transition"
                                >
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                    {res.subject_name}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
                                    {res.credits}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                    {res.grade}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                    {res.grade_point}
                                  </td>
                                  <td className="px-6 py-4 text-sm">
                                    <span
                                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                        res.grade === "F"
                                          ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                                          : "bg-primary/20 text-primary dark:bg-primary/30"
                                      }`}
                                    >
                                      {res.grade === "F" ? "Fail" : "Pass"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      );
                    })}
                </div>
              </div>
            ))
        )}

      </main>
    </div>
  );
}
