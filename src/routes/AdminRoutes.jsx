import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import StudentList from "../pages/Students/StudentList";
import AddStudent from "../pages/Students/AddStudent";
import AttendanceUpload from "../pages/Attendance/AttendanceUpload";
import AttendanceSummary from "../pages/Attendance/AttendanceSummary";
import ExamList from "../pages/Exams/ExamList";
import AddExam from "../pages/Exams/AddExam";
import UploadResults from "../pages/Exams/UploadResults";
import SupplyResults from "../pages/Exams/SupplyResults";
import AdminTimetable from "../pages/Timetable/AdminTimetable";
import CompanyList from "../pages/Placements/CompanyList";
import AddCompany from "../pages/Placements/AddCompany";
import RegisterStudent from "../pages/Placements/RegisterStudent";
import UpdateStatus from "../pages/Placements/UpdateStatus";
import ManageFees from "../pages/Placements/ManageFees";
import FeeListManagement from "../components/FeeManagement/FeeList";
import AddFee from "../components/FeeManagement/AddFee";
import UpdateFee from "../components/FeeManagement/UpdateFee";
import PendingFees from "../components/FeeManagement/PendingFees";
import FeeDashboard from "../components/FeeManagement/FeeDashboard";
import ManageStudentsAttendance from "../components/Admin/ManageStudentsAttendance";
import AdminReports from "../pages/Reports/AdminReports";
import FacultyList from "../pages/Faculty/FacultyList";
import AddFaculty from "../pages/Faculty/AddFaculty";
import EditFaculty from "../pages/Faculty/EditFaculty";
import NotificationsList from "../pages/Notifications/NotificationsList";
import AddNotification from "../pages/Notifications/AddNotification";
import EditNotification from "../pages/Notifications/EditNotification";
import PlacementsDashboard from "../pages/Placements/PlacementsDashboard";
import AdminUploadImage from "../pages/AdminUploadImage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="students" element={<StudentList />} />
      <Route path="students/add" element={<AddStudent />} />
      <Route path="attendance/upload" element={<AttendanceUpload />} />
      <Route path="attendance/summary" element={<AttendanceSummary />} />
      <Route path="exams" element={<ExamList />} />
      <Route path="exams/add" element={<AddExam />} />
      <Route path="exams/upload" element={<UploadResults />} />
      <Route path="exams/supply" element={<SupplyResults />} />
      <Route path="timetable" element={<AdminTimetable />} />
      <Route path="placements" element={<PlacementsDashboard />} />
      <Route path="placements/companies" element={<CompanyList />} />
      <Route path="placements/add-company" element={<AddCompany />} />
      <Route path="placements/register-student" element={<RegisterStudent />} />
      <Route path="placements/update-status" element={<UpdateStatus />} />
      <Route path="placements/manage-fees" element={<ManageFees />} />
      <Route path="feesList" element={<FeeListManagement />} />
      <Route path="fees/add" element={<AddFee />} />
      <Route path="fees/update" element={<UpdateFee />} />
      <Route path="fees/pending" element={<PendingFees />} />
      <Route path="fees" element={<FeeDashboard />} />
      <Route path="students/attendance" element={<ManageStudentsAttendance />} />
      <Route path="reports" element={<AdminReports />} />
      <Route path="faculty" element={<FacultyList />} />
      <Route path="faculty/add" element={<AddFaculty />} />
      <Route path="faculty/edit/:id" element={<EditFaculty />} />
      <Route path="notifications" element={<NotificationsList />} />
      <Route path="notifications/add" element={<AddNotification />} />
      <Route path="notifications/edit/:id" element={<EditNotification />} />
      <Route path="upload-image" element={<AdminUploadImage />} />
      <Route path="*" element={<h2 className="p-8 text-center">Page Not Found</h2>} />
    </Routes>
  );
}
