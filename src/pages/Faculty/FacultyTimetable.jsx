import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import FacultySidebar from "../../components/FacultySidebar";

export default function FacultyTimetable() {
  const facultyId = JSON.parse(localStorage.getItem("user")).user_id;
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch timetable data
  const fetchTimetable = async () => {
    try {
      const { data } = await api.get(`/timetable/${facultyId}/timetable`);
      if (Array.isArray(data)) setTimetable(data);
      else if (data) setTimetable([data]);
      else setTimetable([]);
    } catch (err) {
      console.error("❌ Failed to fetch timetable:", err);
      alert("Failed to load timetable data");
    } finally {
      setLoading(false);
    }
  };
  console.log("✅ Fetched timetable:", timetable);

  useEffect(() => {
    fetchTimetable();
  }, []);

  // Dynamically extract days and time slots
  // Helper: normalize day capitalization
  const capitalize = (s) =>
    String(s || "").trim().replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());

  // Helper: parse time slot start (e.g. "01:10 PM-02:00 PM") -> minutes since midnight
  const parseStartMinutes = (slot) => {
    if (!slot) return Number.MAX_SAFE_INTEGER;
    const m = slot.match(/^(\d{1,2}:\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)$/i);
    if (!m) return Number.MAX_SAFE_INTEGER;
    const [, startTime, startAmPm] = m;
    const [hh, mm] = startTime.split(":").map(Number);
    let hour = hh % 12;
    if (String(startAmPm).toUpperCase() === "PM") hour += 12;
    return hour * 60 + mm;
  };

  // Normalize timetable entries (safe day capitalization and trimmed slot)
  const normalizedTimetable = timetable.map((t) => ({
    ...t,
    day: capitalize(t.day),
    time_slot: String(t.time_slot || "").trim(),
  }));

  const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const days = WEEK_DAYS.filter((d) => normalizedTimetable.some((t) => t.day === d));

  // Unique time slots sorted by their start time
  const timeSlots = Array.from(new Set(normalizedTimetable.map((t) => t.time_slot))).sort(
    (a, b) => parseStartMinutes(a) - parseStartMinutes(b)
  );

  const getSession = (day, slot) =>
    normalizedTimetable.find((t) => t.day === day && t.time_slot === slot);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-slate-600 dark:text-slate-400">
        Loading timetable...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Sidebar */}
      <FacultySidebar />

      {/* Main Section */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Weekly Timetable
            </h2>
            <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition">
              <span className="material-symbols-outlined text-base">picture_as_pdf</span>
              Export PDF
            </button>
          </div>

          {/* Timetable Table */}
          <div className="overflow-x-auto rounded-lg border border-green-100 bg-white dark:bg-background-dark shadow-sm">
            <table className="min-w-full border-collapse">
              <thead className="bg-green-50 border-b border-green-100">
                <tr>
                  <th className="w-40 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    Time Slot
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="px-4 py-3 text-center text-sm font-semibold text-slate-700"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot} className="border-b border-green-100">
                    <td className="px-4 py-3 text-sm font-medium text-slate-500">
                      {slot}
                    </td>
                    {days.map((day) => {
                      const session = getSession(day, slot);
                      return (
                        <td key={`${day}-${slot}`} className="px-3 py-3 text-center align-top">
                          {session ? (
                            <div className="bg-green-50 border border-green-200 rounded-md p-2.5 text-center">
                              <p className="font-semibold text-green-700 text-sm">
                                {session.subject_name}
                              </p>
                              <p className="text-xs text-green-600 mt-1">
                                {session.classroom}
                              </p>
                            </div>
                          ) : (
                            <span className="text-slate-300 text-sm">—</span>
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
      </main>
    </div>
  );
}
