import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function Results() {
  const studentData = JSON.parse(localStorage.getItem("studentProfile")) || {};
  const studentId = studentData?.student_id || null;
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchResults = async () => {
      if (!studentId) {
        console.warn('No student id available - skipping results fetch');
        setResultData({ results: [] });
        setLoading(false);
        return;
      }
      try {
        // server exposes this route under /exams (mounted as /api/exams on the server)
        const { data } = await api.get(`/exams/results/${studentId}`);
        setResultData(data);
        
      } catch (err) {
        // Handle 404 (no results) gracefully
        if (err.response && err.response.status === 404) {
          console.info('No results found for student:', studentId);
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
console.log("✅ Loaded results:", resultData);
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
      <header className="flex items-center justify-between border-b border-primary/20 px-8 py-4 dark:border-primary/30">
        <div className="flex items-center gap-3 text-gray-800 dark:text-white">
          <div className="text-primary">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L4 9v12h16V9L12 3zm0 2.83L17.17 11H6.83L12 5.83zM6 13h12v6H6v-6z"></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold">AcademicsPro</h1>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Exams & Results</h2>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8 -mb-px">
            <a
              href="/student/upcoming-exams"
              className="text-sm font-medium text-gray-500 hover:text-primary"
            >
              Upcoming Exams
            </a>
            <a className="border-b-2 border-primary text-primary text-sm font-medium px-1 py-4">
              Results
            </a>
          </nav>
        </div>

        {/* Results Table */}
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold">
              Semester {resultData?.semester} Results
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {["Subject", "Marks", "Grade", "Status"].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((res, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {res.subject_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {res.grade}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {res.grade_point}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/30">
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Semester Summary</h3>
            <p className="text-sm text-gray-500">CGPA</p>
            <p className="text-2xl font-bold text-primary">{resultData?.summary?.CGPA || "N/A"}</p>
            <p className="mt-3 text-sm text-gray-500">SGPA</p>
            <p className="text-2xl font-bold text-primary">{resultData?.SGPA || "N/A"}</p>
            <button className="mt-6 w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-primary/90">
              Download Report
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
