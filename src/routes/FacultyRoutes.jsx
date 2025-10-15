import { Routes, Route } from "react-router-dom";
import FacultyDashboard from "../pages/Dashboard/FacultyDashboard";
import FacultyAttendance from "../pages/Attendance/FacultyAttendance";
import FacultyAttendanceAnalytics from "../pages/Attendance/FacultyAttendanceAnalytics";
import FacultyProfile from "../pages/Faculty/FacultyProfile";
import FacultyReports from "../pages/Faculty/FacultyReports";
import FacultyAnnouncementList from "../pages/Faculty/FacultyAnnouncementsList";
import FacultyAnnouncementAdd from "../pages/Faculty/FacultyAnnouncementAdd";
import FacultyAnnouncementPreview from "../pages/Faculty/FacultyAnnouncementPreview";
import FacultyMessages from "../pages/Faculty/FacultyMessages";
import FacultyTimetable from "../pages/Faculty/FacultyTimetable";
import FacultyMarksEntry from "../pages/Faculty/FacultyMarksEntry" 

export default function FacultyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FacultyDashboard />} />
      <Route path="/FacultyAttendance" element={<FacultyAttendance />} />
      <Route path="/FacultyAttendanceAnalytics" element={<FacultyAttendanceAnalytics />} />
      <Route path="/FacultyProfile" element={<FacultyProfile />} />
      <Route path="/FacultyReports" element={<FacultyReports />} />
      <Route path="/FacultyAnnouncementList" element={<FacultyAnnouncementList />} />
      <Route path="/FacultyAnnouncementAdd" element={<FacultyAnnouncementAdd />} />
      <Route path="/FacultyMessages" element={<FacultyMessages />} />
      <Route path="/FacultyAnnouncementPreview/:id" element={<FacultyAnnouncementPreview />} />
      <Route path="/FacultyTimetable" element={<FacultyTimetable />} />
      <Route path="/FacultyMarksEntry" element={<FacultyMarksEntry />} />
      <Route path="FacultyAttendance" element={<FacultyAttendance />} />
      <Route path="FacultyAttendanceAnalytics" element={<FacultyAttendanceAnalytics />} />
      <Route path="FacultyProfile" element={<FacultyProfile />} />
      <Route path="FacultyReports" element={<FacultyReports />} />
      <Route path="FacultyAnnouncementList" element={<FacultyAnnouncementList />} />
      <Route path="FacultyAnnouncementAdd" element={<FacultyAnnouncementAdd />} />
      <Route path="FacultyMessages" element={<FacultyMessages />} />
      <Route path="FacultyAnnouncementPreview/:id" element={<FacultyAnnouncementPreview />} />
      <Route path="FacultyTimetable" element={<FacultyTimetable />} />
      <Route path="FacultyMarksEntry" element={<FacultyMarksEntry />} />
      <Route path="*" element={<h2 className="p-8 text-center">Page Not Found</h2>} />
    </Routes>
  );
}
