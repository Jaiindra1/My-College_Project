import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import StudentSidebar from "../../components/StudentSidebar";

export default function StudentPlacements() {
  const navigate = useNavigate();
  const studentProfile =
    JSON.parse(localStorage.getItem("studentProfile")) ||
    JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentProfile?.student_id || null;

  const [drives, setDrives] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentProfile");
    localStorage.removeItem("studentData");
    navigate("/");
  };

  // ✅ Fetch placement drives
  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const { data } = await api.get("/placements/company");
        setDrives(data);
      } catch (err) {
        console.error("❌ Failed to fetch drives", err);
      }
    };

    const fetchRegistered = async () => {
      try {
        const { data } = await api.get(`/placements/registered/${studentId}`);
        setRegisteredIds(data.map((r) => r.placement_id || r.company_id));
      } catch (err) {
        console.error("❌ Failed to load registered drives", err);
      }
    };

    if (studentId) {
      fetchDrives();
      fetchRegistered();
    }
  }, [studentId]);

  // ✅ Register for drive
  const handleRegister = async (placement_id) => {
    if (!studentId) {
      alert("⚠️ Student ID not found. Please login again.");
      return;
    }

    try {
      const { data } = await api.post(`/placements/register`, {
        student_id: studentId,
        placement_id,
      });
      setRegisteredIds((prev) => [...prev, placement_id]);
      alert(data?.message || "✅ Registered successfully!");
    } catch (err) {
      console.error("❌ Registration error:", err);
      const msg =
        err.response?.data?.error || err.response?.data?.message || "❌ Failed to register";
      alert(msg);
    }
  };

  return (
    <div className="font-display text-neutral-800 dark:text-neutral-200 bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      {/* ✅ Desktop Header */}
      <header className="bg-card-light dark:bg-card-dark border-b sticky top-0 z-10 hidden md:block">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold">CampusConnect</h1>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="/student" className="hover:text-primary">Dashboard</a>
            <a href="/student/attendance" className="hover:text-primary">Attendance</a>
            <a href="/student/notifications" className="hover:text-primary">Notifications</a>
            <a href="/student/placements" className="text-primary font-bold">Placements</a>
            <a href="/student/exams" className="hover:text-primary">Exams</a>
            <a href="/student/analytics" className="hover:text-primary">Analytics</a>
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
            {/* Sidebar Drawer */}
            <div className="h-full w-3/4 bg-card-light dark:bg-card-dark shadow-lg transform transition-transform duration-300 ease-in-out">
              <StudentSidebar
                name={studentProfile?.name}
                rollNo={studentProfile?.roll_no}
                onLogout={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                onLinkClick={() => setSidebarOpen(false)}
              />
            </div>

            {/* Backdrop */}
            <div
              className="flex-1 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark border-b">
          <h1 className="text-lg font-bold text-primary">💼 Placements</h1>
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
      <main className="container mx-auto px-6 py-10 max-w-4xl flex-1 w-full">
        <h2 className="text-4xl font-bold mb-4">Placements</h2>
        <p className="text-lg text-neutral-500 mb-6">
          Explore upcoming placement drives and manage your applications.
        </p>

        <div className="space-y-6">
          {drives.length === 0 ? (
            <p className="text-gray-500">No upcoming drives.</p>
          ) : (
            drives.map((drive) => (
              <div
                key={drive.placement_id || drive.company_id || drive.companyId}
                className="bg-white dark:bg-neutral-800/50 rounded-lg shadow-md hover:shadow-lg transition duration-300 p-6 flex justify-between items-start"
              >
                <div>
                  <p className="text-sm text-neutral-500 mb-1">
                    Drive Date:{" "}
                    {new Date(drive.drive_date).toLocaleDateString()}
                  </p>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {drive.role}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    {drive.company_name}
                  </p>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mt-2">
                    CTC: ₹{drive.ctc} LPA
                  </p>
                </div>

                {registeredIds.includes(
                  drive.placement_id || drive.company_id || drive.companyId
                ) ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                    Registered
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      handleRegister(
                        drive.placement_id ||
                          drive.company_id ||
                          drive.companyId
                      )
                    }
                    className="bg-primary text-black font-bold py-2 px-4 rounded-lg hover:bg-primary/80 transition"
                  >
                    Register
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
