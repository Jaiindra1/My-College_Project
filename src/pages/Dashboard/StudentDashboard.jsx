import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import StudentSidebar from "../../components/StudentSidebar";

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [exams, setExams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentProfile");
    localStorage.removeItem('user');
    navigate("/");
  };

  // ✅ Fetch all dashboard data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("user");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        // Fetch profile first as other calls depend on it
        const { data: profileData } = await api.get('/students/me');
        setProfile(profileData);
        localStorage.setItem("studentProfile", JSON.stringify(profileData));

        // Fetch remaining data in parallel
        const [
          attendanceResponse,
          examsResponse,
          notificationsResponse,
          timetableResponse,
        ] = await Promise.allSettled([
          api.get(`/attendance/student/${profileData.student_id}`),
          api.get(`/exams/semester/${profileData.current_sem_id}`),
          api.get(`/notifications/`),
          api.get(`/timetable/${profileData.current_sem_id}`),
        ]);

        // 🧮 Process Attendance
        if (attendanceResponse.status === 'fulfilled') {
          const { data: attendanceRecords } = attendanceResponse.value;
          const currentMonth = new Date().getMonth() + 1;
          const currentYear = new Date().getFullYear();

          const monthlyRecords = attendanceRecords.filter((rec) => {
            const recordDate = new Date(rec.month);
            return (
              recordDate.getMonth() + 1 === currentMonth &&
              recordDate.getFullYear() === currentYear
            );
          });

          const totalClasses = monthlyRecords.reduce((sum, rec) => sum + (rec.total_classes || 0), 0);
          const attendedClasses = monthlyRecords.reduce((sum, rec) => sum + (rec.attended_classes || 0), 0);
          const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

          setAttendanceSummary({ percentage, totalClasses, attendedClasses });
        } else {
          console.error("❌ Error fetching attendance:", attendanceResponse.reason);
        }

        // 🧾 Process Exams
        if (examsResponse.status === 'fulfilled') {
          const { data: examsData } = examsResponse.value;
          setExams(Array.isArray(examsData) ? examsData : [examsData]);
        } else if (examsResponse.reason.response?.status !== 404) {
          console.error('❌ Error fetching exams for semester:', examsResponse.reason);
        }

        // 🔔 Process Notifications
        if (notificationsResponse.status === 'fulfilled') {
          setNotifications(notificationsResponse.value.data.slice(0, 5));
        } else {
          console.error("❌ Error fetching notifications:", notificationsResponse.reason);
        }

        // 📅 Process Timetable
        if (timetableResponse.status === 'fulfilled') {
          const { data: timetableData } = timetableResponse.value;
          const now = new Date();
          const isEvening = now.getHours() >= 17; // After 5 PM → show next day's timetable
          const displayDate = new Date(now);
          if (isEvening) {
            displayDate.setDate(displayDate.getDate() + 1);
          }
          const targetDay = displayDate.toLocaleString("en-US", { weekday: "long" });
          const todayClasses = timetableData
            .filter((cls) => cls.day?.toLowerCase() === targetDay.toLowerCase())
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
          setTimetable(todayClasses);
        } else {
          console.error("❌ Error fetching timetable:", timetableResponse.reason);
        }

      } catch (err) {
        console.error("❌ Error loading dashboard:", err);
        // Only logout on authentication errors
        if (err.response && err.response.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // 🕒 Convert 24-hour → 12-hour with AM/PM
  const formatTime = (time24) => {
    if (!time24) return "";
    const [hour, minute] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  if (loading) return <p className="p-6 text-center">Loading Dashboard...</p>;

  const isEvening = new Date().getHours() >= 17;

  // avatar URL (profile may provide avatar; fallback to public image)
  const avatarUrl = profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBU79XhrTQTvU5yfPM73BTeFHCNfEOma2YeyQVdQV-EcZ-bSZb5Ep_MG5lKwoDBiz_TK9aeZEp-BWPwSP83NzAmt5E1JtwY-FUqu9kR38Qk3LRCILi3bIQN4_HFwhS17RfU-NWHMCeUYeCVAFn28SKlbHBtOMIy0IgXn8rjItFF-FMI76baM-Nyrw0G0KzZrXSXR0Cl1_MCA6Yz4FAkFoMUNi4Ylsn9PcQD5Y59e03fk-VcOmdIH96zCy5m_23wT7gRmpvk-fIBY-0";

  return (
    <div className="bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark min-h-screen flex flex-col">
      {/* ✅ HEADER */}
      <header className="bg-card-light dark:bg-card-dark border-b sticky top-0 z-10 hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="text-primary size-8">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h1 className="text-xl font-bold">Academics</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-sm font-bold text-primary transition-colors" href="/student">Dashboard</a>
              <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/notifications">Notifications</a>
              <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/attendance">Attendance</a>
              <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/placements">Placements</a>
              <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/exams">Exams & Results</a>
              <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/images">Images</a>
              <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/helpdesk">HelpDesk</a>
              <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/fee">Fee</a>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Logout
              </button>
            </nav>
            <div className="flex items-center gap-4">
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate('/student/profile')}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate('/student/profile'); }}
                className="size-10 rounded-full bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${avatarUrl})` }}
                aria-label="Open profile"
              />
              <button className="md:hidden p-2 rounded-md text-subtle-light dark:text-subtle-dark hover:bg-primary/10">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ SIDEBAR (for Mobile) */}
      <div className="md:hidden">
  {/* ✅ Mobile Sidebar Overlay */}
  {sidebarOpen && (
    <div className="fixed inset-0 z-50 flex">
      {/* Sidebar Drawer */}
      <div className="h-full w-3/4 bg-card-light dark:bg-card-dark shadow-lg transform transition-transform duration-300 ease-in-out">
        <StudentSidebar
          name={profile?.name}
          rollNo={profile?.roll_no}
          onLogout={() => {
            handleLogout();
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Backdrop (click to close) */}
      <div
        className="flex-1 bg-black/50"
        onClick={() => setSidebarOpen(false)}
      />
    </div>
  )}

  {/* ✅ Top Bar */}
  <div className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark border-b">
    <h1 className="text-lg font-bold text-primary">🎓 Student Dashboard</h1>
    <button
      onClick={() => setSidebarOpen(true)}
      className="p-2 rounded-md hover:bg-primary/10 transition-all"
      aria-label="Open Sidebar"
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

      {/* ✅ MAIN DASHBOARD */}
      <main className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PROFILE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm flex gap-6">
            <img
              src="https://play-lh.googleusercontent.com/zrwhcmLkohrOYYR0JfWxYE7WewmfiAWZLCPr-fRrAGWz1KnstEeBAlmbHfTWQr-udg"
              alt="Student"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold">{profile?.name}</h2>
              <p className="text-sm text-gray-500">Roll No: {profile?.roll_no}</p>
              <p className="text-sm">Dept: IT</p>
              <p className="text-sm">Semester: {profile?.current_semester}</p>
            </div>
          </div>

          {/* TIMETABLE */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              <a className="hover:text-primary" href="/student/timetable">
              📅 {isEvening ? "Tomorrow's" : "Today's"} Timetable </a>
            </h3>
            {timetable.length > 0 ? (
              timetable.map((cls, index) => (
                <div
                  key={cls.class_id || `${cls.subject_name}-${index}`}
                  className="p-4 mb-3 bg-primary/10 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{cls.subject_name}</p>
                    <p className="text-sm text-gray-500">{cls.faculty_name}</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No classes scheduled.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - ATTENDANCE & EXAMS */}
        <div className="space-y-6">
          {/* Attendance */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm text-center">
            <h3 className="text-lg font-semibold mb-4">
              📊 Attendance - {new Date().toLocaleString("default", { month: "long" })}
            </h3>
            <div className="relative w-28 h-28 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-gray-700"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                />
                <path
                  className="text-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${attendanceSummary?.percentage || 0}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{attendanceSummary?.percentage || 0}%</span>
                <span className="text-xs text-gray-500 mt-1">
                  {attendanceSummary?.attendedClasses || 0}/{attendanceSummary?.totalClasses || 0} Classes
                </span>
              </div>
            </div>
          </div>

          {/* Exams */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">📚 Upcoming Exams</h3>
            {exams.length > 0 ? (
              exams.map((exam, index) => (
                <div
                  key={exam.exam_id || `${exam.type}-${index}`}
                  className="p-3 mb-2 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{exam.type}</p>
                    <p className="text-sm text-gray-500">Semester {exam.sem}</p>
                  </div>
                  <p className="text-sm">{new Date(exam.date).toDateString()}</p>
                </div>
              ))
            ) : (
              <p>No upcoming exams.</p>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="lg:col-span-3 bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">🔔 Notifications</h3>
          <ul className="space-y-4">
            {notifications.map((n, index) => (
              <li
                key={n.notification_id || `${n.title}-${index}`}
                className="p-3 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-gray-500">{n.message}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(n.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
