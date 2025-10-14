import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

// ✅ Default fallback data (ensures UI never breaks)
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
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: apiData } = await api.get("/analytics");

        // ✅ Safe merging to avoid undefined structure
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
  }, []);

  // ✅ Defensive check for undefined data
  const marksHistory = data?.marksTrend?.history || [];

  // ✅ Generate SVG graph path safely
  const marksPath = marksHistory
    .map((point, index, arr) => {
      const x = (index / ((arr.length - 1) || 1)) * 472;
      const y = 150 - point;
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");

  const marksFillPath = marksHistory.length ? `${marksPath} V150 H0 Z` : "";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading Analytics...
      </div>
    );
  }

  if (!data?.marksTrend || !data?.attendanceVsGrades) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        No analytics data available.
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/20 dark:border-primary/30 px-10 py-3">
          <div className="flex items-center gap-4">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold">Academics</h2>
          </div>

          <div className="flex flex-1 justify-end gap-8">
            <nav className="flex items-center gap-6">
              <a className="text-sm font-medium hover:text-primary" href="/student">
                Dashboard
              </a>
              <a className="text-sm font-medium hover:text-primary" href="/student/courses">
                Courses
              </a>
              <a className="text-sm font-medium hover:text-primary" href="/student/calendar">
                Calendar
              </a>
              <a className="text-sm font-medium hover:text-primary" href="/student/messages">
                Messages
              </a>
              <a className="text-sm font-medium hover:text-primary" href="/student/profile">
                Settings
              </a>
            </nav>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCO6tguW71ynmmq-2_iWOHZt41mUn-FDamQegnwiR3K8NW14gAn6SIlgKA6cCzqwpfD9V_qTJFM2dCiBKT5iL8yXqOKUvjD2dbF6wI0egVLJFPseeAByNTC4ICrwE6M1SisyIf3QNHpdQzgFmQsaA4Fzb9_0iZ65l_zf-BtGRIN5FdCHbu7F7s0lhsBBuO-kSBgmf_RvCSEt9B_8OVDWRThlT5gUXM9pYtZF5IxHew8Mn-xvlyHGd0LdqQ7jBC13kcQMmjZ9U9ZfHs")',
              }}
            ></div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex flex-1 justify-center py-8 px-4">
          <div className="layout-content-container flex flex-col w-full max-w-6xl">
            <div className="flex flex-wrap justify-between gap-4 p-4">
              <h1 className="text-4xl font-bold tracking-tight">Analytics</h1>
            </div>

            {/* ANALYTICS CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
              {/* 📈 MARKS TREND */}
              <div className="flex flex-col gap-6 bg-background-light dark:bg-background-dark border border-primary/20 dark:border-primary/30 rounded-lg p-6">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium">Marks Trend</p>
                  <p className="text-4xl font-bold">{data.marksTrend.percentage}%</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-black/60 dark:text-white/60">
                      Last 6 Semesters
                    </p>
                    <p className="text-sm font-medium text-primary">
                      +{data.marksTrend.change}%
                    </p>
                  </div>
                </div>

                {/* SVG GRAPH */}
                <div className="flex-1">
                  <svg
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
                    <defs>
                      <linearGradient
                        gradientUnits="userSpaceOnUse"
                        id="paint0_linear_marks"
                        x1="236"
                        x2="236"
                        y1="1"
                        y2="149"
                      >
                        <stop
                          className="text-primary/20 dark:text-primary/30"
                          stopColor="currentColor"
                        />
                        <stop
                          className="text-primary/0"
                          offset="1"
                          stopColor="currentColor"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="flex justify-around border-t border-primary/20 dark:border-primary/30 pt-4">
                  {["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"].map((sem) => (
                    <p key={sem} className="text-xs font-bold tracking-wider">
                      {sem}
                    </p>
                  ))}
                </div>
              </div>

              {/* 📊 ATTENDANCE VS GRADES */}
              <div className="flex flex-col gap-6 bg-background-light dark:bg-background-dark border border-primary/20 dark:border-primary/30 rounded-lg p-6">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium">Attendance vs Grades</p>
                  <p className="text-4xl font-bold">
                    {data.attendanceVsGrades.averageGrade}%
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-black/60 dark:text-white/60">All Subjects</p>
                    <p className="text-sm font-medium text-primary">
                      +{data.attendanceVsGrades.change}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 items-end justify-items-center flex-1 min-h-[200px] border-t border-primary/20 dark:border-primary/30 pt-4">
                  {data.attendanceVsGrades.subjects.map((subject, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-end w-full h-full gap-2"
                    >
                      <div
                        className="w-full bg-primary/20 dark:bg-primary/30 rounded-t"
                        style={{ height: `${subject.grade}%` }}
                      ></div>
                      <p className="text-xs font-bold tracking-wider">{subject.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
