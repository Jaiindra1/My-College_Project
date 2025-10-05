import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageStudentsAttendance = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const viewAttendance = async (studentId) => {
    setSelectedStudent(studentId);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/attendance/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(res.data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>👩‍🎓 Manage Students & Attendance</h2>

      {/* ====== STUDENTS TABLE ====== */}
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Current Semester</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((s) => (
              <tr key={s.student_id}>
                <td>{s.roll_no}</td>
                <td>{s.name}</td>
                <td>{s.current_sem_id || '-'}</td>
                <td>{s.status}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => viewAttendance(s.student_id)}
                  >
                    View Attendance
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No students found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ====== ATTENDANCE TABLE ====== */}
      {selectedStudent && (
        <div className="mt-4">
          <h4>📊 Attendance for Student ID: {selectedStudent}</h4>
          <table className="table table-bordered mt-2">
            <thead>
              <tr>
                <th>Month</th>
                <th>Subject</th>
                <th>Total Classes</th>
                <th>Attended</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length > 0 ? (
                attendance.map((a, i) => (
                  <tr key={i}>
                    <td>{a.month}</td>
                    <td>{a.subject_name}</td>
                    <td>{a.total_classes}</td>
                    <td>{a.attended_classes}</td>
                    <td>{a.percentage}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No attendance records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageStudentsAttendance;
