import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function StudentTimetable() {
  const studentProfile = JSON.parse(localStorage.getItem("studentProfile"));
  const semesterId = studentProfile?.current_sem_id || null;
  const [timetable, setTimetable] = useState([]);
  const [viewMode, setViewMode] = useState("today");
  const [loading, setLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const { data } = await api.get(`/timetable/${semesterId}`);
        setTimetable(data);
      } catch (err) {
        console.error("❌ Error loading timetable:", err);
      } finally {
        setLoading(false);
      }
    };
    if (semesterId) fetchTimetable();
  }, [semesterId]);

  const timeSlots = [
    ...new Set(timetable.map((t) => `${t.start_time}-${t.end_time}`)),
  ].sort();

  const getClass = (day, slot) => {
    const [start, end] = slot.split("-");
    return timetable.find(
      (t) => t.day === day && t.start_time === start && t.end_time === end
    );
  };

  const todayName = new Date().toLocaleString("en-US", { weekday: "long" });
  const todaySchedule = timetable.filter((t) => t.day === todayName);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        Loading timetable...
      </div>
    );

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/20 px-10 py-3">
        <div className="flex items-center gap-4 text-gray-800 dark:text-white">
          <div className="h-6 w-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Academics</h2>
        </div>

        <div className="flex flex-1 items-center justify-end gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <a href="/student" className="text-sm font-medium hover:text-primary">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Courses
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Calendar
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Grades
            </a>
          </nav>
          <div
            className="h-10 w-10 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC17E46o6OVOOlsPSEkmsdLXnZpkIcuvi1Hd1h_5EjMtTYfF5ZX6lyC_y3nSFlHSDe4HgZ48wrRliaTqIeizjxeHn622V6q3i1uPmXs1f5P1xkag41oG0Kt7nP0JexWornGvbpnqj8r_viZTmXqwZGPTJnHNoiTb0Xk4LZBLEU9xfZa5IoriuvKPNFKEsxJv8Gax5Hb7fL_4kTbYsLxisuUEZGpFGODgdwbCQy-bFAD13Nc6s3M9I2tFLGeeAv1rATrjDKEe_NC3YY")',
            }}
          ></div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-3 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Timetable
            </h1>
            <div className="flex items-center gap-2 rounded-lg border border-primary/20 p-1">
              <button
                onClick={() => setViewMode("today")}
                className={`rounded px-3 py-1 text-sm font-semibold ${
                  viewMode === "today"
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-primary/10"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setViewMode("weekly")}
                className={`rounded px-3 py-1 text-sm font-semibold ${
                  viewMode === "weekly"
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-primary/10"
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          {/* Weekly View */}
          {viewMode === "weekly" ? (
    <div className="rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark overflow-hidden">
        <div className="flex flex-col w-full overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg">
            <table className="w-full border-collapse table-auto whitespace-normal break-words divide-y divide-primary/20">
                <thead>
                <tr>
                    <th className="w-28 px-2 py-4 text-center text-sm font-semibold">Time</th>
                    {days.map((day) => (
                    <th
                        key={day}
                        className={`px-2 py-4 text-center text-sm font-semibold ${
                        todayName === day ? "text-primary bg-primary/10 dark:bg-primary/20" : ""
                        }`}
                    >
                        {day}
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-primary/20">
                {timeSlots.map((slot) => (
                    <tr
                    key={slot}
                    className="hover:bg-primary/5 dark:hover:bg-primary/10 transition"
                    >
                    <td className="whitespace-nowrap px-2 py-6 text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
                        {slot.replace("-", " - ")}
                    </td>
                    {days.map((day) => {
                        const entry = getClass(day, slot);
                        return (
                        <td
                            key={`${day}-${slot}`}
                            className={`whitespace-normal break-words px-2 py-6 text-sm text-center ${
                            todayName === day ? "bg-primary/10 dark:bg-primary/20" : ""
                            }`}
                        >
                            {entry ? (
                            <div className="rounded-lg bg-primary/20 dark:bg-primary/30 p-3 font-semibold text-gray-800 dark:text-gray-100 shadow-sm">
                                <div>{entry.subject_name}</div>
                                <div className="text-xs font-light text-gray-600 dark:text-gray-300">
                                {entry.faculty_name} • {entry.classroom}
                                </div>
                            </div>
                            ) : (
                            <span className="text-gray-400">—</span>
                            )}
                        </td>
                        );
                    })}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    </div>
            ) : (
            // ✅ Today View
            <div className="rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark p-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                {todayName}'s Schedule
              </h2>
              {todaySchedule.length > 0 ? (
                <ul className="space-y-3">
                  {todaySchedule.map((cls) => (
                    <li
                      key={cls.timetable_id}
                      className="border border-primary/10 rounded-lg p-5 bg-primary/5 dark:bg-primary/20 hover:shadow-lg transition"
                    >
                      <div className="text-lg font-bold">{cls.subject_name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {cls.start_time} - {cls.end_time} • {cls.classroom}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-200 mt-1">
                        {cls.faculty_name}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No classes today 🎉</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
