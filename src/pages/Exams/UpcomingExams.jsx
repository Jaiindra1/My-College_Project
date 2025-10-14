import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function UpcomingExams() {
  const studentData = JSON.parse(localStorage.getItem("attendanceRecords"));
  const studentId = studentData?.userId;
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await api.get(`/exams/upcoming/${studentId}`);
        const today = new Date();

        // ✅ Filter future or current month exams only
        const filtered = data.filter((exam) => {
          const examDate = new Date(exam.exam_date);
          return examDate >= new Date(today.getFullYear(), today.getMonth(), 1);
        });

        // ✅ Sort by date
        filtered.sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));

        // ✅ Group by Month-Year (e.g. "October 2025")
        const grouped = filtered.reduce((acc, exam) => {
          const date = new Date(exam.exam_date);
          const monthKey = date.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          });
          if (!acc[monthKey]) acc[monthKey] = [];
          acc[monthKey].push(exam);
          return acc;
        }, {});

        setExams(grouped);
      } catch (err) {
        console.error("❌ Failed to load upcoming exams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [studentId]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
      <header className="flex items-center justify-between border-b border-primary/20 px-10 py-4 dark:border-primary/30">
        <div className="flex items-center gap-3 text-gray-800 dark:text-white">
          <div className="h-8 w-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Academics Hub</h1>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Exams & Results
          </h2>

          <div className="border-b border-primary/20 mb-8">
            <nav className="-mb-px flex space-x-8">
              <a className="border-b-2 border-primary text-primary px-1 py-4 text-sm font-medium" href="#">
                Upcoming Exams
              </a>
              <a
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-1 py-4 text-sm font-medium"
                href="/student/results"
              >
                Results
              </a>
            </nav>
          </div>

          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading exams...</div>
          ) : Object.keys(exams).length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No upcoming exams 🎉
            </div>
          ) : (
            Object.entries(exams).map(([month, monthExams]) => (
              <div key={month} className="mb-10">
                <h3 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">calendar_month</span>
                  {month}
                </h3>
                <div className="overflow-hidden rounded-lg border border-primary/20 bg-white dark:bg-gray-800 shadow">
                  <table className="w-full divide-y divide-primary/20 dark:divide-primary/30 table-auto">
                    <thead className="bg-gray-50 dark:bg-primary/10">
                      <tr>
                        {["Exam", "Date", "Time", "Subject"].map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/20 bg-white dark:divide-primary/30 dark:bg-background-dark">
                      {monthExams.map((exam, index) => (
                        <tr
                          key={index}
                          className="hover:bg-primary/5 dark:hover:bg-primary/10 transition"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {exam.exam_type}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {new Date(exam.exam_date).toLocaleDateString("en-US", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {exam.exam_time}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {exam.subject_name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}