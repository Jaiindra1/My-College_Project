
const API_URL = "https://my-college-project-server.onrender.com/api/reports";

const API_URL = "https://my-college-project-server.onrender.com/reports";

export async function fetchAttendanceSummary(token) {
  const res = await fetch(`${API_URL}/attendance/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch attendance summary");
  return res.json();
}

export async function fetchAttendanceBySubject(subjectId, token) {
  const res = await fetch(`${API_URL}/attendance/subject/${subjectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch subject attendance");
  return res.json();
}

export async function fetchAttendanceByStudent(studentId, token) {
  const res = await fetch(`${API_URL}/attendance/student/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch student attendance");
  return res.json();
}

export async function fetchActivityLogs(token) {
  const res = await fetch(`${API_URL}/activity-logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch activity logs");
  return res.json();
}
