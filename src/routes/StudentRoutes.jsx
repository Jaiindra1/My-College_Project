import { Routes, Route } from "react-router-dom";
import StudentDashboard from "../pages/Dashboard/StudentDashboard";
import StudentAttendance from "../pages/Attendance/StudentAttendance";
import StudentTimetable from "../pages/Timetable/StudentTimetable";
import UpcomingExams from "../pages/Exams/UpcomingExams";
import Results from "../pages/Exams/Results";
import StudentPlacements from "../pages/Placements/StudentPlacements";
import StudentNotifications from "../pages/Notifications/StudentNotifications";
import FeeManagement from "../pages/Fees/FeeManagement";
import ProfileSettings from "../pages/Students/ProfileSettings";
import AnalyticsDashboard from "../pages/analytics/AnalyticsDashboard";
import HelpDesk from "../pages/Students/HelpDesk";


const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      <Route  path="/attendance" element={ <StudentAttendance /> } />
      <Route path="/timetable" element={<StudentTimetable />} />
      <Route path="/exams" element={<UpcomingExams />} />
      <Route path="/results" element={<Results />} />
      <Route path="/placements" element={<StudentPlacements />} />
      <Route path="/notifications" element={<StudentNotifications />} />
      <Route path="/fee" element={<FeeManagement />} />
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/analytics" element={<AnalyticsDashboard />} />
      <Route path="/helpdesk" element={<HelpDesk />} />
      <Route path="*" element={<h2 className="p-8 text-center">Page Not Found</h2>} />
    </Routes>
  );
};

export default StudentRoutes;
