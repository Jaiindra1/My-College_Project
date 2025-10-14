import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function StudentPlacements() {
  const studentProfile = JSON.parse(localStorage.getItem("studentProfile"));
  const studentId = studentProfile?.student_id || null;

  const [drives, setDrives] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);

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
        // registration rows may contain placement_id or company_id depending on server response
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

  const handleRegister = async (placement_id) => {
    if (!studentId) {
      alert('⚠️ Student ID not found. Please make sure you are logged in.');
      return;
    }

    try {
      const { data } = await api.post(`/placements/register`, { student_id: studentId, placement_id });
      setRegisteredIds((prev) => [...prev, placement_id]);
      alert(data?.message || "✅ Registered successfully!");
    } catch (err) {
      console.error('❌ Registration error:', err);
      const serverMsg = err.response?.data?.error || err.response?.data?.message;
      alert(serverMsg || "❌ Failed to register");
    }
  };

  return (
    <div className="font-display text-neutral-800 dark:text-neutral-200 bg-background-light dark:bg-background-dark min-h-screen">
      <header className="sticky top-0 z-10 bg-background-light dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">CampusConnect</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-4xl">
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
                    Drive Date: {new Date(drive.drive_date).toLocaleDateString()}
                  </p>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {drive.role}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">{drive.company_name}</p>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mt-2">
                    CTC: ₹{drive.ctc} LPA
                  </p>
                </div>

                {registeredIds.includes(drive.placement_id || drive.company_id || drive.companyId) ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                    Registered
                  </span>
                ) : (
                  <button
                    onClick={() => handleRegister(drive.placement_id || drive.company_id || drive.companyId)}
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
